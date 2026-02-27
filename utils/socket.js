// utils/socket.js
import { io } from "socket.io-client";

let socket = null;
const SOCKET_BASE_URL = process.env.NEXT_PUBLIC_CHAT_API_BASE_URL || "http://localhost:5000";

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_BASE_URL, {
      transports: ["websocket"],
      withCredentials: true
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
  socket = null;
};
