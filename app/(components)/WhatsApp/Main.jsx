'use client';

import { useEffect, useState } from "react";
import { Box, Divider } from "@mui/material";
import LeftSlider from "./LeftSlider";
import Chats from "./Chats/Chats";
import Chat from "./Chats/Chat/Chat";
import { getSocket } from "@/utils/socket";

const Main = ({ loading, userID, fromID, fromEmail, setLoading, setUserID }) => {
  const [contactPerson, setContactPerson] = useState(null);
  const [contactPersonId, setContactPersonId] = useState(null);
  const [contactPersonEmail, setContactPersonEmail] = useState(null);
  const [selected, setSelected] = useState("Chats");

  const [messages, setMessages] = useState([]);
  const [lastMessage, setLastMessage] = useState({});

  const socket = getSocket();

  // ⭐ Register socket
  useEffect(() => {
    if (!socket || !fromEmail) return;

    socket.emit("register", String(fromEmail));
  }, [socket, fromEmail]);

  // ⭐ Listen for private messages
  useEffect(() => {
    if (!socket) return;

    const handlePrivateMessage = (payload) => {
      const from = String(payload.from ?? payload.fromID ?? payload.fromUserId ?? "");
      const to = String(payload.to ?? payload.toID ?? payload.toUserId ?? "");
      const text = payload.text ?? payload.message ?? "";
      if (!from || !to || !text) return;

      setMessages(prev => [
        ...prev,
        { from, to, text, timestamp: payload.timestamp ?? Date.now() }
      ]);
    };

    socket.on("privateMessage", handlePrivateMessage);

    return () => socket.off("privateMessage", handlePrivateMessage);
  }, [socket]);

  const handleLocalSend = ({ toEmail, message }) => {
    if (!fromEmail || !toEmail || !message?.trim()) return;
    setMessages(prev => [
      ...prev,
      {
        from: String(fromEmail),
        to: String(toEmail),
        text: message,
        timestamp: Date.now()
      }
    ]);
  };

  // ⭐ Last message map
  useEffect(() => {
    if (!fromEmail) return;

    const map = {};
    messages.forEach(msg => {
      const other =
        msg.from === fromEmail ? msg.to :
        msg.to === fromEmail ? msg.from :
        null;

      if (other) map[other] = msg.text;
    });

    setLastMessage(map);
  }, [messages, fromEmail]);

  // ⭐ Filter chat view
  const filteredMessages = messages.filter(
    m =>
      (m.from === fromEmail && m.to === contactPersonEmail) ||
      (m.from === contactPersonEmail && m.to === fromEmail)
  );

  return (
    <Box display='flex' width='100%' height='100vh'>
      <LeftSlider userID={userID} />
      <Divider orientation="vertical" flexItem sx={{ borderColor: '#333' }} />

      <Chats
        userID={userID}
        contactPerson={contactPerson}
        setContactPerson={setContactPerson}
        contactPersonId={contactPersonId}
        setContactPersonId={setContactPersonId}
        contactPersonEmail={contactPersonEmail}
        setContactPersonEmail={setContactPersonEmail}
        selected={selected}
        lastMessage={lastMessage}
        setSelected={setSelected}
        setUserID={setUserID}
      />

      <Divider orientation="vertical" flexItem sx={{ borderColor: '#333' }} />

      <Chat
        userID={userID}
        fromID={fromID}
        fromEmail={fromEmail}
        contactPerson={contactPerson}
        selected={selected}
        setSelected={setSelected}
        contactPersonId={contactPersonId}
        contactPersonEmail={contactPersonEmail}
        messages={filteredMessages}
        onLocalSend={handleLocalSend}
      />
    </Box>
  );
};

export default Main;
