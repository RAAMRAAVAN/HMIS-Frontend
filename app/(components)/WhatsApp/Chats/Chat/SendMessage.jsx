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

const SearchButton = ({ userID, contactPerson, contactPersonId, contactPersonEmail, fromID, fromEmail }) => {

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
        m: { xs: 0.5, md: 1 },
        '& .MuiOutlinedInput-root': {
          borderRadius: { xs: '24px', md: '33px' },
          backgroundColor: '#2e2f2f',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'none' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#2ecc71',
          },
        },
        '& .MuiInputBase-input::placeholder': {
          color: '#cfcfcf',
          opacity: 0.8,
          fontSize: { xs: 14, md: 18, xl: 22 }
        },
        '& .MuiInputBase-input': {
          color: '#ffffff',
          paddingTop: { xs: '10px', md: '16px', xl: '20px' },
          paddingBottom: { xs: '10px', md: '16px', xl: '20px' },
          fontSize: { xs: 14, md: 18, xl: 22 }
        },
      }}

      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <IconButton sx={{ '&:hover': { backgroundColor: '#292a2a' } }}>
                <Add sx={{ color: 'white', fontSize: { xs: 24, md: 32, xl: 38 } }} />
              </IconButton>

              <IconButton sx={{ '&:hover': { backgroundColor: '#292a2a' } }}>
                <AddReaction sx={{ color: 'white', fontSize: { xs: 24, md: 32, xl: 38 } }} />
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
                  width: { xs: 40, md: 50, xl: 58 },
                  height: { xs: 40, md: 50, xl: 58 },
                  right: -6,
                  '&:hover': { backgroundColor: '#21c063' }
                }}
              >
                <SendIcon sx={{ color: 'black', fontSize: { xs: 22, md: 30, xl: 34 } }} />
              </IconButton>
            </InputAdornment>
          ) : (
            <Tooltip title="Voice" placement="right">
              <IconButton sx={{ '&:hover': { backgroundColor: '#21c063' } }}>
                <MicNoneOutlined sx={{ color: 'white', fontSize: { xs: 24, md: 32, xl: 38 } }} />
              </IconButton>
            </Tooltip>
          )
        },
      }}
    />
  );
};

export default SearchButton;
