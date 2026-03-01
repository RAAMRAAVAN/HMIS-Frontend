'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, Divider, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import LeftSlider from "./LeftSlider";
import Chats from "./Chats/Chats";
import Chat from "./Chats/Chat/Chat";
import UserManagementPanel from "./Users/UserManagementPanel";
import { getSocket } from "@/utils/socket";
import { getChatApiBaseUrl } from "@/utils/chatApiBase";
import { toEpochMs } from "@/utils/chatTime";

const Main = ({ loading, userID, fromID, fromEmail, userRole, setLoading, setUserID }) => {
  const API_BASE_URL = getChatApiBaseUrl();
  const [contactPerson, setContactPerson] = useState(null);
  const [contactPersonId, setContactPersonId] = useState(null);
  const [contactPersonEmail, setContactPersonEmail] = useState(null);
  const [contactPresence, setContactPresence] = useState({ isOnline: false, lastSeen: null });
  const [selected, setSelected] = useState("Chats");

  const [messages, setMessages] = useState([]);
  const [lastMessage, setLastMessage] = useState({});
  const [unseenCounts, setUnseenCounts] = useState({});
  const [historyEmails, setHistoryEmails] = useState([]);
  const [lastMessageAt, setLastMessageAt] = useState({});
  const [incomingCallOffer, setIncomingCallOffer] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fromEmailRef = useRef(null);
  const contactEmailRef = useRef(null);
  const usersByEmailRef = useRef(new Map());

  const socket = getSocket();
  const isAdminUser = String(userRole || "").toLowerCase() === "admin";
  const isChatsSelected = selected === "Chats";
  const isUsersSelected = isAdminUser && selected === "Users";
  const totalUnseenCount = useMemo(
    () => Object.values(unseenCounts || {}).reduce((sum, value) => sum + (Number(value) || 0), 0),
    [unseenCounts]
  );

  useEffect(() => {
    fromEmailRef.current = fromEmail ? String(fromEmail).toLowerCase() : null;
  }, [fromEmail]);

  useEffect(() => {
    contactEmailRef.current = contactPersonEmail ? String(contactPersonEmail).toLowerCase() : null;
  }, [contactPersonEmail]);

  const loadUsersIndex = useCallback(async () => {
    if (usersByEmailRef.current.size > 0) return usersByEmailRef.current;

    try {
      const res = await fetch(`${API_BASE_URL}/api/users`, {
        credentials: "include",
      });
      if (!res.ok) return usersByEmailRef.current;

      const data = await res.json();
      const users = data?.data || [];
      const map = new Map();

      users.forEach((user) => {
        const emailKey = String(user?.email || "").toLowerCase();
        if (!emailKey) return;
        map.set(emailKey, user);
      });

      usersByEmailRef.current = map;
      return map;
    } catch (error) {
      console.error("Failed to load user index", error);
      return usersByEmailRef.current;
    }
  }, [API_BASE_URL]);

  const ensureConversationForEmail = useCallback(async (email) => {
    const emailKey = String(email || "").toLowerCase();
    if (!emailKey) return;

    if (String(contactEmailRef.current || "").toLowerCase() === emailKey) {
      return;
    }

    const usersMap = await loadUsersIndex();
    const user = usersMap.get(emailKey);
    if (!user) return;

    setSelected("Chats");
    setContactPerson(user.name || emailKey);
    setContactPersonId(String(user.id || ""));
    setContactPersonEmail(emailKey);
    setContactPresence({
      isOnline: Boolean(user.is_online),
      lastSeen: user.last_seen || null,
    });
  }, [loadUsersIndex]);

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

    let stopped = false;
    let timerId;

    const fetchChatOverview = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/users/chat-overview`, {
          credentials: "include",
        });

        if (!res.ok) return;

        const data = await res.json();
        const list = data?.data || [];

        const lastMap = {};
        const lastAtMap = {};
        const unseenMap = {};
        const historyList = [];

        list.forEach((item) => {
          const emailKey = String(item.email || "").toLowerCase();
          if (!emailKey) return;

          historyList.push(emailKey);
          lastMap[emailKey] = item.last_message || "";
          lastAtMap[emailKey] = Number(item.last_message_at_ms || 0) || 0;
          unseenMap[emailKey] = Number(item.unseen_count || 0);
        });

        if (!stopped) {
          setHistoryEmails(historyList);
          setLastMessage(lastMap);
          setLastMessageAt(lastAtMap);
          setUnseenCounts(unseenMap);
        }
      } catch (error) {
        console.error("Failed to fetch chat overview", error);
      }
    };

    fetchChatOverview();

    const scheduleNext = () => {
      if (stopped) return;
      const isHidden = typeof document !== "undefined" && document.hidden;
      const delay = isHidden ? 120000 : 45000;

      timerId = setTimeout(async () => {
        if (stopped) return;
        await fetchChatOverview();
        scheduleNext();
      }, delay);
    };

    const handleVisibilityChange = async () => {
      if (typeof document === "undefined") return;
      if (!document.hidden) {
        await fetchChatOverview();
      }
    };

    scheduleNext();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopped = true;
      if (timerId) clearTimeout(timerId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
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
      const messageTime = toEpochMs(payload.timestampMs ?? payload.createdAtMs ?? payload.timestamp ?? payload.createdAt) || Date.now();
      setLastMessage((prev) => ({
        ...prev,
        [otherEmail]: text,
      }));
      setLastMessageAt((prev) => ({
        ...prev,
        [otherEmail]: messageTime,
      }));
      setHistoryEmails((prev) => [otherEmail, ...prev.filter((email) => email !== otherEmail)]);

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

  useEffect(() => {
    if (!socket || !fromEmail) return;

    const currentUserEmail = String(fromEmail).toLowerCase();

    const handleIncomingOffer = async (payload = {}) => {
      const to = String(payload.to || "").toLowerCase();
      const from = String(payload.from || "").toLowerCase();
      const callId = String(payload.callId || "").trim();
      const phase = payload.phase === "renegotiate" ? "renegotiate" : "invite";
      if (!to || !from || !callId || !payload?.sdp || to !== currentUserEmail || phase !== "invite") return;

      await ensureConversationForEmail(from);

      setIncomingCallOffer({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        ...payload,
        callId,
        phase,
        from,
        to,
      });
    };

    socket.on("call:offer", handleIncomingOffer);

    return () => {
      socket.off("call:offer", handleIncomingOffer);
    };
  }, [ensureConversationForEmail, fromEmail, socket]);

  return (
    <Box display='flex' width='100%' height='100dvh' sx={{ minHeight: 0, backgroundColor: '#161717' }}>
      {!isMobile && (
        <>
          <LeftSlider
            userID={userID}
            selected={selected}
            onSelect={setSelected}
            isAdmin={isAdminUser}
            totalUnseenCount={totalUnseenCount}
          />
          <Divider orientation="vertical" flexItem sx={{ borderColor: '#333' }} />
        </>
      )}

      {isUsersSelected ? (
        <UserManagementPanel />
      ) : isChatsSelected && (!isMobile || !contactPersonEmail) ? (
        <Chats
          userID={userID}
          contactPerson={contactPerson}
          setContactPerson={setContactPerson}
          contactPersonId={contactPersonId}
          setContactPersonId={setContactPersonId}
          contactPersonEmail={contactPersonEmail}
          setContactPersonEmail={setContactPersonEmail}
          setContactPresence={setContactPresence}
          selected={selected}
          lastMessage={lastMessage}
          lastMessageAt={lastMessageAt}
          unseenCounts={unseenCounts}
          historyEmails={historyEmails}
          setSelected={setSelected}
          setUserID={setUserID}
          fromID={fromID}
          fromEmail={fromEmail}
          isMobile={isMobile}
        />
      ) : null}

      {!isMobile && isChatsSelected && <Divider orientation="vertical" flexItem sx={{ borderColor: '#333' }} />}

      {isChatsSelected && (!isMobile || !!contactPersonEmail) && (
        <Chat
          userID={userID}
          fromID={fromID}
          fromEmail={fromEmail}
          contactPerson={contactPerson}
          selected={selected}
          setSelected={setSelected}
          contactPersonId={contactPersonId}
          contactPersonEmail={contactPersonEmail}
          contactIsOnline={Boolean(contactPresence?.isOnline)}
          contactLastSeen={contactPresence?.lastSeen || null}
          messages={messages}
          incomingCallOffer={incomingCallOffer}
          onIncomingCallOfferConsumed={() => setIncomingCallOffer(null)}
          isMobile={isMobile}
          onBack={() => {
            setContactPerson(null);
            setContactPersonId(null);
            setContactPersonEmail(null);
          }}
        />
      )}

      {!isUsersSelected && !isChatsSelected && (
        <Box
          display='flex'
          flexDirection='column'
          width='100%'
          height='100dvh'
          sx={{ minHeight: 0, backgroundColor: '#161717' }}
          padding={{ xs: 1.5, md: 2, xl: 1 }}
        >
          <Typography sx={{ color: "#fff", fontSize: 20 }}>
            {selected}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Main;
