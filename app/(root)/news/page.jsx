'use client'
import { Box, Grid, Typography } from "@mui/material";
import { API, color1, color4, color6, color7 } from "@/app/(components)/Global";
import VideoGrid from "@/app/(components)/Videos/VideoGrid";
import Facilities from '@/app/(components)/News2/FacilityData'
// import ParallelogramGrid from './ParallelogramGrid';
import { LatestVideos2, VideosAccess } from '../../../lib/fetchData';
import Image from "next/image";
import { useEffect, useState } from "react";
const page = () => {
    const [LatestVideosData, setVideos] = useState([]);

    const fetchVideos = async () => {
        console.log("fetch videos")
        setVideos(await LatestVideos2())
    }
    useEffect(() => {
        fetchVideos();
    }, [])
    return (<>
        <Box display="none" sx={{ position: "relative", overflow: "hidden" }} width="100%" height="350px">
            {/* <Image src={`News/newsEventsBack.jpg`} alt="background" fill style={{ objectFit: "cover" }} quality={100} /> */}
            <Box
                sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    backgroundColor: "rgba(0, 0, 255, 0.2)",
                    color: "white",
                    padding: "12px 0",
                }}
            >
                <Typography variant="h4" fontWeight="bold" textshadow="2px 2px 10px rgba(0,0,0,0.5)" paddingX={3}>
                    NEWS & EVENTS
                </Typography>
            </Box>
        </Box>
        <Box position='relative' display='none'>
            {/* <ParallelogramGrid /> */}
            <Box
                bottom='0px'
                // sx={{background: `linear-gradient(to left, rgba(191, 30, 46, 1), rgba(255, 123, 0, 1))`,}}
                sx={{ background: `linear-gradient(135deg, ${color6}, ${color7})` }}
                px={4}
                boxShadow={3}
                // position='absolute'
                display="flex"
                width='100%'
                py={1}
            >
                <Typography color="white" variant="h6" fontWeight="bold">
                    News & Events
                </Typography>
            </Box>
            <Box display='none' width='100%' justifyContent='center'>
                <Box
                    bottom='5px'
                    // left="45%"
                    sx={{ background: `linear-gradient(to left, ${color1}, ${color4})` }}
                    // width="fit-content"
                    px={4}
                    py={1}
                    borderRadius='0px 10px 0px 10px'
                    position="absolute"
                    boxShadow={3}
                // border='2px white solid'
                >
                    <Typography color="white" variant="h6" fontWeight="bold">
                        News & Events
                    </Typography>
                </Box>
            </Box>
        </Box>

        <Box display="flex" justifyContent="center" marginY={5}>
            <Facilities />
        </Box>
        {LatestVideosData.length > 0 ? <Box display='flex' width='100%' justifyContent='center'>
            <Box display='flex' width='90%' flexDirection='column' marginTop={2}>
                <Typography variant="h5" fontWeight="bold" marginBottom={3}>
                    Our Stories
                </Typography>
                {/* <Suspense> */}
                <VideoGrid LatestVideosData={LatestVideosData}/>
                {/* </Suspense> */}
            </Box>
        </Box> : <></>}

    </>)
}
export default page;