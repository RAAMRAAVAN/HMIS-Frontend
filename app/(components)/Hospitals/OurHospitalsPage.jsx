"use client";
import { selectHospitals } from "@/redux/features/hospitalSlice";
import { Box, Grid, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { color, Font } from '../Global';
import ScrollReveal from "../Animation/ScrollReveal";

const OurHospitalsPage = () => {
    const ourHospitals = useSelector(selectHospitals) || []; // Ensure it's always an array
    return (
        <Box marginBottom={1}>
            <Grid container spacing={1}>
                {ourHospitals.map((hospital) => (
                    <Grid
                        key={hospital.id}
                        item md={2} lg={2} xs={12}
                        sx={{
                            justifyContent: "center",
                            alignItems: "center",
                            display: "flex",
                            cursor: "pointer",
                        }}
                    >
                        {/* <ScrollReveal animation="grow" timeout={1000}> */}
                            <Box
                                sx={{
                                    display: "flex",
                                    width: "98%",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: "50px",
                                    border: `5px solid ${color}`,
                                    backgroundColor: `${color}`,
                                    transition: "all 0.3s ease-in-out",
                                    boxShadow: "none",
                                    "&:hover": {
                                        borderColor: "#ffc107",
                                        transform: "scale(1.05)",
                                        boxShadow: "0px 0px 10px rgba(255, 193, 7, 0.7)",
                                    },
                                }}
                            >
                                <a
                                    href={hospital.location}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{

                                        backgroundColor: "transparent",
                                        color: "white",
                                        display: "flex",
                                        width: "100%",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        padding: "10px 0",
                                        textDecoration: "none",
                                    }}
                                >
                                    <Typography
                                        paddingX={1}
                                        textAlign="center"
                                        fontSize={13}
                                        maxWidth="100%"
                                        overflow="hidden"
                                        textOverflow="ellipsis"
                                        whiteSpace="nowrap"
                                    >
                                        {hospital.name || "Unnamed Hospital"}
                                    </Typography>
                                </a>
                            </Box>
                        {/* </ScrollReveal> */}
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default OurHospitalsPage;
