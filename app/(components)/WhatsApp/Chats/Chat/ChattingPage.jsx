'use client'

import { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
// import { useEffect, useState } from "react";
import SearchButton from "./SendMessage";
// import { getSocket } from "../../../../../utils/socket";

const ChattingPage = ({ userID, contactPerson, messages, contactPersonId, contactPersonEmail, fromID, fromEmail }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, contactPersonEmail]);


  return (
    <Box
      sx={{
        width: "100%",
        flex: 1,
        minHeight: 0,
        backgroundImage: "url('/whatsappbg.png')",
        backgroundRepeat: "repeat",
        backgroundSize: "auto",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Messages Container */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          padding: { xs: 1, sm: 1.5, md: 2, xl: 3 },
          scrollbarWidth: 'thin',
          scrollbarColor: '#2f3133 transparent',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
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
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: String(msg.from) === String(fromEmail) ? "flex-end" : "flex-start",
              marginBottom: 1,
            }}
          >
            <Typography
              sx={{
                backgroundColor: String(msg.from) === String(fromEmail) ? "#21c063" : "#292a2a",
                color: String(msg.from) === String(fromEmail) ? "black" : "white",
                padding: { xs: "7px 10px", md: "8px 12px", xl: "12px 16px" },
                borderRadius: "20px",
                maxWidth: "70%",
                wordBreak: "break-word",
                fontSize: { xs: 13, md: 15, xl: 18 },
              }}
            >
              {msg.text}
            </Typography>
          </Box>
        ))}
        <Box ref={bottomRef} />
      </Box>

      {/* Input Box */}
      <Box
        display='flex'
        width='100%'
        sx={{
          borderTop: '1px solid #2b2b2b',
          backgroundColor: '#161717',
          px: { xs: 0.5, md: 1, xl: 2 },
          py: { xs: 0.25, md: 0.5, xl: 1 },
        }}
      >
        <SearchButton
          userID={userID}
          contactPerson={contactPerson}
          contactPersonId={contactPersonId}
          contactPersonEmail={contactPersonEmail}
          fromID={fromID}
          fromEmail={fromEmail}
        />
      </Box>
    </Box>
  );
};

export default ChattingPage;
