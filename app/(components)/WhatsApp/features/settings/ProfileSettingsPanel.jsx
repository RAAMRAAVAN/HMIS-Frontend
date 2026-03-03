import { useMemo, useState } from "react";
import { Avatar, Box, Button, CircularProgress, Typography } from "@mui/material";
import { getChatApiBaseUrl } from "@/utils/chatApiBase";
import { resolveChatAssetUrl } from "@/utils/chatAssetUrl";

const ProfileSettingsPanel = ({
  userName,
  userEmail,
  currentProfileImage,
  onProfileImageUpdated,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const effectiveAvatar = useMemo(() => {
    if (previewUrl) return previewUrl;
    return resolveChatAssetUrl(currentProfileImage);
  }, [currentProfileImage, previewUrl]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setMessage("");
    setError("");

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    if (!String(file.type || "").startsWith("image/")) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setError("Please select a valid image file.");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile || uploading) return;

    const formData = new FormData();
    formData.append("image", selectedFile);

    setUploading(true);
    setMessage("");
    setError("");

    try {
      const apiBaseUrl = getChatApiBaseUrl();
      const response = await fetch(`${apiBaseUrl}/api/users/profile-image`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Failed to upload profile image");
      }

      const nextUrl = data?.data?.profile_image_url || null;
      onProfileImageUpdated?.(nextUrl);
      setMessage("Profile image updated successfully.");
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (uploadError) {
      setError(uploadError?.message || "Failed to upload profile image");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (uploading) return;

    setUploading(true);
    setMessage("");
    setError("");

    try {
      const apiBaseUrl = getChatApiBaseUrl();
      const response = await fetch(`${apiBaseUrl}/api/users/profile-image/reset`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Failed to remove profile image");
      }

      onProfileImageUpdated?.(null);
      setSelectedFile(null);
      setPreviewUrl(null);
      setMessage("Profile image removed successfully.");
    } catch (removeError) {
      setError(removeError?.message || "Failed to remove profile image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      width="100%"
      height="100dvh"
      sx={{ minHeight: 0, backgroundColor: "#161717" }}
      padding={{ xs: 1.5, md: 2, xl: 1 }}
      gap={2}
    >
      <Typography sx={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>
        Settings
      </Typography>

      <Box
        sx={{
          backgroundColor: "#1d1f1f",
          border: "1px solid #2b2d2e",
          borderRadius: 2,
          p: { xs: 2, md: 2.5 },
          maxWidth: 560,
        }}
      >
        <Typography sx={{ color: "#fff", fontSize: 17, fontWeight: 700 }}>
          Profile Image
        </Typography>
        <Typography sx={{ color: "#bfbfbf", fontSize: 13, mt: 0.6 }}>
          {userName || "User"}{userEmail ? ` (${userEmail})` : ""}
        </Typography>

        <Box mt={2} display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <Avatar
            alt={userName || "Profile"}
            src={effectiveAvatar}
            sx={{ width: 90, height: 90 }}
          />

          <Box display="flex" flexDirection="column" gap={1.2}>
            <Button
              component="label"
              variant="outlined"
              sx={{
                borderColor: "#3a3b3b",
                color: "#fff",
                '&:hover': { borderColor: '#4a4b4b' },
              }}
              disabled={uploading}
            >
              Choose Image
              <input hidden type="file" accept="image/*" onChange={handleFileChange} />
            </Button>

            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              sx={{
                backgroundColor: "#21c063",
                '&:hover': { backgroundColor: '#1aa955' },
              }}
            >
              {uploading ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : "Upload"}
            </Button>

            <Button
              variant="text"
              onClick={handleRemove}
              disabled={uploading || (!currentProfileImage && !previewUrl)}
              sx={{
                color: "#ff8a80",
                justifyContent: "flex-start",
                px: 0,
                '&:hover': { backgroundColor: 'transparent', color: '#ff6f60' },
              }}
            >
              Remove Photo
            </Button>
          </Box>
        </Box>

        {message ? (
          <Typography sx={{ color: "#21c063", fontSize: 13, mt: 1.4 }}>{message}</Typography>
        ) : null}
        {error ? (
          <Typography sx={{ color: "#ff8a80", fontSize: 13, mt: 1.2 }}>{error}</Typography>
        ) : null}
      </Box>
    </Box>
  );
};

export default ProfileSettingsPanel;
