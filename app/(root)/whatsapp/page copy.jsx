'use client';

import { useEffect, useState } from "react";
import { Box, Divider } from "@mui/material";
import LeftSlider from "../../(components)/WhatsApp/LeftSlider";
import Chats from "../../(components)/WhatsApp/Chats/Chats";
import Chat from "../../(components)/WhatsApp/Chats/Chat/Chat";
import LoginPage from "../../(components)/WhatsApp/LoginPage";
import { getSocket, disconnectSocket } from "@/utils/socket";

const WhatsApp = () => {

  const [loading, setLoading] = useState(true);
  const [userID, setUserID] = useState(null);
  const [fromID, setFromID ] = useState(null);
  const [contactPerson, setContactPerson] = useState(null);
  const [contactPersonsID, setContactPersonsID] = useState(null);
  const [selected, setSelected] = useState("Chats");
  console.log("selected", contactPerson);

  // all messages
  const [messages, setMessages] = useState([]);

  // 👇 last message per user
  const [lastMessage, setLastMessage] = useState({});

  const socket = getSocket();


  // ====== AUTO LOGIN ======
  useEffect(() => {
    const savedUser = sessionStorage.getItem("userID");
    const savedID= sessionStorage.getItem("fromID");

    if (savedUser) {
      setUserID(savedUser);
      setFromID(savedID);

      const socket = getSocket();
      socket.emit("register", savedUser);
    }

    setLoading(false);

    return () => disconnectSocket();
  }, []);


  // ====== LISTEN FOR NEW MESSAGES ======
  useEffect(() => {
    if (!socket) return;

    socket.on("privateMessage", ({ from, to, text }) => {
      console.log("📩 Received:", { from, to, text });

      setMessages(prev => [
        ...prev,
        { from, to, text, timestamp: Date.now() }
      ]);
    });

    return () => socket.off("privateMessage");

  }, [socket]);



  // ====== BUILD LAST MESSAGE MAP ======
  useEffect(() => {
    if (!userID) return;

    const map = {};

    messages.forEach(msg => {
      const otherUser =
        msg.from === userID ? msg.to :
        msg.to === userID ? msg.from :
        null;

      if (!otherUser) return;

      // latest overwrites
      map[otherUser] = msg.text;
    });

    setLastMessage(map);

  }, [messages, userID]);



  // ====== FILTER CHAT WINDOW MESSAGES ======
  const filteredMessages = messages.filter(
    m =>
      (m.from === userID && m.to === contactPerson) ||
      (m.from === contactPerson && m.to === userID)
  );



  return (
    <>
      {loading ? null : (
        <Box display='flex' width='100%' height='100vh'>

          {!userID ? (
            <LoginPage userID={userID} setUserID={setUserID} setFromID ={setFromID}/>
          ) : (
            <>
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
              />
            </>
          )}

        </Box>
      )}
    </>
  );
};

export default WhatsApp;
