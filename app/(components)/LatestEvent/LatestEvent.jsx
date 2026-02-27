'use client';

import { Box, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReactPlayer from "react-player";
import { useState, useEffect, useRef } from "react";
import { LatestVideos } from "@/lib/fetchData";

const LatestEvent = ({ open, setOpen }) => {
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const timerRef = useRef(null);
    const LatestVideosData = LatestVideos;

    const handleClose = () => {
        setOpen(false);

        // Move to next video
        setCurrentVideoIndex((prevIndex) =>
            prevIndex < LatestVideosData.length - 1 ? prevIndex + 1 : 0
        );

        // Clear existing timer if any
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        // Set a timer to reopen after 10 seconds
        timerRef.current = setTimeout(() => {
            setOpen(true);
        }, 40000); // 10 seconds
    };

    useEffect(() => {
        // Cleanup timer when component unmounts
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    const handleVideoEnd = () => {
        // Move to the next video automatically
        setCurrentVideoIndex((prevIndex) =>
            prevIndex < LatestVideosData.length - 1 ? prevIndex + 1 : 0
        );
    };

    return (
        <Box
            zIndex={10}
            sx={{ pointerEvents: "none", display: open ? 'flex' : 'none' }}
        >
            <Box
                sx={{
                    pointerEvents: "auto",
                    position: "fixed",
                    bottom: 16,
                    right: 16,
                    width: "300px",
                    height: "193px",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* Close Button */}
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        display: "flex",
                        justifyContent: "flex-end",
                        bgcolor: "background.paper",
                        zIndex: 3,
                    }}
                >
                    <IconButton onClick={handleClose} sx={{ padding: '0' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Video Content */}
                <Box
                    sx={{
                        overflowY: "auto",
                        flexGrow: 1,
                    }}
                    display="flex"
                    justifyContent="end"
                    alignItems="end"
                >
                    {/* Make sure ReactPlayer re-renders by updating key */}
                    <VideoPlayer
                        key={currentVideoIndex} // This will force the video to reset on change
                        url={LatestVideosData[currentVideoIndex]?.Link}
                        title={LatestVideosData[currentVideoIndex]?.Title}
                        onVideoEnd={handleVideoEnd}
                    />
                </Box>
            </Box>
        </Box>
    );
};

const VideoPlayer = ({ url, title = 'Integrated Robotic Surgery Facility', onVideoEnd }) => {
    return (
        <Box sx={{ width: '100%', maxWidth: 600 }}>
            <Typography marginLeft={1} fontSize="12px" gutterBottom>{title}</Typography>
            <Box
                sx={{
                    position: 'relative',
                    paddingTop: '56.25%', // 16:9 aspect ratio
                    overflow: 'hidden',
                    boxShadow: 3,
                }}
            >
                <ReactPlayer
                    url={url}
                    controls
                    playing
                    muted
                    onEnded={onVideoEnd}
                    width="100%"
                    height="100%"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                    }}
                />
            </Box>
        </Box>
    );
};

export default LatestEvent;
