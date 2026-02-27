#!/usr/bin/env bash
set -euo pipefail

LAN_IP="${1:-10.153.0.41}"
CERT_DIR="$(cd "$(dirname "$0")/.." && pwd)/certs"

mkdir -p "$CERT_DIR"

CA_KEY="$CERT_DIR/lan-ca.key"
CA_CRT="$CERT_DIR/lan-ca.crt"
SERVER_KEY="$CERT_DIR/lan-server.key"
SERVER_CSR="$CERT_DIR/lan-server.csr"
SERVER_CRT="$CERT_DIR/lan-server.crt"
EXT_FILE="$CERT_DIR/lan-server.ext"

if [[ ! -f "$CA_KEY" || ! -f "$CA_CRT" ]]; then
  openssl genrsa -out "$CA_KEY" 4096
  openssl req -x509 -new -nodes -key "$CA_KEY" -sha256 -days 3650 \
    -out "$CA_CRT" -subj "/C=IN/ST=Assam/L=Guwahati/O=HMIS/OU=LAN/CN=HMIS Local CA"
fi

openssl genrsa -out "$SERVER_KEY" 2048
openssl req -new -key "$SERVER_KEY" -out "$SERVER_CSR" \
  -subj "/C=IN/ST=Assam/L=Guwahati/O=HMIS/OU=LAN/CN=$LAN_IP"

cat > "$EXT_FILE" <<EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
IP.1 = $LAN_IP
DNS.1 = localhost
DNS.2 = 127.0.0.1
EOF

openssl x509 -req -in "$SERVER_CSR" -CA "$CA_CRT" -CAkey "$CA_KEY" -CAcreateserial \
  -out "$SERVER_CRT" -days 825 -sha256 -extfile "$EXT_FILE"

echo "✅ Certificates generated in: $CERT_DIR"
echo "  - CA cert (install on phone): $CA_CRT"
echo "  - Server cert: $SERVER_CRT"
echo "  - Server key:  $SERVER_KEY"
