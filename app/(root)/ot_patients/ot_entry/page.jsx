'use client'
import { Box, Button, Grid, Typography } from "@mui/material";
import OTEntry from "./OTEntry";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_CHAT_API_BASE_URL || "http://localhost:5000";

const OTEntryPage = () => {
    const [otRooms, setOtRooms] = useState([]);
    const router = useRouter();

    const fetchOTRooms = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/ot/ot-rooms`);
            const data = await res.json();
            setOtRooms(data.data);
        } catch (err) {
            alert("Error loading OT Rooms");
            console.error(err);
        }
    };

    useEffect(() => {
        fetchOTRooms();
    }, []);

    return (
        <>
            {/* 🔥 FIXED TOP HEADER WITH PINK SHADOW */}
            <Box
                display="flex"
                width="100%"
                height="60px"
                position="fixed"
                top={0}
                left={0}
                sx={{
                    backgroundColor: "#230239",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: "0px 6px 12px #df117d",
                    zIndex: 9999,
                }}
            >
                <Typography
                    textAlign="center"
                    sx={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "center",
                        fontWeight: "bold",
                        fontSize: 24,
                        color: "white",
                    }}
                >
                    OT Dashboard Manager
                </Typography>
                <Button onClick={()=>{router.push("/ot_patients/ot_report");}} style={{position:'absolute', zIndex:100, right:30, borderRadius:'20px'}} variant="contained">View Report</Button>
            </Box>

            {/* MAIN CONTENT */}
            <Box
                sx={{
                    display: "flex",
                    width: "100%",
                    flexDirection: "column",
                    height:'200vh',
                    // backgroundImage: "url(/Back2.png)",
                    // backgroundRepeat: "no-repeat",
                    backgroundColor:'#230239',
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    mt: "60px", // 👈 important (push content below fixed header)
                }}
            >
                <Box display="flex" margin={5} flexDirection="column" justifyContent="center">
                    <Grid container justifyContent="space-between" spacing={1}>
                        <Grid item xs={1} padding={1}>
                            <Typography paddingLeft={1} fontWeight="bold" color="white" fontSize={18}>
                                OT No
                            </Typography>
                        </Grid>

                        <Grid item xs={2} padding={1}>
                            <Typography paddingLeft={1} fontWeight="bold" color="white" fontSize={18}>
                                Patient Name
                            </Typography>
                        </Grid>

                        <Grid item xs={2} padding={1}>
                            <Typography paddingLeft={1} fontWeight="bold" color="white" fontSize={18}>
                                UHID
                            </Typography>
                        </Grid>

                        <Grid item xs={1} padding={1}>
                            <Typography paddingLeft={1} fontWeight="bold" color="white" fontSize={18}>
                                Age
                            </Typography>
                        </Grid>

                        <Grid item xs={1} padding={1}>
                            <Typography paddingLeft={1} fontWeight="bold" color="white" fontSize={18}>
                                Gender
                            </Typography>
                        </Grid>

                        <Grid item xs={2} padding={1}>
                            <Typography paddingLeft={1} fontWeight="bold" color="white" fontSize={18}>
                                Diagnosis
                            </Typography>
                        </Grid>

                        <Grid item xs={2} padding={1}>
                            <Typography paddingLeft={1} fontWeight="bold" color="white" fontSize={18}>
                                Treating Surgeon
                            </Typography>
                        </Grid>

                        <Grid item xs={1}></Grid>
                    </Grid>

                    {/* LIST OT ROOMS */}
                    {otRooms.map((room, index) => (
                        <OTEntry
                            key={room.ot_room_id || index}   // ✔ KEY FIXED
                            ot_room={room}
                            fetchOTRooms={fetchOTRooms}
                        />
                    ))}
                </Box>
            </Box>
        </>
    );
};

export default OTEntryPage;
