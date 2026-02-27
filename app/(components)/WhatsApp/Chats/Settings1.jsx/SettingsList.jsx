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

const SettingsList = ({ onClose, setUserID, open = true }) => {

  const hoverStyle = {
    '&:hover': {
      backgroundColor: '#2e2f2f'
    },
    transition: 'background-color 0.2s ease',
    borderRadius: 3,
    marginX: 1,
    marginY: 0.3,
  };

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_CHAT_API_BASE_URL || "http://localhost:5000"}/api/users/logout`, {
        method: "POST",
        credentials: "include"
      });

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
          width: '280px',
          maxWidth: 560,
          bgcolor: '#1d1f1f',
          color: '#bfbfbf',
          borderRadius: 4,
          boxShadow: 3
        }}
      >

        <Collapse in={open} timeout={400}>
          <nav>
            <List>

              <ListItem disablePadding>
                <ListItemButton onClick={onClose} sx={hoverStyle}>
                  <ListItemIcon sx={{ color: '#bfbfbf' }}>
                    <GroupAddOutlined sx={{ fontSize: 30 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="New Group"
                    primaryTypographyProps={{
                      fontSize: 17,
                      fontWeight: 600
                    }}
                  />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton onClick={onClose} sx={hoverStyle}>
                  <ListItemIcon sx={{ color: '#bfbfbf' }}>
                    <StarOutlineOutlined sx={{ fontSize: 30 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Starred messages"
                    primaryTypographyProps={{
                      fontSize: 17,
                      fontWeight: 600
                    }}
                  />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton onClick={onClose} sx={hoverStyle}>
                  <ListItemIcon sx={{ color: '#bfbfbf' }}>
                    <CheckBoxOutlined sx={{ fontSize: 30 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Select Chats"
                    primaryTypographyProps={{
                      fontSize: 17,
                      fontWeight: 600
                    }}
                  />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton onClick={onClose} sx={hoverStyle}>
                  <ListItemIcon sx={{ color: '#bfbfbf' }}>
                    <ChatOutlined sx={{ fontSize: 30 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Mark all as read"
                    primaryTypographyProps={{
                      fontSize: 17,
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
                  <ListItemIcon sx={{ color: '#bfbfbf' }}>
                    <HttpsOutlined sx={{ fontSize: 30 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="App Lock"
                    primaryTypographyProps={{
                      fontSize: 17,
                      fontWeight: 600
                    }}
                  />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton onClick={handleLogout} sx={hoverStyle}>
                  <ListItemIcon sx={{ color: '#bfbfbf' }}>
                    <LogoutOutlined sx={{ fontSize: 30 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Logout"
                    primaryTypographyProps={{
                      fontSize: 17,
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
