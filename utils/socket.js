// utils/socket.js
import { io } from "socket.io-client";
import { getChatApiBaseUrl } from "./chatApiBase";

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(getChatApiBaseUrl(), {
      transports: ["websocket"],
      withCredentials: true,
      timeout: 10000,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
      randomizationFactor: 0.5,
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
  socket = null;
};
