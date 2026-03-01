param(
  [Parameter(Mandatory = $true)]
  [string]$WslIp,

  [string]$Ports = "3001,5000,3443"
)

$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole(
  [Security.Principal.WindowsBuiltInRole]::Administrator
)

if (-not $isAdmin) {
  Write-Error "Administrator privileges required. Re-run this script as Administrator."
  exit 1
}

$portList = $Ports.Split(",") | ForEach-Object { $_.Trim() } | Where-Object { $_ -match '^\d+$' }

if (-not $portList -or $portList.Count -eq 0) {
  Write-Error "No valid ports provided."
  exit 1
}

foreach ($port in $portList) {
  & netsh interface portproxy delete v4tov4 listenaddress=0.0.0.0 listenport=$port | Out-Null
  & netsh interface portproxy add v4tov4 listenaddress=0.0.0.0 listenport=$port connectaddress=$WslIp connectport=$port | Out-Null

  $ruleName = "HMIS LAN $port"
  & netsh advfirewall firewall add rule name="$ruleName" dir=in action=allow protocol=TCP localport=$port | Out-Null
}

Write-Host "✅ Windows portproxy + firewall updated"
Write-Host "   WSL target: $WslIp"
Write-Host "   Ports: $($portList -join ', ')"
