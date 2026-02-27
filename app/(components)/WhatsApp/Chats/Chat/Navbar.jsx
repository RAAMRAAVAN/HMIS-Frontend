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
import MoreVertIcon from '@mui/icons-material/MoreVert';

function ChatNavbar({userID, contactPerson, showBack = false, onBack}) {

  return (
    <AppBar position="static" sx={{ backgroundColor: '#161717', justifyContent:'center', paddingY: { xs: 0.5, md: 1 } }}>
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
            <Typography sx={{ fontWeight: 700, fontSize:{ xs: 16, md: 19, xl: 22 } }}>
              {contactPerson}
            </Typography>
            <Typography sx={{ fontSize: { xs: 12, md: 15, xl: 17 }, color: '#bfbfbf', fontWeight:600 }}>
              Message yourself
            </Typography>
          </Box>
        </Box>

        {/* RIGHT SIDE — Search + Menu */}
        <IconButton color="inherit">
          <SearchIcon sx={{ width: { xs: 24, md: 32, xl: 36 }, height: { xs: 24, md: 32, xl: 36 } }}/>
        </IconButton>

        <IconButton color="inherit">
          <MoreVertIcon sx={{ width: { xs: 24, md: 32, xl: 36 }, height: { xs: 24, md: 32, xl: 36 } }}/>
        </IconButton>

      </Toolbar>
    </AppBar>
  );
}

export default ChatNavbar;
