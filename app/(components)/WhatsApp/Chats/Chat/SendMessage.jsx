'use client';

import { useState, useRef } from "react";
import {
  Send as SendIcon,
  Add,
  AddReaction,
  MicNoneOutlined
} from "@mui/icons-material";
import { InputAdornment, TextField, IconButton, Tooltip } from "@mui/material";
import { getSocket } from "../../../../../utils/socket";

const SearchButton = ({ userID, contactPerson, contactPersonId, contactPersonEmail, fromID, fromEmail, onLocalSend }) => {

  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const socket = getSocket();

  // -------- SEND MESSAGE ----------
  const handleSend = () => {
    if (!value.trim()) return;
    if (!contactPerson || !contactPersonEmail || !fromEmail) return;

    const payload = {
      fromUserId: userID,
      fromID: String(fromID),
      fromEmail: String(fromEmail).toLowerCase(),
      toID: String(contactPersonId),
      toEmail: String(contactPersonEmail).toLowerCase(),
      toUserId: contactPerson,
      message: value,
      timestamp: Date.now()
    };

    socket.emit("privateMessage", payload);

    setValue("");
  };

  // -------- ENTER KEY SEND ----------
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <TextField
      inputRef={inputRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      placeholder="Type a message"
      fullWidth

      sx={{
        m: 1,
        '& .MuiOutlinedInput-root': {
          borderRadius: '33px',
          backgroundColor: '#2e2f2f',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'none' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#2ecc71',
          },
        },
        '& .MuiInputBase-input::placeholder': {
          color: '#cfcfcf',
          opacity: 0.8,
          fontSize: 20
        },
        '& .MuiInputBase-input': {
          color: '#ffffff',
          paddingTop: '18px',
          paddingBottom: '18px',
          fontSize: 20
        },
      }}

      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <IconButton sx={{ '&:hover': { backgroundColor: '#292a2a' } }}>
                <Add sx={{ color: 'white', fontSize: 35 }} />
              </IconButton>

              <IconButton sx={{ '&:hover': { backgroundColor: '#292a2a' } }}>
                <AddReaction sx={{ color: 'white', fontSize: 35 }} />
              </IconButton>
            </InputAdornment>
          ),

          endAdornment: value !== "" ? (
            <InputAdornment position="end">
              <IconButton
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleSend}
                sx={{
                  backgroundColor: '#21c063',
                  width: 50,
                  height: 50,
                  right: -6,
                  '&:hover': { backgroundColor: '#21c063' }
                }}
              >
                <SendIcon sx={{ color: 'black', fontSize: 30 }} />
              </IconButton>
            </InputAdornment>
          ) : (
            <Tooltip title="Voice" placement="right">
              <IconButton sx={{ '&:hover': { backgroundColor: '#21c063' } }}>
                <MicNoneOutlined sx={{ color: 'white', fontSize: 35 }} />
              </IconButton>
            </Tooltip>
          )
        },
      }}
    />
  );
};

export default SearchButton;
