'use client';

import { useEffect, useRef, useState } from "react";
import { Box, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import LeftSlider from "./LeftSlider";
import Chats from "./Chats/Chats";
import Chat from "./Chats/Chat/Chat";
import { getSocket } from "@/utils/socket";
import { getChatApiBaseUrl } from "@/utils/chatApiBase";
import { toEpochMs } from "@/utils/chatTime";

const Main = ({ loading, userID, fromID, fromEmail, setLoading, setUserID }) => {
  const API_BASE_URL = getChatApiBaseUrl();
  const [contactPerson, setContactPerson] = useState(null);
  const [contactPersonId, setContactPersonId] = useState(null);
  const [contactPersonEmail, setContactPersonEmail] = useState(null);
  const [selected, setSelected] = useState("Chats");

  const [messages, setMessages] = useState([]);
  const [lastMessage, setLastMessage] = useState({});
  const [unseenCounts, setUnseenCounts] = useState({});

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fromEmailRef = useRef(null);
  const contactEmailRef = useRef(null);

  const socket = getSocket();

  useEffect(() => {
    fromEmailRef.current = fromEmail ? String(fromEmail).toLowerCase() : null;
  }, [fromEmail]);

  useEffect(() => {
    contactEmailRef.current = contactPersonEmail ? String(contactPersonEmail).toLowerCase() : null;
  }, [contactPersonEmail]);

  // ⭐ Register socket
  useEffect(() => {
    if (!socket || !fromEmail) return;

    const registerUser = () => {
      socket.emit("register", String(fromEmail).toLowerCase());
    };

    const heartbeat = () => {
      socket.emit("presencePing");
    };

    registerUser();
    heartbeat();
    socket.on("connect", registerUser);
    const heartbeatInterval = setInterval(heartbeat, 10_000);

    return () => {
      clearInterval(heartbeatInterval);
      socket.off("connect", registerUser);
    };
  }, [socket, fromEmail]);

  useEffect(() => {
    if (!fromID) return;

    const fetchChatOverview = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/users/chat-overview`, {
          credentials: "include",
        });

        if (!res.ok) return;

        const data = await res.json();
        const list = data?.data || [];

        const lastMap = {};
        const unseenMap = {};

        list.forEach((item) => {
          const emailKey = String(item.email || "").toLowerCase();
          if (!emailKey) return;

          lastMap[emailKey] = item.last_message || "";
          unseenMap[emailKey] = Number(item.unseen_count || 0);
        });

        setLastMessage(lastMap);
        setUnseenCounts(unseenMap);
      } catch (error) {
        console.error("Failed to fetch chat overview", error);
      }
    };

    fetchChatOverview();
  }, [fromID]);

  useEffect(() => {
    if (!fromID || !contactPersonId || !contactPersonEmail) {
      setMessages([]);
      return;
    }

    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/users/chat-history/${contactPersonId}`, {
          credentials: "include",
        });

        if (!res.ok) {
          setMessages([]);
          return;
        }

        const data = await res.json();
        const normalizedMessages = (data?.data || []).map((message) => ({
          ...message,
          timestamp: toEpochMs(message.timestampMs ?? message.timestamp ?? message.createdAtMs ?? message.createdAt),
        }));
        setMessages(normalizedMessages);

        await fetch(`${API_BASE_URL}/api/users/chat-read/${contactPersonId}`, {
          method: "POST",
          credentials: "include",
        });

        setUnseenCounts((prev) => ({
          ...prev,
          [String(contactPersonEmail).toLowerCase()]: 0,
        }));
      } catch (error) {
        console.error("Failed to fetch chat history", error);
        setMessages([]);
      }
    };

    fetchHistory();
  }, [fromID, contactPersonId, contactPersonEmail]);

  // ⭐ Listen for private messages
  useEffect(() => {
    if (!socket) return;

    const handlePrivateMessage = (payload) => {
      const from = String(payload.from ?? payload.fromID ?? payload.fromUserId ?? "").toLowerCase();
      const to = String(payload.to ?? payload.toID ?? payload.toUserId ?? "").toLowerCase();
      const text = payload.text ?? payload.message ?? "";
      if (!from || !to || !text) return;

      const currentFromEmail = fromEmailRef.current;
      const currentContactEmail = contactEmailRef.current;
      if (!currentFromEmail) return;

      const messageItem = {
        id: payload.id ?? null,
        from,
        to,
        text,
        messageType: payload.messageType || "text",
        file: payload.file || null,
        timestamp: toEpochMs(payload.timestampMs ?? payload.createdAtMs ?? payload.timestamp ?? payload.createdAt),
      };

      const isActiveConversation =
        currentContactEmail &&
        ((from === currentFromEmail && to === currentContactEmail) ||
          (from === currentContactEmail && to === currentFromEmail));

      if (isActiveConversation) {
        setMessages((prev) => [...prev, messageItem]);

        if (to === currentFromEmail && from !== currentFromEmail && payload.id) {
          socket.emit("messageDelivered", {
            messageId: payload.id,
            from,
          });

          socket.emit("messageSeen", {
            messageId: payload.id,
            from,
          });
        }
      } else if (to === currentFromEmail && from !== currentFromEmail && payload.id) {
        socket.emit("messageDelivered", {
          messageId: payload.id,
          from,
        });
      }

      const otherEmail = from === currentFromEmail ? to : from;
      setLastMessage((prev) => ({
        ...prev,
        [otherEmail]: text,
      }));

      if (to === currentFromEmail && from !== currentFromEmail && from !== currentContactEmail) {
        setUnseenCounts((prev) => ({
          ...prev,
          [from]: (prev[from] || 0) + 1,
        }));
      }
    };

    socket.on("privateMessage", handlePrivateMessage);

    const handleMessageStatus = (payload) => {
      const messageId = payload?.messageId;
      const status = payload?.status;
      if (!messageId || !status) return;

      setMessages((prev) =>
        prev.map((item) =>
          item.id === messageId
            ? {
                ...item,
                status,
                isRead: status === "read" ? true : item.isRead,
                statusUpdatedAt: payload.updatedAt || Date.now(),
              }
            : item
        )
      );
    };

    socket.on("messageStatus", handleMessageStatus);

    return () => {
      socket.off("privateMessage", handlePrivateMessage);
      socket.off("messageStatus", handleMessageStatus);
    };
  }, [socket]);

  return (
    <Box display='flex' width='100%' height='100dvh' sx={{ minHeight: 0, backgroundColor: '#161717' }}>
      {!isMobile && (
        <>
          <LeftSlider userID={userID} />
          <Divider orientation="vertical" flexItem sx={{ borderColor: '#333' }} />
        </>
      )}

      {(!isMobile || !contactPersonEmail) && (
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
          unseenCounts={unseenCounts}
          setSelected={setSelected}
          setUserID={setUserID}
          fromID={fromID}
          fromEmail={fromEmail}
          isMobile={isMobile}
        />
      )}

      {!isMobile && <Divider orientation="vertical" flexItem sx={{ borderColor: '#333' }} />}

      {(!isMobile || !!contactPersonEmail) && (
        <Chat
          userID={userID}
          fromID={fromID}
          fromEmail={fromEmail}
          contactPerson={contactPerson}
          selected={selected}
          setSelected={setSelected}
          contactPersonId={contactPersonId}
          contactPersonEmail={contactPersonEmail}
          messages={messages}
          isMobile={isMobile}
          onBack={() => {
            setContactPerson(null);
            setContactPersonId(null);
            setContactPersonEmail(null);
          }}
        />
      )}
    </Box>
  );
};

export default Main;
