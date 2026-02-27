// lib/socket.js
import { Server } from "socket.io";

export function getIO() {
  if (!global.io) {
    global.io = new Server(globalThis.server, {
      path: "/api/socketio",
      cors: { origin: "*" },
    });

    global.io.on("connection", (socket) => {
      console.log("Socket connected:", socket.id);
    });

    console.log("Socket.IO server started");
  }

  return global.io;
}
