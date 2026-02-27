import fs from "fs";
import path from "path";
import https from "https";
import httpProxy from "http-proxy";

const FRONTEND_TARGET = process.env.FRONTEND_TARGET || "http://127.0.0.1:3001";
const BACKEND_TARGET = process.env.BACKEND_TARGET || "http://127.0.0.1:5000";
const HTTPS_PORT = Number(process.env.HTTPS_PORT || 3443);

const certDir = path.join(process.cwd(), "certs");
const keyPath = path.join(certDir, "lan-server.key");
const certPath = path.join(certDir, "lan-server.crt");

if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
  console.error("❌ Missing cert files.");
  console.error(`Run: ./scripts/setup-lan-https.sh <LAN_IP> in ${process.cwd()}`);
  process.exit(1);
}

const frontendProxy = httpProxy.createProxyServer({
  target: FRONTEND_TARGET,
  changeOrigin: true,
  ws: true,
});

const backendProxy = httpProxy.createProxyServer({
  target: BACKEND_TARGET,
  changeOrigin: true,
  ws: true,
});

const proxyErrorHandler = (label, req, res, error) => {
  console.error(`❌ ${label} proxy error:`, error.message);
  if (!res.headersSent) {
    res.writeHead(502, { "Content-Type": "application/json" });
  }
  res.end(JSON.stringify({ success: false, message: `${label} proxy failed` }));
};

frontendProxy.on("error", (error, req, res) => proxyErrorHandler("Frontend", req, res, error));
backendProxy.on("error", (error, req, res) => proxyErrorHandler("Backend", req, res, error));

const server = https.createServer(
  {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  },
  (req, res) => {
    const requestUrl = req.url || "";
    const isBackendRoute =
      requestUrl.startsWith("/api") ||
      requestUrl.startsWith("/socket.io") ||
      requestUrl.startsWith("/uploads");

    if (isBackendRoute) {
      backendProxy.web(req, res);
      return;
    }

    frontendProxy.web(req, res);
  }
);

server.on("upgrade", (req, socket, head) => {
  const requestUrl = req.url || "";
  const isBackendWs = requestUrl.startsWith("/socket.io");
  if (isBackendWs) {
    backendProxy.ws(req, socket, head);
    return;
  }
  frontendProxy.ws(req, socket, head);
});

server.listen(HTTPS_PORT, "0.0.0.0", () => {
  console.log(`🔒 HTTPS gateway running on https://0.0.0.0:${HTTPS_PORT}`);
  console.log(`   Frontend -> ${FRONTEND_TARGET}`);
  console.log(`   Backend  -> ${BACKEND_TARGET}`);
});
