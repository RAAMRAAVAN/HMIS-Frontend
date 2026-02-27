"use client";
import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { selectHospitalDetails } from "@/redux/features/hospitalDetailSlice";
import ContactPage2 from "@/app/(components)/ContactUs/ContactPage2";

const Contact = () => {
    const HospitalDetails = useSelector(selectHospitalDetails);

    // Ensure HospitalDetails is not null before rendering
    if (!HospitalDetails) {
        return <Typography  textAlign="center" marginTop={5}>Loading...</Typography>;
    }

    return (
        <Box display="flex" width="100%" justifyContent="center" sx={{ backgroundColor: '#924f4fff', color: 'black' }}>
            <ContactPage2 />
        </Box>
    );
};

export default Contact;
