import { MoreVert } from "@mui/icons-material";
import { Box, Grow, IconButton, Typography } from "@mui/material";
import SettingsList from "./Settings1.jsx/SettingsList";
import SearchButton from "../SearchButton";
import ContactsCard from "../ContactsCard";
import { useEffect, useRef, useState } from "react";
import FilterChips from "../ChipButtons";

const Chats = ({ userID, setUserID,contactPerson, setContactPerson, selected, setSelected, lastMessage, unseenCounts, setContactPersonId, setContactPersonEmail, fromID, fromEmail }) => {

  const [settings1, setSettings1] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const youLabel = `${userID}  (You)`;

  // 🔹 Fetch users from API
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_CHAT_API_BASE_URL || "http://localhost:5000"}/api/users`, {
          credentials: "include"
        });
        const data = await res.json();
        setUsers(data?.data || []);
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

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

  return (
    <Box
      display='flex'
      padding={2}
      width='30%'
      flexDirection='column'
      backgroundColor='#161717'
      height='100vh'
      sx={{ minHeight: 0 }}
    >

      {/* Header */}
      <Box display='flex' width='100%' justifyContent='space-between' position='relative'>
        <Typography sx={{ color: "#fff", fontSize: 24, fontWeight: 600 }}>
          WhatsApp
        </Typography>

        <IconButton
          ref={buttonRef}
          size="large"
          sx={getButtonSx("Settings1")}
          onClick={() => setSettings1(prev => !prev)}
        >
          <MoreVert fontSize="inherit" sx={{ color: 'white' }} />
        </IconButton>

        <Box ref={dropdownRef} position='absolute' zIndex={1} right={-200} top={50}>
          <Grow in={settings1} timeout={200} mountOnEnter unmountOnExit>
            <Box sx={{ transformOrigin: "left top" }}>
              <SettingsList onClose={() => setSettings1(false)} setUserID={setUserID}/>
            </Box>
          </Grow>
        </Box>
      </Box>

      {/* Search */}
      <Box width="100%">
        <SearchButton />
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
        {/* YOU */}
        <Box
          width="100%"
          padding={1}
          sx={{ cursor: 'pointer' }}
          onClick={() => {
            setContactPerson(userID);
            setContactPersonId(String(fromID));
            setContactPersonEmail(String(fromEmail || "").toLowerCase());
          }}
        >
          <ContactsCard userID={youLabel} ID={1} selectionStatus={contactPerson === userID} />
        </Box>

        {/* USERS LIST */}
        {loading ? (
          <Typography color="white" padding={2}>Loading...</Typography>
        ) : (
          users
            .filter(u => u.name !== userID)
            .map(user => {

              const userLastMessage = lastMessage?.[String(user.email).toLowerCase()] || "";
              const unseenCount = unseenCounts?.[String(user.email).toLowerCase()] || 0;

              return (
                <Box
                  key={user.id}
                  width="100%"
                  padding={1}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => {
                    setContactPerson(user.name);
                    setContactPersonId(String(user.id));
                    setContactPersonEmail(String(user.email).toLowerCase());
                  }}
                >
                  <ContactsCard
                    userID={user.name}
                    ID={user.id}
                    selectionStatus={contactPerson === user.name}
                    lastMessage={userLastMessage}
                    unseenCount={unseenCount}
                  />
                </Box>
              );
            })
        )}
      </Box>


    </Box>
  );
};

export default Chats;
