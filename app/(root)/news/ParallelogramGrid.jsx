import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import { color1, color4, color6, color7 } from '@/app/(components)/Global';
import { Opacity } from '@mui/icons-material';

const images = [
  '/News/69/1.jpg',
  '/News/85/1.jpg',
  '/News/84/1.jpg',
  '/News/75/1.jpg',
  '/News/70/1.jpg',
];
const ParallelogramGrid = () => {
  return (<>
  <Box
        position="relative"
        boxShadow={0}
        sx={{
          display: { lg: 'none', md: 'flex', sm: 'flex', xs: 'flex' },
          width: '100%',         // Ensure the box has width
          maxHeight: 200,
          height: 'auto',        // Let height adjust to image, or set a fixed height
          overflow: 'hidden',    // Hide any overflow
        }}
      >
        <img
          src="/News/85/1.jpg"
          alt="Facility"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover', // or 'contain' depending on your layout
            display: 'block'
          }}
        />
      </Box>
    <Box position='relative' boxShadow={0} sx={{ display: { lg: 'flex', md: 'none', sm: 'none', xs: 'none' } }}>
      <Grid container display='flex' width='100%' height='200px' justifyContent='space-between'>
        <Grid
          item
          position="relative"
          width="30%"
          height="100%"
          sx={{
            clipPath: 'polygon(0% 0%, 68% 0%, 100% 100%, 0% 100%)',
            borderRight: '10px solid transparent',
            borderImage: `linear-gradient(to bottom, ${color1}, ${color4}) 1`,
            overflow: 'hidden',
            // border: '1px black solid'
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              background: '#e0f7fa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                display: 'flex',
              }}
            >
              <img
                src={images[0]}
                alt="img-0"
                style={{
                  width: '100%',
                  height: '100%',
                  // objectFit: 'cover',
                  filter: 'grayscale(100%)',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  background:
                    'linear-gradient(to right, rgba(191, 30, 46, 0.9), rgba(241, 241, 245, 0.1), rgba(191, 30, 46, 0.9))',
                  opacity: 0.3,
                }}
              />
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          position="relative"
          width="30%"
          height="100%"
          sx={{
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 32% 100%)',
            // borderRight: '10px solid transparent',
            borderImage: `linear-gradient(to bottom, ${color1}, ${color4}) 1`,
            overflow: 'hidden',
            // border: '1px black solid'
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              background: '#e0f7fa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                display: 'flex',
              }}
            >
              <img
                src={images[4]}
                alt="img-0"
                style={{
                  width: '100%',
                  height: '100%',
                  // objectFit: 'cover',
                  filter: 'grayscale(100%)',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  background:
                    'linear-gradient(to right, rgba(191, 30, 46, 0.9), rgba(241, 241, 245, 0.1), rgba(191, 30, 46, 0.9))',
                  opacity: 0.3,
                }}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Grid
        container
        width="100%"
        height="200px"
        position="absolute"
        overflow="hidden"
        justifyContent='center'
        top={0}
      >
        {[...Array(3)].map((_, index) => (
          <Grid
            key={index}
            item
            width="23%"
            height="100%"
            position="relative"
            sx={{
              transform: 'skewX(30deg)',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '8px',
                height: '100%',
                background: index === 0
                  ? `linear-gradient(to bottom, rgba(${parseInt(color6.slice(1, 3), 16)}, ${parseInt(color6.slice(3, 5), 16)}, ${parseInt(color6.slice(5, 7), 16)}, 0.3),${color7})`
                  : 'none',
                zIndex: 1,
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '8px',
                height: '100%',
                background: index % 2 === 0
                  ? `linear-gradient(to bottom, ${color7}, rgba(${parseInt(color6.slice(1, 3), 16)}, ${parseInt(color6.slice(3, 5), 16)}, ${parseInt(color6.slice(5, 7), 16)}, 0.3))`
                  : `linear-gradient(to bottom, rgba(${parseInt(color6.slice(1, 3), 16)}, ${parseInt(color6.slice(3, 5), 16)}, ${parseInt(color6.slice(5, 7), 16)}, 0.3),${color7})`,
                zIndex: 1,
              },
            }}
          >

            {/* Counter skew content to keep it straight */}
            <Box
              sx={{
                transform: 'skewX(-30deg)',
                height: '100%',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#e0f7fa',
                position: 'relative',

              }}
            >
              <Box display='flex' width='200%' height='100%' position='absolute'>
                <img src={images[index + 1]} style={{ display: 'flex', width: '85%', filter: 'grayscale(100%)' }} />
                <Box style={{ display: 'flex', width: '100%', height: '100%', position: 'absolute', background:'linear-gradient(to right, rgba(191, 30, 46, 0.5), rgba(255, 255, 255, 0.1), rgba(191, 30, 46, 0.5))', opacity: '3' }} />
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  </>
  );
};

export default ParallelogramGrid;
