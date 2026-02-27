'use client';
import { Box, Button, Grid, Typography } from "@mui/material";
import { color, color1, color3, color5, Font } from "../Global";
import { useSelector } from "react-redux";
import { selectFacilities } from "@/redux/features/facilitiesSlice";
import Loader from '../Loader';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ScrollReveal from "../Animation/ScrollReveal";

const Facilities = () => {
    const facilities = useSelector(selectFacilities);
    const router = useRouter();
    useEffect(() => {
        if (typeof window !== "undefined") {
            const hash = window.location.hash.substring(1); // Get the hash value
            if (hash) {
                const element = document.getElementById(hash); // Find the target element
                if (element) {
                    element.scrollIntoView({
                        behavior: "smooth",
                        block: "center" // Initial scroll
                    });
                }
            }
        }
    }, []);

    if (facilities.length === 0) {
        return <Loader />;
    }
    return (
        <Box paddingY={2}>
            {facilities.map((facility, index) => (<ScrollReveal animation="grow" timeout={1000}>
                <Box
                    key={facility.id}
                    id={facility.id}
                    marginBottom={2}
                    display="flex"
                    width="100%"
                    sx={{ height: { md: "300px", sm: "600px", background: 'linear-gradient(to right, #ded5d9, #e1e5ea)', borderRadius: '8px', cursor: 'pointer' } }}
                    justifyContent="center"
                    className='facility-box'
                >
                    <Grid
                        container
                        width="100%"
                        borderRadius={2}
                        padding={0}
                        display="flex"
                        sx={{
                            overflow: "hidden",
                            boxShadow: 3,
                            flexDirection: { md: index % 2 === 0 ? "row-reverse" : "row" },
                        }}
                    >
                        {/* Image Section */}

                        <Grid item xs={12} md={4} >
                            <Box
                                display="flex"
                                width="100%"
                                height="300px"
                                overflow="hidden"
                                sx={{
                                    borderRadius: {
                                        xs: "10px 10px 0px 0px",
                                        md: index % 2 === 0 ? "0px 10px 10px 0px" : "10px 0px 0px 10px",
                                    },
                                    position: "relative",
                                }}
                            >
                                <Image
                                    src={`https://accf-api.cancercareinstituteguwahati.org/storage/${facility.photo}`}
                                    alt='img'
                                    className="facility-image"
                                    fill
                                    priority
                                    sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    style={{
                                        objectFit: "cover",
                                        objectPosition: "center",
                                    }}
                                />
                            </Box>
                        </Grid>

                        {/* Content Section */}
                        <Grid
                            item
                            xs={12}
                            md={8}
                            sx={{
                                borderRadius: { xs: "0px 0px 10px 10px", lg: "10px 0px 0px 10px" },
                                display: "flex",
                                flexDirection: "column",
                                // justifyContent: "center",
                                padding: 3,
                                backgroundColor: 'transparent'
                            }}
                        >
                            <Typography variant="h6" sx={{ "&:hover": { color: color3 }, fontWeight: 'bold' }}>
                                {facility.name}
                            </Typography>
                            <Box
                                display="flex"
                                width="100%"
                                height="40px"
                                alignItems="center"
                                marginY={1}
                            >
                                <Box
                                    display="flex"
                                    className="facility-progress"

                                    sx={{ width: { md: '5%', xs: "20%" } }}
                                    height="10px"
                                    backgroundColor={color3}
                                    borderRadius={20}
                                ></Box>
                            </Box>
                            <Typography sx={{ fontSize: { xs: "14px", md: "16px" }, whiteSpace: "pre-line", overflow: 'hidden' }}>
                                {facility.short_description}
                            </Typography>
                            {facility.read_more ? <Box sx={{ display: "flex", marginTop: "auto" }} onClick={() => router.push(`/facilities?expand=true#${facility.id}`)}>
                                <Button aria-label="Submit Form" sx={{ color: color3 }}>Read More</Button>
                            </Box> : <></>}
                        </Grid>
                    </Grid>
                </Box></ScrollReveal>
            ))}
        </Box>
    );
};

export default Facilities;
