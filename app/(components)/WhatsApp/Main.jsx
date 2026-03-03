'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, Divider, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import LeftSidebar from "./features/layout/LeftSidebar";
import ChatsPanel from "./features/chats/ChatsPanel";
import ChatPanel from "./features/chats/chat/ChatPanel";
import UserManagementPanel from "./features/users/UserManagementPanel";
import ProfileSettingsPanel from "./features/settings/ProfileSettingsPanel";
import { getSocket } from "@/utils/socket";
import { getChatApiBaseUrl } from "@/utils/chatApiBase";
import { toEpochMs } from "@/utils/chatTime";
import { trackCallAnomaly } from "@/utils/callAnomalyTracker";

const Main = ({ loading, userID, fromID, fromEmail, userRole, setLoading, setUserID, initialProfileImage = null, setUserProfileImage }) => {
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
  const [isCallOverlayVisible, setIsCallOverlayVisible] = useState(false);
  const [currentUserProfileImage, setCurrentUserProfileImage] = useState(initialProfileImage);
  const [contactProfileImage, setContactProfileImage] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fromEmailRef = useRef(null);
  const contactEmailRef = useRef(null);
  const usersByEmailRef = useRef(new Map());

  const socket = getSocket();
  const isAdminUser = String(userRole || "").toLowerCase() === "admin";
  const isChatsSelected = selected === "Chats";
  const isUsersSelected = isAdminUser && selected === "Users";
  const isSettingsSelected = selected === "Settings";
  const shouldRenderChatPanel = (isChatsSelected && (!isMobile || !!contactPersonEmail)) || isCallOverlayVisible;
  const chatOverlayOnlyMode = !isChatsSelected || (isMobile && !contactPersonEmail);
  const totalUnseenCount = useMemo(
    () => Object.values(unseenCounts || {}).reduce((sum, value) => sum + (Number(value) || 0), 0),
    [unseenCounts]
  );

  const buildRealtimeCallPreview = useCallback((call = null, isOutgoing = false) => {
    if (!call || typeof call !== "object") return "Call";

    const callType = call.callType === "video" ? "video" : "voice";
    const eventType = String(call.eventType || "").toLowerCase();

    if (eventType === "missed") return `Missed ${callType} call`;
    if (eventType === "declined") return `${isOutgoing ? "Outgoing" : "Incoming"} ${callType} call declined`;
    if (eventType === "completed") {
      const totalSeconds = Math.floor(Math.max(0, Number(call.durationMs) || 0) / 1000);
      const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
      const seconds = String(totalSeconds % 60).padStart(2, "0");
      return `${isOutgoing ? "Outgoing" : "Incoming"} ${callType} call • ${minutes}:${seconds}`;
    }

    return `${isOutgoing ? "Outgoing" : "Incoming"} ${callType} call`;
  }, []);

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
    setContactProfileImage(user.profile_image_url || null);
  }, [loadUsersIndex]);

  useEffect(() => {
    setCurrentUserProfileImage(initialProfileImage || null);
  }, [initialProfileImage]);

  useEffect(() => {
    if (!contactPersonEmail) {
      setContactProfileImage(null);
      return;
    }

    const emailKey = String(contactPersonEmail || "").toLowerCase();
    const usersMap = usersByEmailRef.current;
    const matchedUser = usersMap.get(emailKey);
    if (matchedUser) {
      setContactProfileImage(matchedUser.profile_image_url || null);
    }
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
      const rawText = payload.text ?? payload.message ?? "";
      const messageType = payload.messageType || "text";
      const isCallEvent = messageType === "call";
      const currentFromEmail = fromEmailRef.current;
      const normalizedCall = isCallEvent && payload.call && typeof payload.call === "object" ? payload.call : null;

      if (isCallEvent && !normalizedCall) {
        trackCallAnomaly({
          socket,
          code: "call-message-missing-call-payload",
          message: "Call message received without call payload object",
          severity: "warn",
          from: currentFromEmail,
          contact: from || to,
          details: {
            messageType,
            hasText: Boolean(rawText),
            payloadKeys: Object.keys(payload || {}),
          },
        });
      }

      const text = String(rawText || (isCallEvent ? buildRealtimeCallPreview(normalizedCall, from === currentFromEmail) : ""));
      if (!from || !to || (!text && !isCallEvent)) {
        trackCallAnomaly({
          socket,
          code: "private-message-invalid-shape",
          message: "Ignored private message due to missing required fields",
          severity: "warn",
          from: currentFromEmail,
          contact: from || to,
          details: {
            hasFrom: Boolean(from),
            hasTo: Boolean(to),
            hasText: Boolean(text),
            isCallEvent,
          },
        });
        return;
      }

      const currentContactEmail = contactEmailRef.current;
      if (!currentFromEmail) return;

      const messageItem = {
        id: payload.id ?? null,
        from,
        to,
        text,
        messageType,
        file: payload.file || null,
        call: normalizedCall,
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
  }, [buildRealtimeCallPreview, socket]);

  useEffect(() => {
    if (!socket || !fromEmail) return;

    const currentUserEmail = String(fromEmail).toLowerCase();

    const handleIncomingOffer = async (payload = {}) => {
      const to = String(payload.to || "").toLowerCase();
      const from = String(payload.from || "").toLowerCase();
      const callId = String(payload.callId || "").trim();
      const phase = payload.phase === "renegotiate" ? "renegotiate" : "invite";
      if (!to || !from || !callId || !payload?.sdp || to !== currentUserEmail || phase !== "invite") {
        if (to === currentUserEmail || (!to && Boolean(currentUserEmail))) {
          trackCallAnomaly({
            socket,
            code: "incoming-offer-invalid",
            message: "Incoming call offer ignored due to invalid payload",
            severity: "warn",
            from: currentUserEmail,
            contact: from,
            callId,
            details: {
              hasTo: Boolean(to),
              hasFrom: Boolean(from),
              hasCallId: Boolean(callId),
              hasSdp: Boolean(payload?.sdp),
              phase,
            },
          });
        }
        return;
      }

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
          <LeftSidebar
            userID={userID}
            selected={selected}
            onSelect={setSelected}
            isAdmin={isAdminUser}
            totalUnseenCount={totalUnseenCount}
            currentUserName={userID}
            currentUserAvatarSrc={currentUserProfileImage}
          />
          <Divider orientation="vertical" flexItem sx={{ borderColor: '#333' }} />
        </>
      )}

      {isUsersSelected ? (
        <UserManagementPanel />
      ) : isChatsSelected && (!isMobile || !contactPersonEmail) ? (
        <ChatsPanel
          userID={userID}
          contactPerson={contactPerson}
          setContactPerson={setContactPerson}
          contactPersonId={contactPersonId}
          setContactPersonId={setContactPersonId}
          contactPersonEmail={contactPersonEmail}
          setContactPersonEmail={setContactPersonEmail}
          setContactPresence={setContactPresence}
          setContactProfileImage={setContactProfileImage}
          currentUserProfileImage={currentUserProfileImage}
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

      {shouldRenderChatPanel && (
        <ChatPanel
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
          contactProfileImage={contactProfileImage}
          messages={messages}
          incomingCallOffer={incomingCallOffer}
          onIncomingCallOfferConsumed={() => setIncomingCallOffer(null)}
          onCallOverlayChange={setIsCallOverlayVisible}
          overlayOnlyMode={chatOverlayOnlyMode}
          isMobile={isMobile}
          onBack={() => {
            setContactPerson(null);
            setContactPersonId(null);
            setContactPersonEmail(null);
          }}
        />
      )}

      {!isUsersSelected && !isChatsSelected && (
      isSettingsSelected ? (
        <ProfileSettingsPanel
          userName={userID}
          userEmail={fromEmail}
          currentProfileImage={currentUserProfileImage}
          onProfileImageUpdated={(nextUrl) => {
            const normalized = nextUrl || null;
            setCurrentUserProfileImage(normalized);
            setUserProfileImage?.(normalized);

            const ownEmail = String(fromEmail || "").toLowerCase();
            if (ownEmail) {
              const updatedMap = new Map(usersByEmailRef.current);
              const existing = updatedMap.get(ownEmail) || {};
              updatedMap.set(ownEmail, {
                ...existing,
                profile_image_url: normalized,
              });
              usersByEmailRef.current = updatedMap;
            }

            if (String(contactPersonEmail || "").toLowerCase() === String(fromEmail || "").toLowerCase()) {
              setContactProfileImage(normalized);
            }
          }}
        />
      ) : (
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
      )
      )}
    </Box>
  );
};

export default Main;
