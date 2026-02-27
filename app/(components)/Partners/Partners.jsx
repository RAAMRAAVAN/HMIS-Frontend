'use client'
import { FetchPartners2 } from "@/lib/fetchData";
import { Box, Grid } from "@mui/material";
import { color1, color4 } from "../Global";
import ScrollReveal from "../Animation/ScrollReveal";
import { useEffect, useState } from "react";
import Loader from "../Loader";
import Image from "next/image";

const Partners = () => {
    // const partners = FetchPartners;
    const [Partners, setPartners] = useState([]);

    const fetchPartners = async () => {
            // setLoading2(true);
            try {
                const data = await FetchPartners2();
                // if(data?.leng)
                setPartners(data)
            } catch (error) {
                console.error("Error fetching hospital data:", error);
            } finally {
                // setLoading2(false);
            }
        };
    useEffect(()=>{
        fetchPartners();
    }, [])
    if(Partners.length > 0)
    return (
        <Grid container alignItems="center" spacing={1}>
            {Partners.map((partner) => (
                <Grid
                    key={partner.id}
                    item
                    lg={3}
                    md={3}
                    sm={4}
                    xs={6}
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    width='100%'
                >
                    <ScrollReveal animation="grow" display="flex" sx={{}}>
                    <Box display='flex' backgroundColor='white' width='100%' paddingY={1} border={`1px solid ${color1}`} 
                    // onClick={() => window.open(partner.link, '_blank')} 
                    sx={{
                            transition: 'transform 0.3s ease',
                            cursor: 'pointer', '&:hover': {
                                transform: 'scale(1.02)'
                            }}}>
                        <Box
                            position="relative"
                            width="100%"
                            height="100px"
                            // border={`1px solid ${color1}`}
                        >
                            <Image
                                src={`https://accf-api.cancercareinstituteguwahati.org/storage/${partner.photo}`}
                                alt="partner logo"
                                fill
                                style={{ objectFit: "contain" }}
                                // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                priority
                            />
                        </Box>
                    </Box>
                    </ScrollReveal>
                </Grid>
            ))}
        </Grid>
    );
    else
    return(<Loader/>)
};

export default Partners;
