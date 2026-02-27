"use client";
import { Box, Button, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { memo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ContentSlider = ({ Floors }) => {
    const theme = useTheme();
    const router = useRouter();
    const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: '95%',
                overflow: "hidden",

                position: "relative",
                // backgroundColor:'#8F00FF',
                height: '100vh',

                "& .swiper-button-prev, & .swiper-button-next": {
                    color: "rgb(0, 49, 83)",
                    zIndex: 10,
                    display: isMdUp ? "block" : "none", // Hide nav buttons on small screens
                },
                // border:'1px black solid',
                "& .swiper-pagination": {
                    bottom: "70px", // or adjust to '20px', '30px', etc. as needed
                    zIndex: '20001',
                    // border:'1px white solid',
                    position: 'absolute'
                },
                "& .swiper-pagination-bullet": {
                    backgroundColor: "#fff", // Change this to your desired color
                    border: '1px white solid',
                    opacity: 0.7,            // Optional: tweak for style
                    borderRadius: 0,
                    width: '39px',
                    height: '20px',
                    width: "50px"
                },
                "& .swiper-pagination-bullet-active": {
                    backgroundColor: "rgb(0, 49, 83)", // Active bullet color (e.g., MUI primary)

                    opacity: 1,                 // Make it fully visible
                }
            }}
        >
            <Swiper
                modules={[Navigation, Pagination, Autoplay, EffectFade]}
                effect="fade"
                spaceBetween={10}
                slidesPerView={1}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                speed={1000}
                pagination={{ clickable: true }}
                // navigation={isMdUp}
                style={{ width: "100%", height: "100%", display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                navigation={{
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                }}

            // borderRadius={3}
            >
                {Floors.map((floor, index) => {
                    return (<SwiperSlide key={index} style={{ width: "100%", position: 'relative' }}>
                        <Box display='flex' justifyContent='center' position='absolute' width='100%'>
                            <Typography color="black" fontSize={18} backgroundColor='white' width='20%' paddingY={1} borderRadius={5} marginTop={1} textAlign='center' fontWeight='bold'>{floor.Department}</Typography>
                        </Box>
                        <Box backgroundColor='gray' marginTop='80px' borderRadius={3} boxShadow={3} display='flex' flexDirection='column' width='95%' position='absolute' height='61vh' padding={5}>
                            <Grid spacing={1}  container  justifyContent='center'>

                                <Grid item xs={2} display="flex" width="100%">
                                    <Button
                                        sx={{ width: "250px", border: '5px white solid', boxShadow: 3, height: '250px', paddingX: '10px', borderRadius: '5%', background: 'linear-gradient(to top, rgb(0, 49, 83), rgb(135, 206, 250))', cursor: 'pointer' }}
                                    >
                                        <Typography fontWeight='bold' color="white" fontSize='28px'>{floor.floor}</Typography>
                                    </Button>
                                </Grid>
                                {floor.Departments.map((department, index) => {
                                    return (
                                        <Grid item xs={3} display="flex" width="100%">
                                            <Button onClick={() => { router.push(`/department?name=${encodeURIComponent(department.label)}`) }}
                                                sx={{ width: "450px", flexDirection:'column', border: '5px white solid', boxShadow: 3, height: '250px', borderRadius: '15px', background: 'linear-gradient(to top, rgb(135, 206, 250))', cursor: 'pointer', display:'flex' }}
                                            >
                                                <Typography fontWeight='bold' color="white" fontSize='28px'>{department.label}</Typography>
                                                <Box display='flex' flexDirection='column' justifyContent='start'>
                                                    {department.doctors.map((doctor, index)=>{return(<Typography color="black" textAlign='left' fontSize={20}>{doctor.name}</Typography>)})}
                                                </Box>
                                            </Button>
                                        </Grid>
                                    )
                                })}
                            </Grid>

                            <Grid spacing={1} marginTop={1} container  justifyContent='center'>
                                <Grid item xs={2} display="flex" width="100%">
                                    {/* <Button
                                        sx={{ width: "250px", border: '5px white solid', boxShadow: 3, height: '250px', paddingX: '10px', borderRadius: '50%', background: 'linear-gradient(to top, rgb(0, 49, 83), rgb(135, 206, 250))', cursor: 'pointer' }}
                                    >
                                        <Typography fontWeight='bold' color="white" fontSize='28px'>{floor.floor}</Typography>
                                    </Button> */}
                                </Grid>
                                {floor.Days2.map((department, index) => {
                                    return (
                                        <Grid item xs={3} display="flex" width="100%">
                                            <Button onClick={() => { router.push(`/department?name=${encodeURIComponent(department.label)}`) }}
                                                sx={{ width: "450px",display:'flex', flexDirection:'column', border: '5px white solid', boxShadow: 3, height: '250px', borderRadius: '15px', background: 'linear-gradient(to top, rgb(135, 206, 250))', cursor: 'pointer' }}
                                            >
                                                <Typography fontWeight='bold' color="white" fontSize='28px'>{department.label}</Typography>
                                                <Box display='flex' flexDirection='column'>
                                                    {department.doctors.map((doctor, index)=>{return(<Typography color="black" textAlign='left' fontSize={20}>{doctor.name}</Typography>)})}
                                                </Box>
                                            </Button>
                                        </Grid>
                                    )
                                })}
                            </Grid>
                        </Box>
                    </SwiperSlide>
                    )
                })}

            </Swiper>

            {/* Custom Navigation Buttons */}
            {/* {Floors.length > 1 ? <>
                <div className="swiper-button-prev" style={navButtonStyle("left")}></div>
                <div className="swiper-button-next" style={navButtonStyle("right")}></div>
            </> : <></>} */}
        </Box>
    );
};

// Custom style for navigation buttons
const navButtonStyle = (position) => ({
    position: "absolute",
    top: "44%",
    [position]: "10px",
    transform: "translateY(-50%)",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "#fff",
    padding: "10px",
    borderRadius: "50%",
    zIndex: 3,
    cursor: "pointer",
    marginRight: "10px",
    fontSize: "20px",
    transition: "background-color 0.3s",
    "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
    },
});

export default ContentSlider;
