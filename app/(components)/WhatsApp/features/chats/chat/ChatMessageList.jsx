'use client'

import { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CallMadeRoundedIcon from "@mui/icons-material/CallMadeRounded";
import CallReceivedRoundedIcon from "@mui/icons-material/CallReceivedRounded";
import CallMissedRoundedIcon from "@mui/icons-material/CallMissedRounded";
// import { useEffect, useState } from "react";
import MessageComposer from "./MessageComposer";
import { getChatApiBaseUrl } from "@/utils/chatApiBase";
import { formatChatBubbleDateTime } from "@/utils/chatTime";
// import { getSocket } from "../../../../../utils/socket";

const ChatMessageList = ({ userID, contactPerson, messages, contactPersonId, contactPersonEmail, fromID, fromEmail }) => {
  const bottomRef = useRef(null);
  const apiBase = getChatApiBaseUrl();
  const currentFrom = String(fromEmail || "").toLowerCase();

  const formatMessageDateTime = (timestamp) => {
    return formatChatBubbleDateTime(timestamp);
  };

  const renderStatusIcon = (status) => {
    if (status === "read") {
      return <DoneAllIcon sx={{ fontSize: 14, color: "#4fc3f7" }} />;
    }

    if (status === "delivered") {
      return <DoneAllIcon sx={{ fontSize: 14, color: "#5f5f5f" }} />;
    }

    return <DoneIcon sx={{ fontSize: 13, color: "#5f5f5f" }} />;
  };

  const formatDuration = (durationMs) => {
    const ms = Math.max(0, Number(durationMs) || 0);
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const getCallSummary = ({ msg, isOutgoing }) => {
    const call = msg.call || {};
    const callType = call.callType === "video" ? "Video" : "Voice";
    const direction = isOutgoing ? "Outgoing" : "Incoming";
    const eventType = String(call.eventType || "").toLowerCase();
    const durationText = formatDuration(call.durationMs);

    if (eventType === "missed") {
      return `Missed ${callType.toLowerCase()} call`;
    }

    if (eventType === "declined") {
      return `${direction} ${callType.toLowerCase()} call declined`;
    }

    if (eventType === "completed") {
      return `${direction} ${callType.toLowerCase()} call • ${durationText}`;
    }

    return `${direction} ${callType.toLowerCase()} call`;
  };

  const getCallIcon = ({ msg, isOutgoing }) => {
    const eventType = String(msg?.call?.eventType || "").toLowerCase();

    if (eventType === "missed") {
      return <CallMissedRoundedIcon sx={{ fontSize: 18, color: "#e57373" }} />;
    }

    if (isOutgoing) {
      return <CallMadeRoundedIcon sx={{ fontSize: 18, color: "#1f1f1f" }} />;
    }

    return <CallReceivedRoundedIcon sx={{ fontSize: 18, color: "#6fcf97" }} />;
  };

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
          (() => {
            const isOutgoing = String(msg.from || "").toLowerCase() === currentFrom;
            const dateInfo = formatMessageDateTime(msg.timestamp);
            return (
          <Box
            key={index}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: isOutgoing ? "flex-end" : "flex-start",
              marginBottom: 1,
            }}
          >
            <Box
              sx={{
                backgroundColor: isOutgoing ? "#21c063" : "#292a2a",
                color: isOutgoing ? "black" : "white",
                padding: { xs: "7px 10px", md: "8px 12px", xl: "12px 16px" },
                borderRadius: "20px",
                maxWidth: "70%",
                wordBreak: "break-word",
                fontSize: { xs: 13, md: 15, xl: 18 },
              }}
            >
              {msg.messageType === "file" && msg.file ? (
                <Box display="flex" flexDirection="column" gap={0.75}>
                  {msg.file.kind === "image" ? (
                    <Box
                      component="img"
                      src={`${apiBase}${msg.file.url}`}
                      alt={msg.file.originalName || "image"}
                      sx={{ width: "100%", maxWidth: 260, borderRadius: 2 }}
                    />
                  ) : msg.file.kind === "video" ? (
                    <Box
                      component="video"
                      controls
                      src={`${apiBase}${msg.file.url}`}
                      sx={{ width: "100%", maxWidth: 280, borderRadius: 2 }}
                    />
                  ) : null}

                  <Typography
                    component="a"
                    href={`${apiBase}${msg.file.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: isOutgoing ? "black" : "#8fd5ff",
                      textDecoration: "underline",
                      fontSize: { xs: 12, md: 14, xl: 16 },
                    }}
                  >
                    {msg.file.originalName || msg.text || "Open file"}
                  </Typography>

                  {msg.file.size ? (
                    <Typography sx={{ fontSize: { xs: 10, md: 11 }, opacity: 0.8 }}>
                      {(Number(msg.file.size) / 1024).toFixed(1)} KB
                    </Typography>
                  ) : null}
                </Box>
              ) : msg.messageType === "call" ? (
                <Box display="flex" alignItems="center" gap={1}>
                  {getCallIcon({ msg, isOutgoing })}
                  <Box>
                    <Typography sx={{ fontSize: { xs: 13, md: 15, xl: 18 }, fontWeight: 600 }}>
                      {getCallSummary({ msg, isOutgoing })}
                    </Typography>
                    {msg?.call?.reason ? (
                      <Typography sx={{ fontSize: { xs: 11, md: 12 }, opacity: 0.85 }}>
                        Reason: {msg.call.reason}
                      </Typography>
                    ) : null}
                  </Box>
                </Box>
              ) : (
                <Typography sx={{ fontSize: { xs: 13, md: 15, xl: 18 } }}>{msg.text}</Typography>
              )}
            </Box>

            <Box
              sx={{
                mt: 0.25,
                px: 0.5,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <Typography sx={{ color: "#b6b6b6", fontSize: { xs: 10, md: 11 } }}>
                {dateInfo.day} {dateInfo.time}
              </Typography>
              {isOutgoing ? renderStatusIcon(msg.status) : null}
            </Box>
          </Box>
            );
          })()
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
        <MessageComposer
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

export default ChatMessageList;
