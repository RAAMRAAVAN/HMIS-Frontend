import { MoreVert } from "@mui/icons-material";
import { Box, Grow, IconButton, Typography } from "@mui/material";
import ChatSettingsMenu from "./settings/ChatSettingsMenu";
import SearchInput from "../../shared/SearchInput";
import ContactCard from "../../shared/ContactCard";
import { useEffect, useRef, useState } from "react";
import FilterChips from "../../shared/FilterChips";
import { getChatApiBaseUrl } from "@/utils/chatApiBase";
import { getSocket } from "@/utils/socket";

const ChatsPanel = ({ userID, setUserID,contactPerson, setContactPerson, selected, setSelected, lastMessage, lastMessageAt = {}, unseenCounts, historyEmails = [], setContactPersonId, setContactPersonEmail, setContactPresence, setContactProfileImage, currentUserProfileImage = null, fromID, fromEmail, isMobile = false }) => {

  const [settings1, setSettings1] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const socket = getSocket();
  const fetchUsersRef = useRef(async () => {});

  const youLabel = `${userID}  (You)`;
  const normalizedHistoryEmails = new Set((historyEmails || []).map((email) => String(email || "").toLowerCase()));
  const historyOrderMap = new Map((historyEmails || []).map((email, index) => [String(email || "").toLowerCase(), index]));

  const applySelection = (user) => {
    if (!user?.id || !user?.email) return;
    setContactPerson(user.name);
    setContactPersonId(String(user.id));
    setContactPersonEmail(String(user.email).toLowerCase());
    setContactProfileImage?.(user.profile_image_url || null);
    setContactPresence?.({
      isOnline: Boolean(user.is_online),
      lastSeen: user.last_seen || null,
    });
  };

  // 🔹 Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      const apiBaseUrl = getChatApiBaseUrl();

      try {
        const res = await fetch(`${apiBaseUrl}/api/users`, {
          credentials: "include",
        });

        if (!res.ok) return;
        const data = await res.json();
        setUsers(data?.data || []);
      } catch (err) {
        if (err?.name !== "AbortError") {
          console.error("Failed to fetch users", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsersRef.current = fetchUsers;

    let timerId;
    let stopped = false;

    const scheduleNext = () => {
      if (stopped) return;

      const isHidden = typeof document !== "undefined" && document.hidden;
      const delay = isHidden ? 120000 : 45000;

      timerId = setTimeout(async () => {
        if (stopped) return;
        await fetchUsersRef.current();
        scheduleNext();
      }, delay);
    };

    const handleVisibilityChange = async () => {
      if (typeof document === "undefined") return;
      if (!document.hidden) {
        await fetchUsersRef.current();
      }
    };

    fetchUsers();
    scheduleNext();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopped = true;
      if (timerId) clearTimeout(timerId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handlePresenceUpdate = (payload) => {
      const identifier = String(payload?.identifier || "").toLowerCase();
      if (!identifier) return;

      setUsers((prev) =>
        prev.map((user) => {
          const email = String(user.email || "").toLowerCase();
          const name = String(user.name || "").toLowerCase();

          if (email !== identifier && name !== identifier) {
            return user;
          }

          return {
            ...user,
            is_online: Boolean(payload?.isOnline),
            last_seen: payload?.isOnline ? user.last_seen : (payload?.lastSeen || user.last_seen),
          };
        })
      );

      setSuggestions((prev) =>
        prev.map((user) => {
          const email = String(user.email || "").toLowerCase();
          const name = String(user.name || "").toLowerCase();

          if (email !== identifier && name !== identifier) {
            return user;
          }

          return {
            ...user,
            is_online: Boolean(payload?.isOnline),
            last_seen: payload?.isOnline ? user.last_seen : (payload?.lastSeen || user.last_seen),
          };
        })
      );
    };

    const handleProfileImageUpdate = (payload) => {
      const identifier = String(payload?.email || "").toLowerCase();
      if (!identifier) return;

      setUsers((prev) =>
        prev.map((user) =>
          String(user?.email || "").toLowerCase() === identifier
            ? { ...user, profile_image_url: payload?.profileImageUrl || null }
            : user
        )
      );

      setSuggestions((prev) =>
        prev.map((user) =>
          String(user?.email || "").toLowerCase() === identifier
            ? { ...user, profile_image_url: payload?.profileImageUrl || null }
            : user
        )
      );
    };

    socket.on("presenceUpdate", handlePresenceUpdate);
    socket.on("profileImageUpdated", handleProfileImageUpdate);
    return () => {
      socket.off("presenceUpdate", handlePresenceUpdate);
      socket.off("profileImageUpdated", handleProfileImageUpdate);
    };
  }, [socket]);

  useEffect(() => {
    const query = searchQuery.trim();
    if (!query) {
      setSuggestions([]);
      setSearchLoading(false);
      return;
    }

    const apiBaseUrl = getChatApiBaseUrl();
    const controller = new AbortController();

    const fetchSuggestions = async () => {
      try {
        setSearchLoading(true);
        const res = await fetch(
          `${apiBaseUrl}/api/users/chat-suggestions?q=${encodeURIComponent(query)}`,
          {
            credentials: "include",
            signal: controller.signal,
          }
        );

        if (!res.ok) {
          setSuggestions([]);
          return;
        }

        const data = await res.json();
        setSuggestions(data?.data || []);
      } catch (error) {
        if (error?.name !== "AbortError") {
          console.error("Failed to fetch chat suggestions", error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setSearchLoading(false);
        }
      }
    };

    fetchSuggestions();

    return () => {
      controller.abort();
    };
  }, [searchQuery]);

  useEffect(() => {
    if (!contactPerson || contactPerson === userID) {
      setContactPresence?.({ isOnline: true, lastSeen: null });
      return;
    }

    const matchedUser = users.find((user) => user.name === contactPerson);
    if (!matchedUser) {
      setContactPresence?.({ isOnline: false, lastSeen: null });
      return;
    }

    setContactPresence?.({
      isOnline: Boolean(matchedUser.is_online),
      lastSeen: matchedUser.last_seen || null,
    });
    setContactProfileImage?.(matchedUser.profile_image_url || null);
  }, [contactPerson, userID, users, setContactPresence, setContactProfileImage]);

  // 🔹 Close settings dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setSettings1(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getButtonSx = (name) => ({
    fontSize: 32,
    backgroundColor: selected === name ? "#292a2a" : "transparent",
    "&:hover": { backgroundColor: "#292a2a" }
  });

  const defaultVisibleUsers = users
    .filter((user) => {
    const emailKey = String(user.email || "").toLowerCase();
    const isSelf = String(user.name || "") === String(userID || "");
    return !isSelf && normalizedHistoryEmails.has(emailKey);
  })
    .sort((a, b) => {
      const emailA = String(a.email || "").toLowerCase();
      const emailB = String(b.email || "").toLowerCase();

      const lastAtA = Number(lastMessageAt?.[emailA] || 0);
      const lastAtB = Number(lastMessageAt?.[emailB] || 0);
      if (lastAtB !== lastAtA) {
        return lastAtB - lastAtA;
      }

      const orderA = historyOrderMap.has(emailA) ? historyOrderMap.get(emailA) : Number.MAX_SAFE_INTEGER;
      const orderB = historyOrderMap.has(emailB) ? historyOrderMap.get(emailB) : Number.MAX_SAFE_INTEGER;
      if (orderA !== orderB) {
        return orderA - orderB;
      }

      return String(a.name || "").localeCompare(String(b.name || ""));
    });

  const visibleUsers = searchQuery.trim() ? suggestions : defaultVisibleUsers;

  return (
    <Box
      display='flex'
      padding={{ xs: 1.5, md: 2, xl: 1 }}
      width={isMobile ? '100%' : { sm: '42%', md: '36%', lg: '30%', xl: '26%' }}
      flexDirection='column'
      backgroundColor='#161717'
      height='100dvh'
      sx={{ minHeight: 0, maxWidth: isMobile ? '100%' : { sm: 460, xl: 560 } }}
    >

      {/* Header */}
      <Box display='flex' width='100%' justifyContent='space-between' position='relative' alignItems='center'>
        <Typography sx={{ color: "#fff", fontSize: 20 }}>
          Chats
        </Typography>

        <IconButton
          ref={buttonRef}
          size="small"
          sx={getButtonSx("Settings1")}
          onClick={() => setSettings1(prev => !prev)}
        >
          <MoreVert fontSize="inherit" sx={{ color: 'white' }} />
        </IconButton>

        <Box ref={dropdownRef} position='absolute' zIndex={1} right={-200} top={50}>
          <Grow in={settings1} timeout={200} mountOnEnter unmountOnExit>
            <Box sx={{ transformOrigin: "left top" }}>
              <ChatSettingsMenu onClose={() => setSettings1(false)} setUserID={setUserID}/>
            </Box>
          </Grow>
        </Box>
      </Box>

      {/* Search */}
      <Box width="96%">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSuggestions([])}
          placeholder="Search or start a new chat"
        />
      </Box>

      <Box width="100%" padding={1}>
        <FilterChips />
      </Box>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          pr: 0.5,
          scrollbarWidth: 'thin',
          scrollbarColor: '#2f3133 #161717',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#161717',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#2f3133',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#3b3f42',
          },
        }}
      >
        {/* USERS LIST */}
        {loading ? (
          <Typography color="white" padding={2} fontSize={{ xs: 14, md: 16 }}>Loading...</Typography>
        ) : searchQuery.trim() && searchLoading ? (
          <Typography color="#bfbfbf" padding={2} fontSize={{ xs: 13, md: 14 }}>Searching...</Typography>
        ) : visibleUsers.length === 0 ? (
          <Typography color="#bfbfbf" padding={2} fontSize={{ xs: 13, md: 14 }}>
            {searchQuery.trim() ? "No users found" : "No chats yet. Search to start a new chat."}
          </Typography>
        ) : (
          <>
            {!searchQuery.trim() ? (
              <Box
                width="100%"
                padding={1}
                sx={{ cursor: 'pointer' }}
                onClick={() => {
                  setContactPerson(userID);
                  setContactPersonId(String(fromID));
                  setContactPersonEmail(String(fromEmail || "").toLowerCase());
                  setContactPresence?.({ isOnline: true, lastSeen: null });
                }}
              >
                <ContactCard
                  userID={youLabel}
                  ID={String(fromID)}
                  selectionStatus={contactPerson === userID}
                  isOnline={true}
                  avatarSrc={currentUserProfileImage}
                  lastMessage={lastMessage?.[String(fromEmail || "").toLowerCase()] || ""}
                  unseenCount={0}
                  lastSeen={null}
                />
              </Box>
            ) : null}

          {visibleUsers.map(user => {

              const userLastMessage =
                lastMessage?.[String(user.email).toLowerCase()] ||
                user.last_message ||
                "";
              const unseenCount = unseenCounts?.[String(user.email).toLowerCase()] || 0;

              return (
                <Box
                  key={user.id}
                  width="100%"
                  padding={1}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => applySelection(user)}
                >
                  <ContactCard
                    userID={user.name}
                    ID={user.id}
                    selectionStatus={contactPerson === user.name}
                    avatarSrc={user.profile_image_url}
                    lastMessage={userLastMessage}
                    unseenCount={unseenCount}
                    isOnline={Boolean(user.is_online)}
                    lastSeen={user.last_seen}
                  />
                </Box>
              );
            })}
          </>
        )}
      </Box>


    </Box>
  );
};

export default ChatsPanel;
