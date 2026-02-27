// socket-server.js
import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*", // allow all origins for testing
  },
  path: "/api/socket",
});

globalThis.socketServer = io; // expose globally for POST route

io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("⚠️ Socket disconnected:", socket.id);
  });
});

httpServer.listen(3002, () => {
  console.log("🔥 Socket.IO server running on port 3002");
});
