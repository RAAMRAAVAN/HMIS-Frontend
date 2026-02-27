// utils/socket.js
import { io } from "socket.io-client";
import { getChatApiBaseUrl } from "./chatApiBase";

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(getChatApiBaseUrl(), {
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
