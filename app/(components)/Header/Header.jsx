"use client";
import { useEffect, useState } from "react";
import { BottomNavigation, BottomNavigationAction, Box, Fab, Grid, Typography } from "@mui/material";
import { Favorite, KeyboardArrowUp, Restore } from "@mui/icons-material";
import Navbar from "../Navbar/Navbar";
import SocialIcons from "../SocialIcons";
import { color1 } from "../Global";
import Loader from "../Loader";
import { color } from "../Global";
import { removeBackslashes, VideosAccess } from "@/lib/fetchData";
import { useSelector } from "react-redux";
import { selectHospitalDetails } from "@/redux/features/hospitalDetailSlice";
import Image from "next/image";
import BottomNavigationComponent from './BottomNavigationComponent';

const Header = () => {
    const HospitalDetails = useSelector(selectHospitalDetails);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [hydrated, setHydrated] = useState(false);
    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    useEffect(() => {
        setHydrated(true);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setOpen(true);
        }, 10000); // 10 seconds

        // Cleanup on unmount
        return () => clearTimeout(timer);
    }, []);

    if (!hydrated) return null;
    if (!HospitalDetails) return <Loader />;

    return (
        <>
            {/* Header Top Section */}
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    backgroundColor: "#ffffff",
                    position: "relative",
                    top: 0,
                    zIndex: 1000,
                    // marginTop:'5px', 
                    px: { xs: 2, md: 4 },
                    justifyContent: "center",
                    color: "black",
                    // border:"1px black solid",
                    marginBottom: { xs: '0px', md: '0px' }
                }}
            // mb={2}
            >
                <Grid container alignItems="center" justifyContent="space-between" spacing={2} width="100%">
                    {/* Logo & Hospital Name */}

                     <Grid
                        item
                        xs={12}
                        md={7}
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", md: "row" },
                            alignItems: { xs: "center", md: "center" },
                            gap: 2,
                            // position: 'relative'
                        }}
                    >
                        <Box sx={{
                            display: { xs: 'none', md: 'flex' },
                        }}>
                            {HospitalDetails.logo_primary == null ? <></> :
                                <Image
                                    src={`https://accf-api.cancercareinstituteguwahati.org/storage/${removeBackslashes(HospitalDetails.logo_primary)}`}
                                    alt="ACCF Logo"
                                    width={100}
                                    height={100}
                                    priority
                                    style={{ objectFit: "contain", width: '100px', height: '100px', cursor: 'pointer' }}
                                    onClick={() => window.location.href = '/'}
                                />}
                        </Box>
                        <Box textAlign={{ xs: "center", md: "left" }} sx={{
                            display: { xs: 'none', md: 'flex' }, flexDirection: 'column'
                        }}>
                            <Typography variant="h6" fontWeight="bold">
                                {HospitalDetails.aname}
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: "#bf1e2e",
                                    fontWeight: "bold",
                                    fontSize: { xs: "24px", sm: "18px", md: "20px" },
                                }}
                            >
                                {HospitalDetails?.name || "Hospital Name"}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#bf1e2e", fontSize: { xs: "12px", sm: "14px" } }}>
                                A Unit Of Assam Cancer Care Foundation
                            </Typography>
                        </Box>
                        <Box sx={{
                            display: { xs: 'none', md: 'flex' },
                        }}>
                            {HospitalDetails.logo_secondary == null ? <></> :
                                <Image
                                    src={`https://accf-api.cancercareinstituteguwahati.org/storage/${removeBackslashes(HospitalDetails.logo_secondary)}`}
                                    alt="ACCF Logo"
                                    width={100}
                                    height={100}
                                    priority
                                    style={{ objectFit: "contain", width: '100px', height: '100px', cursor: 'pointer' }}
                                    onClick={() => window.location.href = '/'}
                                />}
                        </Box>
                    </Grid> 

                    {/* Contact Info and Social Icons */}
                     <Grid item xs={12} md={5} sx={{ textAlign: { xs: "center", md: "right" }, display: { xs: 'none', md: 'flex' }, flexDirection: 'column' }}>
                        <Typography
                            variant="h6"
                            component="a"
                            href="tel:18003454325"
                            sx={{
                                fontWeight: 800,
                                color: color1,
                                fontSize: { xs: "14px", sm: "16px", md: "14px" },
                                textDecoration: "none",
                                cursor: "pointer",
                            }}
                        >
                            FOR QUERY & APPOINTMENT, CALL 18003454325
                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                gap: "10px",
                                justifyContent: { xs: "center", md: "flex-end" },
                                mt: 1,
                            }}
                        >
                            <SocialIcons />
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            <Typography textAlign='center' sx={{ display: { md: 'none', lg: 'none', sm: 'flex', xs: 'flex', xl: 'none' }, justifyContent: 'center' }} marginTop={1} color="#bf1e2e" fontWeight='bold'>{HospitalDetails?.name}</Typography>
            <Box
                sx={{
                    width: "100%",
                    position: "sticky",
                    top: 0,
                    zIndex: 5,
                    paddingTop:{xs:1, md:0},
                    backgroundColor: "white",
                }}
            >
                <Navbar Title={HospitalDetails?.name} setMobileOpen={setMobileOpen} mobileOpen={mobileOpen}/>
                <Box sx={{ display: 'flex', justifyContent: 'center', position: 'absolute', width: '100%' }}>
                    <hr style={{ borderTop: "1px solid lightgray", width: '100%' }} />
                </Box>
            </Box>
            <Fab
                aria-label="scroll-top"
                sx={{
                    position: "fixed",
                    bottom: 66,
                    right: 16,
                    zIndex: 1000,
                    backgroundColor: color,
                    color: "#fff",
                    "&:hover": {
                        backgroundColor: "#333",
                    },
                }}
                onClick={handleScrollToTop}
            >
                <KeyboardArrowUp />
            </Fab>
            <BottomNavigationComponent setMobileOpen={setMobileOpen} mobileOpen={mobileOpen}/>
        </>
    );
};

export default Header;
