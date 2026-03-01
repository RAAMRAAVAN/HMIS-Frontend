#!/usr/bin/env bash
set -euo pipefail

NEXTJS_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BACKEND_DIR="$(cd "$NEXTJS_DIR/../hmis-backend" && pwd)"

get_wsl_ip() {
  hostname -I | awk '{print $1}'
}

get_windows_lan_ip() {
  powershell.exe -NoProfile -Command '$cfg=Get-NetIPConfiguration | Where-Object { $_.IPv4DefaultGateway -ne $null -and $_.NetAdapter.Status -eq "Up" -and $_.InterfaceAlias -notmatch "vEthernet|WSL|Hyper-V" }; if($cfg){$cfg[0].IPv4Address.IPAddress}' 2>/dev/null | tr -d '\r'
}

setup_windows_networking() {
  local wsl_ip="$1"
  local ps_script_wsl="$NEXTJS_DIR/scripts/setup-windows-portproxy.ps1"
  local ps_script_win
  ps_script_win="$(wslpath -w "$ps_script_wsl")"

  if powershell.exe -NoProfile -ExecutionPolicy Bypass -File "$ps_script_win" -WslIp "$wsl_ip" >/dev/null 2>&1; then
    echo "✅ Windows networking rules updated automatically"
  else
    echo "⚠️ Could not update Windows networking rules in current shell (likely needs Admin)."
    echo "   Attempting UAC-elevated setup..."

    local elevated_command
    elevated_command="Start-Process powershell -Verb RunAs -Wait -ArgumentList '-ExecutionPolicy Bypass -File \"$ps_script_win\" -WslIp \"$wsl_ip\"'"

    if powershell.exe -NoProfile -Command "$elevated_command" >/dev/null 2>&1; then
      echo "✅ Windows networking rules updated via UAC-elevated PowerShell"
    else
      echo "⚠️ UAC-elevated setup was not completed."
      echo "   Run this in Windows PowerShell (Admin):"
      echo "   powershell -ExecutionPolicy Bypass -File \"$ps_script_win\" -WslIp \"$wsl_ip\""
    fi
  fi

  local mapping_count
  mapping_count=$(netsh.exe interface portproxy show v4tov4 | tr -d '\r' | grep -Ec "0\.0\.0\.0[[:space:]]+3001[[:space:]]+$wsl_ip[[:space:]]+3001|0\.0\.0\.0[[:space:]]+5000[[:space:]]+$wsl_ip[[:space:]]+5000|0\.0\.0\.0[[:space:]]+3443[[:space:]]+$wsl_ip[[:space:]]+3443" || true)

  if [[ "$mapping_count" -eq 3 ]]; then
    echo "✅ Portproxy target verification passed ($wsl_ip)"
    return 0
  fi

  echo "❌ Portproxy target verification failed."
  echo "   Expected connectaddress=$wsl_ip for ports 3001/5000/3443"
  echo "   Current mappings:"
  netsh.exe interface portproxy show v4tov4 | tr -d '\r'
  echo "   Fix command (Windows PowerShell Admin):"
  echo "   powershell -ExecutionPolicy Bypass -File \"$ps_script_win\" -WslIp \"$wsl_ip\""
  return 0
}

kill_port_listeners() {
  local port="$1"
  local pids
  pids=$(ss -ltnp "sport = :$port" 2>/dev/null | awk -F'pid=' 'NR>1 { split($2, a, ","); if (a[1] ~ /^[0-9]+$/) print a[1] }' | sort -u)

  if [[ -n "$pids" ]]; then
    echo "⚠️ Stopping existing process on :$port (PID: $pids)"
    kill $pids 2>/dev/null || true
    sleep 1
  fi
}

WSL_IP="$(get_wsl_ip)"

if [[ -z "$WSL_IP" ]]; then
  echo "❌ Could not detect WSL IP from hostname -I"
  exit 1
fi

LAN_IP="$(get_windows_lan_ip)"

if [[ -z "$LAN_IP" ]]; then
  echo "⚠️ Could not detect Windows LAN IP. Falling back to WSL IP: $WSL_IP"
  LAN_IP="$WSL_IP"
fi

echo "🌐 Windows LAN IP: $LAN_IP"
echo "🧩 WSL IP: $WSL_IP"

cd "$NEXTJS_DIR"
node ./scripts/set-lan-ip.mjs "$LAN_IP"
bash ./scripts/setup-lan-https.sh "$LAN_IP"
setup_windows_networking "$WSL_IP"

kill_port_listeners 5000
kill_port_listeners 3001
kill_port_listeners 3443

echo "🚀 Starting backend, frontend, and HTTPS gateway..."

(
  cd "$BACKEND_DIR"
  npm start
) &
BACKEND_PID=$!

(
  cd "$NEXTJS_DIR"
  npm run dev
) &
FRONTEND_PID=$!

(
  cd "$NEXTJS_DIR"
  npm run https:gateway
) &
GATEWAY_PID=$!

cleanup() {
  echo "🛑 Stopping stack..."
  kill "$BACKEND_PID" "$FRONTEND_PID" "$GATEWAY_PID" 2>/dev/null || true
}

trap cleanup INT TERM EXIT

echo "✅ Stack started"
echo "   Backend:  http://$LAN_IP:5000"
echo "   Frontend: http://$LAN_IP:3001"
echo "   Gateway:  https://$LAN_IP:3443"
echo ""
echo "📱 Open this on other devices (same network):"
echo "   https://$LAN_IP:3443"
echo ""
echo "If certificate warning appears, install/trust:"
echo "   $NEXTJS_DIR/certs/lan-ca.crt"

wait -n "$BACKEND_PID" "$FRONTEND_PID" "$GATEWAY_PID"
STATUS=$?

echo "⚠️ One service exited (code $STATUS)."
exit "$STATUS"
