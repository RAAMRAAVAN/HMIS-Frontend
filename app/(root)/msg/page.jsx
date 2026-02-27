"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_CHAT_API_BASE_URL || "http://localhost:5000";
const socket = io(API_BASE_URL);

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);
    });

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.disconnect();
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("sendMessage", {
      text: message,
      time: new Date().toLocaleTimeString()
    });

    setMessage("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>HMIS Socket Chat</h2>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message"
      />
      <button onClick={sendMessage}>Send</button>

      <ul>
        {messages.map((m, i) => (
          <li key={i}>
            [{m.time}] {m.text}
          </li>
        ))}
      </ul>
    </div>
  );
}