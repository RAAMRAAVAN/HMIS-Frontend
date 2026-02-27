'use client'

import { Box, Typography } from "@mui/material";
// import { useEffect, useState } from "react";
import SearchButton from "./SendMessage";
// import { getSocket } from "../../../../../utils/socket";

const ChattingPage = ({ userID, contactPerson, messages, contactPersonsID, fromID, onLocalSend }) => {


  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        backgroundImage: "url('/whatsappbg.png')",
        backgroundRepeat: "repeat",
        backgroundSize: "auto",
        backgroundPosition: "center",
        position: 'relative',
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      {/* Messages Container */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          padding: 2,
        }}
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: String(msg.from) === String(fromID) ? "flex-end" : "flex-start",
              marginBottom: 1,
            }}
          >
            <Typography
              sx={{
                backgroundColor: String(msg.from) === String(fromID) ? "#21c063" : "#292a2a",
                color: String(msg.from) === String(fromID) ? "black" : "white",
                padding: "8px 12px",
                borderRadius: "20px",
                maxWidth: "70%",
                wordBreak: "break-word",
              }}
            >
              {msg.text}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Input Box */}
      <Box display='flex' position='absolute' width='100%' bottom={5}>
        <SearchButton
          userID={userID}
          contactPerson={contactPerson}
          contactPersonsID={contactPersonsID}
          fromID={fromID}
          onLocalSend={onLocalSend}
        />
      </Box>
    </Box>
  );
};

export default ChattingPage;
