// lib/server.js
export let httpServer = null;

export function setServer(s) {
  if (!httpServer) {
    httpServer = s;
  }
}

export function getServer() {
  return httpServer;
}
