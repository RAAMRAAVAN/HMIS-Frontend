'use client';

import { useState, useRef, useEffect } from "react";
import {
  Send as SendIcon,
  Add,
  AddReaction,
  MicNoneOutlined,
  Image as ImageIcon,
  VideoFile as VideoFileIcon,
  InsertDriveFile as InsertDriveFileIcon,
  CameraAlt as CameraAltIcon,
  Cameraswitch as CameraSwitchIcon,
  FiberManualRecord as RecordIcon,
  Stop as StopIcon,
  PhotoCamera as PhotoCameraIcon,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Stack,
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
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState("environment");
  const [cameraMode, setCameraMode] = useState("photo");
  const [isRecording, setIsRecording] = useState(false);
  const [isUploadingCameraMedia, setIsUploadingCameraMedia] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const photoCaptureInputRef = useRef(null);
  const videoCaptureInputRef = useRef(null);

  const isLiveCameraSupported =
    typeof window !== "undefined" &&
    window.isSecureContext &&
    !!navigator?.mediaDevices?.getUserMedia;

  const socket = getSocket();

  const openAttachmentMenu = Boolean(anchorEl);

  const getAcceptForType = (type) => {
    if (type === "image") return "image/*";
    if (type === "video") return "video/*";
    return ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,.7z,.csv";
  };

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const startCameraStream = async (mode = cameraMode, facingMode = cameraFacingMode) => {
    if (!isLiveCameraSupported) {
      setCameraError("Live camera preview is not available on this device/network. Use quick capture below.");
      return;
    }

    try {
      setCameraError("");
      stopCameraStream();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: mode === "video",
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      setCameraError("Camera permission denied or unavailable. Use quick capture below.");
      console.error("Unable to access camera", error);
    }
  };

  useEffect(() => {
    if (cameraOpen) {
      startCameraStream(cameraMode, cameraFacingMode);
    }

    return () => {
      stopCameraStream();
    };
  }, [cameraOpen]);

  const uploadAndSendFile = async (file) => {
    if (!file) return;
    if (!contactPerson || !contactPersonEmail || !fromEmail) return;

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

  const handleCameraOpen = () => {
    setAnchorEl(null);
    setCameraError("");
    setCameraOpen(true);
  };

  const handleCameraClose = () => {
    if (isRecording && recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
    setIsRecording(false);
    stopCameraStream();
    setCameraOpen(false);
  };

  const handleSwitchCamera = async () => {
    const nextFacingMode = cameraFacingMode === "environment" ? "user" : "environment";
    setCameraFacingMode(nextFacingMode);
    await startCameraStream(cameraMode, nextFacingMode);
  };

  const handleCameraModeChange = async (mode) => {
    if (mode === cameraMode) return;

    if (isRecording && recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
      setIsRecording(false);
    }

    setCameraMode(mode);
    await startCameraStream(mode, cameraFacingMode);
  };

  const handleCapturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video.videoWidth || !video.videoHeight) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    setIsUploadingCameraMedia(true);
    try {
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.95));
      if (!blob) return;
      const file = new File([blob], `camera-${Date.now()}.jpg`, { type: "image/jpeg" });
      await uploadAndSendFile(file);
      handleCameraClose();
    } catch (error) {
      console.error("Photo capture upload failed", error);
    } finally {
      setIsUploadingCameraMedia(false);
    }
  };

  const handleRecordToggle = async () => {
    if (!isLiveCameraSupported) return;
    if (!streamRef.current) return;

    if (isRecording && recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
      return;
    }

    recordedChunksRef.current = [];
    const recorder = new MediaRecorder(streamRef.current, {
      mimeType: "video/webm",
    });
    recorderRef.current = recorder;

    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    recorder.onstop = async () => {
      setIsRecording(false);
      const videoBlob = new Blob(recordedChunksRef.current, { type: "video/webm" });
      if (!videoBlob.size) return;

      setIsUploadingCameraMedia(true);
      try {
        const file = new File([videoBlob], `camera-video-${Date.now()}.webm`, { type: "video/webm" });
        await uploadAndSendFile(file);
        handleCameraClose();
      } catch (error) {
        console.error("Video upload failed", error);
      } finally {
        setIsUploadingCameraMedia(false);
      }
    };

    recorder.start();
    setIsRecording(true);
  };

  const handleQuickCaptureSelected = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingCameraMedia(true);
    try {
      await uploadAndSendFile(file);
      handleCameraClose();
    } catch (error) {
      console.error("Quick capture upload failed", error);
    } finally {
      setIsUploadingCameraMedia(false);
      event.target.value = "";
    }
  };

  const handleFileSelected = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!contactPerson || !contactPersonEmail || !fromEmail) return;

    try {
      await uploadAndSendFile(file);
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
                <MenuItem onClick={handleCameraOpen}>
                  <ListItemIcon><CameraAltIcon sx={{ color: "#21c063" }} /></ListItemIcon>
                  <ListItemText>Camera</ListItemText>
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

              <Dialog open={cameraOpen} onClose={handleCameraClose} fullWidth maxWidth="sm">
                <DialogTitle sx={{ backgroundColor: "#161717", color: "#fff" }}>Camera</DialogTitle>
                <DialogContent sx={{ backgroundColor: "#161717", pt: 2 }}>
                  {cameraError ? (
                    <Box sx={{ color: "#ffb4b4", fontSize: 13, mb: 1 }}>{cameraError}</Box>
                  ) : null}

                  <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                    <Button
                      variant={cameraMode === "photo" ? "contained" : "outlined"}
                      onClick={() => handleCameraModeChange("photo")}
                    >
                      Photo
                    </Button>
                    <Button
                      variant={cameraMode === "video" ? "contained" : "outlined"}
                      onClick={() => handleCameraModeChange("video")}
                    >
                      Video
                    </Button>
                    <Button variant="outlined" onClick={handleSwitchCamera} startIcon={<CameraSwitchIcon />}>
                      Switch
                    </Button>
                  </Stack>

                  {isLiveCameraSupported ? (
                    <Box sx={{ width: "100%", borderRadius: 2, overflow: "hidden", backgroundColor: "#000" }}>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        style={{ width: "100%", maxHeight: "60vh", objectFit: "cover" }}
                      />
                    </Box>
                  ) : (
                    <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                      <Button
                        variant="contained"
                        onClick={() => photoCaptureInputRef.current?.click()}
                        disabled={isUploadingCameraMedia}
                        startIcon={<PhotoCameraIcon />}
                      >
                        Take Photo
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => videoCaptureInputRef.current?.click()}
                        disabled={isUploadingCameraMedia}
                        startIcon={<VideoFileIcon />}
                      >
                        Record Video
                      </Button>
                    </Stack>
                  )}

                  <canvas ref={canvasRef} style={{ display: "none" }} />
                  <input
                    ref={photoCaptureInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    style={{ display: "none" }}
                    onChange={handleQuickCaptureSelected}
                  />
                  <input
                    ref={videoCaptureInputRef}
                    type="file"
                    accept="video/*"
                    capture="environment"
                    style={{ display: "none" }}
                    onChange={handleQuickCaptureSelected}
                  />
                </DialogContent>
                <DialogActions sx={{ backgroundColor: "#161717", px: 2, pb: 2 }}>
                  <Button onClick={handleCameraClose} disabled={isUploadingCameraMedia}>Cancel</Button>
                  {isLiveCameraSupported && cameraMode === "photo" ? (
                    <Button
                      variant="contained"
                      startIcon={<PhotoCameraIcon />}
                      onClick={handleCapturePhoto}
                      disabled={isUploadingCameraMedia}
                    >
                      Capture
                    </Button>
                  ) : isLiveCameraSupported ? (
                    <Button
                      variant="contained"
                      color={isRecording ? "error" : "primary"}
                      startIcon={isRecording ? <StopIcon /> : <RecordIcon />}
                      onClick={handleRecordToggle}
                      disabled={isUploadingCameraMedia}
                    >
                      {isRecording ? "Stop" : "Record"}
                    </Button>
                  ) : null}
                </DialogActions>
              </Dialog>
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
