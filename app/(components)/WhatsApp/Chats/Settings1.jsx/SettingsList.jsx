import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Grow from '@mui/material/Grow';
import Collapse from '@mui/material/Collapse';

import {
  GroupAddOutlined,
  StarOutlineOutlined,
  CheckBoxOutlined,
  ChatOutlined,
  HttpsOutlined,
  LogoutOutlined
} from '@mui/icons-material';
import { getChatApiBaseUrl } from '@/utils/chatApiBase';
import { disconnectSocket } from '@/utils/socket';

const SettingsList = ({ onClose, setUserID, open = true }) => {

  const hoverStyle = {
    '&:hover': {
      backgroundColor: '#2e2f2f'
    },
    transition: 'background-color 0.2s ease',
    borderRadius: 2,
    marginX: 0.6,
    marginY: 0.2,
    minHeight: 36,
    py: 0.35,
    px: 0.8,
  };

  const handleLogout = async () => {
    const apiBaseUrl = getChatApiBaseUrl();
    try {
      await fetch(`${apiBaseUrl}/api/users/logout`, {
        method: "POST",
        credentials: "include"
      });

      disconnectSocket();

      // Clear session + state
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("userID");
        sessionStorage.removeItem("fromID");
        sessionStorage.removeItem("fromEmail");
      }

      setUserID(null);
      if (typeof setFromID === "function") setFromID(null);

      onClose();

      // optional but clean reset
      // window.location.reload();

    } catch (err) {
      console.error("Logout failed:", err);
    }
  };



  return (
    <Grow in={open} timeout={350}>
      <Box
        sx={{
          width: '240px',
          maxWidth: 480,
          bgcolor: '#1d1f1f',
          color: '#bfbfbf',
          borderRadius: 3,
          boxShadow: 3
        }}
      >

        <Collapse in={open} timeout={400}>
          <nav>
            <List>

              <ListItem disablePadding>
                <ListItemButton onClick={onClose} sx={hoverStyle}>
                  <ListItemIcon sx={{ color: '#bfbfbf', minWidth: 34 }}>
                    <GroupAddOutlined sx={{ fontSize: 23 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="New Group"
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight: 600
                    }}
                  />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton onClick={onClose} sx={hoverStyle}>
                  <ListItemIcon sx={{ color: '#bfbfbf', minWidth: 34 }}>
                    <StarOutlineOutlined sx={{ fontSize: 23 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Starred messages"
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight: 600
                    }}
                  />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton onClick={onClose} sx={hoverStyle}>
                  <ListItemIcon sx={{ color: '#bfbfbf', minWidth: 34 }}>
                    <CheckBoxOutlined sx={{ fontSize: 23 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Select Chats"
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight: 600
                    }}
                  />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton onClick={onClose} sx={hoverStyle}>
                  <ListItemIcon sx={{ color: '#bfbfbf', minWidth: 34 }}>
                    <ChatOutlined sx={{ fontSize: 23 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Mark all as read"
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight: 600
                    }}
                  />
                </ListItemButton>
              </ListItem>

            </List>
          </nav>

          <Divider sx={{ borderColor: '#333' }} />

          <nav>
            <List>

              <ListItem disablePadding>
                <ListItemButton onClick={onClose} sx={hoverStyle}>
                  <ListItemIcon sx={{ color: '#bfbfbf', minWidth: 34 }}>
                    <HttpsOutlined sx={{ fontSize: 23 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="App Lock"
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight: 600
                    }}
                  />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton onClick={handleLogout} sx={hoverStyle}>
                  <ListItemIcon sx={{ color: '#bfbfbf', minWidth: 34 }}>
                    <LogoutOutlined sx={{ fontSize: 23 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Logout"
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight: 600
                    }}
                  />
                </ListItemButton>
              </ListItem>

            </List>
          </nav>
        </Collapse>

      </Box>
    </Grow>
  );
};

export default SettingsList;
