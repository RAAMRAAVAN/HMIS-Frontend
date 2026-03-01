import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { formatLastSeenLabel } from '@/utils/chatTime';

function ChatNavbar({
  userID,
  contactPerson,
  isOnline = false,
  lastSeen = null,
  showBack = false,
  onBack,
  canCall = false,
  onStartAudioCall,
  onStartVideoCall,
}) {
  const presenceText = formatLastSeenLabel({ isOnline, lastSeen }) || '';

  return (
    <AppBar position="static" sx={{ backgroundColor: '#161717', justifyContent:'center', paddingY: { xs: 0.5, md: 0.5 } }}>
      <Toolbar>

        {showBack ? (
          <IconButton color="inherit" onClick={onBack} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
        ) : null}

        {/* LEFT SIDE — Avatar + Text */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Tooltip title="Profile">
            <IconButton sx={{ p: 0 }}>
              <Avatar 
                alt={userID}
                src="/dummy.png"
                sx={{ width: { xs: 36, md: 48, xl: 56 }, height: { xs: 36, md: 48, xl: 56 } }}
              />
            </IconButton>
          </Tooltip>

          <Box ml={2}>
            <Typography sx={{ fontWeight: 700, fontSize:{ xs: 16, md: 17, xl: 17 } }}>
              {contactPerson}
            </Typography>
            {presenceText ? (
              <Typography sx={{ fontSize: { xs: 12, md: 14, xl: 14 }, color: '#bfbfbf', fontWeight:500 }}>
                {presenceText}
              </Typography>
            ) : null}
          </Box>
        </Box>

        {/* RIGHT SIDE — Search + Menu */}
        <Tooltip title="Search">
          <IconButton color="inherit">
            <SearchIcon sx={{ width: { xs: 24, md: 25, xl: 25 }, height: { xs: 24, md: 25, xl: 25 } }}/>
          </IconButton>
        </Tooltip>

        <Tooltip title="Voice call">
          <span>
            <IconButton color="inherit" onClick={onStartAudioCall} disabled={!canCall}>
              <CallOutlinedIcon sx={{ width: { xs: 24, md: 25, xl: 25 }, height: { xs: 24, md: 25, xl: 25 } }} />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Video call">
          <span>
            <IconButton color="inherit" onClick={onStartVideoCall} disabled={!canCall}>
              <VideocamOutlinedIcon sx={{ width: { xs: 24, md: 25, xl: 25 }, height: { xs: 24, md: 25, xl: 25 } }} />
            </IconButton>
          </span>
        </Tooltip>

        <IconButton color="inherit">
          <MoreVertIcon sx={{ width: { xs: 24, md: 25, xl: 25 }, height: { xs: 24, md: 25, xl: 25 } }}/>
        </IconButton>

      </Toolbar>
    </AppBar>
  );
}

export default ChatNavbar;
