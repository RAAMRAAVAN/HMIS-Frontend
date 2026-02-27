'use client';

import { useEffect, useState } from "react";
import { Box, Divider } from "@mui/material";
import LeftSlider from "./LeftSlider";
import Chats from "./Chats/Chats";
import Chat from "./Chats/Chat/Chat";
import { getSocket } from "@/utils/socket";

const Main = ({ loading, userID, fromID, setLoading, setUserID }) => {
  const [contactPerson, setContactPerson] = useState(null);
  const [contactPersonsID, setContactPersonsID] = useState(null);
  const [selected, setSelected] = useState("Chats");

  const [messages, setMessages] = useState([]);
  const [lastMessage, setLastMessage] = useState({});

  const socket = getSocket();

  // ⭐ Register socket
  useEffect(() => {
    if (!socket || !fromID) return;

    socket.emit("register", String(fromID));
  }, [socket, fromID]);

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

  const handleLocalSend = ({ toID, message }) => {
    if (!fromID || !toID || !message?.trim()) return;
    setMessages(prev => [
      ...prev,
      {
        from: String(fromID),
        to: String(toID),
        text: message,
        timestamp: Date.now()
      }
    ]);
  };

  // ⭐ Last message map
  useEffect(() => {
    if (!fromID) return;

    const map = {};
    messages.forEach(msg => {
      const other =
        msg.from === fromID ? msg.to :
        msg.to === fromID ? msg.from :
        null;

      if (other) map[other] = msg.text;
    });

    setLastMessage(map);
  }, [messages, fromID]);

  // ⭐ Filter chat view
  const filteredMessages = messages.filter(
    m =>
      (m.from === fromID && m.to === contactPersonsID) ||
      (m.from === contactPersonsID && m.to === fromID)
  );

  return (
    <Box display='flex' width='100%' height='100vh'>
      <LeftSlider userID={userID} />
      <Divider orientation="vertical" flexItem sx={{ borderColor: '#333' }} />

      <Chats
        userID={userID}
        contactPerson={contactPerson}
        setContactPerson={setContactPerson}
        contactPersonsID={contactPersonsID}
        setContactPersonsID={setContactPersonsID}
        selected={selected}
        lastMessage={lastMessage}
        setSelected={setSelected}
        setUserID={setUserID}
      />

      <Divider orientation="vertical" flexItem sx={{ borderColor: '#333' }} />

      <Chat
        userID={userID}
        fromID={fromID}
        contactPerson={contactPerson}
        selected={selected}
        setSelected={setSelected}
        contactPersonsID={contactPersonsID}
        messages={filteredMessages}
        onLocalSend={handleLocalSend}
      />
    </Box>
  );
};

export default Main;
