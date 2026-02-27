import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';

function ChatNavbar({userID, contactPerson}) {

  return (
    <AppBar position="static" sx={{ backgroundColor: '#161717', justifyContent:'center', paddingY:1 }}>
      <Toolbar>

        {/* LEFT SIDE — Avatar + Text */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Tooltip title="Profile">
            <IconButton sx={{ p: 0 }}>
              <Avatar 
                alt={userID}
                src="/dummy.png"
                sx={{ width: 48, height: 48 }}
              />
            </IconButton>
          </Tooltip>

          <Box ml={2}>
            <Typography sx={{ fontWeight: 700, fontSize:19 }}>
              {contactPerson}
            </Typography>
            <Typography sx={{ fontSize: 15, color: '#bfbfbf', fontWeight:600 }}>
              Message yourself
            </Typography>
          </Box>
        </Box>

        {/* RIGHT SIDE — Search + Menu */}
        <IconButton color="inherit">
          <SearchIcon sx={{ width: 32, height: 32 }}/>
        </IconButton>

        <IconButton color="inherit">
          <MoreVertIcon sx={{ width: 32, height: 32 }}/>
        </IconButton>

      </Toolbar>
    </AppBar>
  );
}

export default ChatNavbar;
