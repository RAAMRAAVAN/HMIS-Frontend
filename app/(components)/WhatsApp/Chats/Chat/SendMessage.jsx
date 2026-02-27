'use client';

import { useState, useRef } from "react";
import {
  Send as SendIcon,
  Add,
  AddReaction,
  MicNoneOutlined,
  Image as ImageIcon,
  VideoFile as VideoFileIcon,
  InsertDriveFile as InsertDriveFileIcon,
} from "@mui/icons-material";
import {
  InputAdornment,
  TextField,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { getSocket } from "../../../../../utils/socket";
import { getChatApiBaseUrl } from "@/utils/chatApiBase";

const SearchButton = ({ userID, contactPerson, contactPersonId, contactPersonEmail, fromID, fromEmail }) => {

  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [selectedFileType, setSelectedFileType] = useState("document");

  const socket = getSocket();

  const openAttachmentMenu = Boolean(anchorEl);

  const getAcceptForType = (type) => {
    if (type === "image") return "image/*";
    if (type === "video") return "video/*";
    return ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,.7z,.csv";
  };

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

  const handleAttachmentTypeClick = (type) => {
    setSelectedFileType(type);
    setAnchorEl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFileSelected = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!contactPerson || !contactPersonEmail || !fromEmail) return;

    try {
      const apiBase = getChatApiBaseUrl();
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fromID", String(fromID || ""));
      formData.append("toID", String(contactPersonId || ""));
      formData.append("fromEmail", String(fromEmail || "").toLowerCase());
      formData.append("toEmail", String(contactPersonEmail || "").toLowerCase());

      const res = await fetch(`${apiBase}/api/users/chat-upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success || !data?.file) {
        throw new Error(data?.message || "Failed to upload file");
      }

      socket.emit("privateMessage", {
        fromUserId: userID,
        fromID: String(fromID),
        fromEmail: String(fromEmail).toLowerCase(),
        toID: String(contactPersonId),
        toEmail: String(contactPersonEmail).toLowerCase(),
        toUserId: contactPerson,
        messageType: "file",
        file: data.file,
        message: file.name,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error("Attachment send failed", error);
    }
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
              <IconButton
                onClick={(event) => setAnchorEl(event.currentTarget)}
                sx={{ '&:hover': { backgroundColor: '#292a2a' } }}
              >
                <Add sx={{ color: 'white', fontSize: { xs: 24, md: 32, xl: 38 } }} />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={openAttachmentMenu}
                onClose={() => setAnchorEl(null)}
                PaperProps={{
                  sx: {
                    backgroundColor: "#1f2121",
                    color: "#fff",
                    borderRadius: 2,
                  },
                }}
              >
                <MenuItem onClick={() => handleAttachmentTypeClick("image")}>
                  <ListItemIcon><ImageIcon sx={{ color: "#21c063" }} /></ListItemIcon>
                  <ListItemText>Image</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleAttachmentTypeClick("video")}>
                  <ListItemIcon><VideoFileIcon sx={{ color: "#21c063" }} /></ListItemIcon>
                  <ListItemText>Video</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleAttachmentTypeClick("document")}>
                  <ListItemIcon><InsertDriveFileIcon sx={{ color: "#21c063" }} /></ListItemIcon>
                  <ListItemText>Document</ListItemText>
                </MenuItem>
              </Menu>

              <IconButton sx={{ '&:hover': { backgroundColor: '#292a2a' } }}>
                <AddReaction sx={{ color: 'white', fontSize: { xs: 24, md: 32, xl: 38 } }} />
              </IconButton>

              <input
                ref={fileInputRef}
                type="file"
                accept={getAcceptForType(selectedFileType)}
                style={{ display: "none" }}
                onChange={handleFileSelected}
              />
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
