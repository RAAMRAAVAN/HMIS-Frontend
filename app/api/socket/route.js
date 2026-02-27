import { Server } from "socket.io";

export const GET = async (request) => {
  // In App Router, request doesn't have `socket`, so we use `globalThis` to initialize once
  if (!globalThis.socketServer) {
    // Create a dummy HTTP server for Socket.IO
    const io = new Server({
      cors: { origin: "*" },
      path: "/api/socket",
    });

    io.on("connection", (socket) => {
      console.log("✅ Socket connected:", socket.id);
    });

    globalThis.socketServer = io;
    console.log("🔥 Socket.IO initialized");
  }

  return new Response("Socket running", { status: 200 });
};
