"use client";
import { Box, Typography } from "@mui/material";
import Facilities from "../../(components)/FacilitiesNew2/FacilityData";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
// import ParallelogramGrid from "./ParallelogramGrid";
import { color6, color7 } from "@/app/(components)/Global";

const FacilitiesClient = () => {
    const searchParams = useSearchParams();
    const expand = searchParams.get("expand");
    const [FID, setFID] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setFID(window.location.hash?.substring(1)); // remove the "#"
        }
    }, []);

    return (
        <>
            <Box display="none" sx={{ position: "relative", overflow: "hidden" }} width="100%" height="350px">
                {/* <Image
                    src={`/Facilities/facilities_bg.jpg`}
                    alt="background"
                    fill
                    style={{ objectFit: "cover" }}
                    quality={100}
                /> */}
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
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        // textShadow="2px 2px 10px rgba(0,0,0,0.5)"
                        paddingX={3}
                    >
                        Facilities
                    </Typography>
                </Box>
            </Box>
            <Box position='relative' display='none'>
                {/* <ParallelogramGrid /> */}
                <Box
                    bottom='0px'
                    // sx={{ background: `linear-gradient(to left, rgba(191, 30, 46, 1), rgba(255, 123, 0, 1))`, }}
                    sx={{background: `linear-gradient(135deg, ${color6}, ${color7})`}}
                    px={4}
                    boxShadow={3}
                    // position='absolute'
                    display="flex"
                    width='100%'
                    py={1}
                >
                    <Typography color="white" variant="h6" fontWeight="bold">
                        Facilities
                    </Typography>
                </Box>
            </Box>
            {/* <ParallelogramGrid/> */}
            <Box sx={{ padding: { md: 4, sm: 0 } }}>
                <Facilities expand={expand === "true"} FID={FID} />
            </Box>
        </>
    );
};

export default FacilitiesClient;
