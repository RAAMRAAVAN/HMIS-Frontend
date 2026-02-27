import React from 'react';
import { Box } from '@mui/material';

const CircleWithMarkers = ({ angleDegArray }) => {
  const radius = 250; // Half of the width/height of the circle
  const markerSize = 20;

  return (
    <Box
      sx={{
        width: 500,
        height: 500,
        border: '1px dashed black',
        borderRadius: '50%',
        position: 'relative',
      }}
    >
      {angleDegArray.map((angle, index) => {
        const angleRad = (angle * Math.PI) / 180;
        const markerX = radius + radius * Math.cos(angleRad);
        const markerY = radius + radius * Math.sin(angleRad);

        return (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              top: markerY - markerSize / 2,
              left: markerX - markerSize / 2,
              width: markerSize,
              height: markerSize,
              bgcolor: 'red',
              borderRadius: '50%',
            }}
          />
        );
      })}
    </Box>
  );
};

export default CircleWithMarkers;
