'use client'
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { color4, Font } from "../Global";
import Link from "next/link";
import { setDoctorID } from "@/redux/features/doctorSlice";
import { useDispatch } from "react-redux";

const ContactPage = ({ handleClose, doctorDetails}) => {
    const dispatch = useDispatch();
    return (<>
        <Grid container padding={1} sx={{ backgroundColor: "#eeebeb" }}>
            <Grid item display='flex' flexDirection='row' md={6} sm={12} alignItems='center' width='100%' className="doctor-modal-list" padding={1} style={{ boxShadow: "1px 1px 3px rgba(0, 0, 0, 0.2)", cursor: 'pointer' }}>
                <Grid item xs={5} display='flex' alignItems='center' width='100px' height='100px' borderRadius='50%'>
                    {doctorDetails.doctor_image?<img src={`https://barpetacancercentre.org/images/allLocationDoctors/${doctorDetails.doctor_image}`} alt='imgs' style={{ borderRadius: '50%', boxShadow: "1px 1px 3px rgba(0, 0, 0, 0.2)", display: 'felx', width: '100px', height: '100px' }} />
                    :<img src={`/doctor_image.webp`} alt='imgs' style={{ borderRadius: '50%', boxShadow: "1px 1px 3px rgba(0, 0, 0, 0.2)", display: 'felx', width: '100px', height: '100px' }} />}
                    {/* {`/doctor_image.webp`} */}
                </Grid>
                <Grid item xs={7}>
                    <Typography  fontWeight='bold' overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap">{doctorDetails.name}</Typography>
                    <Typography  overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap">{doctorDetails.designation}</Typography>
                    <Typography  color="gray" fontSize={14} overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap">{doctorDetails.qualifications}</Typography>
                    <Box marginY={1}>
                        <hr />
                    </Box>
                    <Typography  overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap">{doctorDetails.depertment}</Typography>
                    <Link href={`/kioskHome/consultants/doctor_details`} passHref scroll={true} onClick={() => {dispatch(setDoctorID(doctorDetails.id));handleClose()}}>
                        <Typography  color={color4} sx={{ cursor: 'pointer' }}>View Profile</Typography>
                    </Link>
                </Grid>
            </Grid>
        </Grid>

        <Box display='flex' width='100%' backgroundColor='#eeebeb' justifyContent='center'>
            <Box width='98%'>
                <hr style={{ border: '1px white solid' }} />
            </Box>
        </Box>

        <Box
            display="flex"
            width="100%"
            sx={{
                backgroundColor: "#eeebeb",
                p: { md: 2, xs: 0 },
            }}

            // flexDirection="column"
            alignItems='center'
            justifyContent='center'
        >
            <Typography  color="gray" my={1} mx={1} textAlign="center" sx={{
                textDecoration: "none", cursor: "pointer"
            }}
                component="a"
                href={`tel:03732450000`}>
                For appointments, please call our toll-free number:
            </Typography>
            <Typography  sx={{
                textDecoration: "none", cursor: "pointer"
            }}
                component="a"
                href={`tel:03732450000`}>03732450000</Typography>
        </Box></>
    );
};

export default ContactPage;
