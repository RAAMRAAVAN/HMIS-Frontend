'use client';

import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import { keyframes } from '@emotion/react';

const scroll = keyframes`
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
`;

const Marquee = ({
  text = "Inauguration of Robotic Surgery System in State Cancer Institute by the Hon’ble Chief Minister of Assam on 13 April 2025",
  url = "/news",
  speed = 20,
  target = "_blank",
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        width: '100%',
        backgroundColor: '#FFFFFF',
        color: '#bf1e2e',
        gap: 2,
      }}
    >
      {/* Left-side label */}
      <Typography sx={{ fontWeight: 'bold', flexShrink: 0 }}>Updates: </Typography>

      {/* Marquee text */}
      <Box
        component="span"
        sx={{
          display: 'inline-block',
          paddingLeft: '100%',
          animation: `${scroll} ${speed}s linear infinite`,
          minWidth: '100%',
          padding: '8px 16px',
        }}
      >
        <Link
          href={url}
          target={target}
          underline="none"
          color="inherit"
          sx={{
            fontWeight: 'bold',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          {text}
        </Link>
      </Box>
    </Box>
  );
};

export default Marquee;
