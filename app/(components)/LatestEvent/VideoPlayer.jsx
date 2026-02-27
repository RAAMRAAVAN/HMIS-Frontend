import React, { useState } from "react";
import ReactPlayer from "react-player";
import { Box, Typography } from "@mui/material";

const VideoPlayer = ({ url, key, setKey,title ='Integrated Robotic Surgery Facility'}) => {
    const handleEnded = () => {
        setKey(key + 1); // Update the key to force the player to reset
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 600 }}>
            <Typography marginLeft={1} fontSize='12px'  gutterBottom>{title}</Typography>
            <Box
                sx={{
                    position: 'relative',
                    paddingTop: '56.25%', // 16:9 aspect ratio
                    overflow: 'hidden',
                    boxShadow: 3,
                }}
            >
                <ReactPlayer
                    key={key} // This key change forces the player to restart
                    url={url}
                    controls
                    playing  // autoplay
                    muted    // required for autoplay
                    onEnded={handleEnded} // handle video end event to restart
                    width="100%"
                    height="100%"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0
                    }}
                />
            </Box>
        </Box>
    );
};

export default VideoPlayer;
