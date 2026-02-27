"use client";

import { useEffect, useState } from "react";
import {
  FiberManualRecord,
  LocationCity,
  Mail,
  Phone,
  WhatsApp,
} from "@mui/icons-material";
import { Box, Grid, ListItem, ListItemIcon, Typography } from "@mui/material";
import GoogleMapEmbed from "../Google_Map/GoogleMap";
import SocialIcons from "../SocialIcons";
import { useSelector } from "react-redux";
import { selectHospitals } from "@/redux/features/hospitalSlice";
import { selectFacilities } from "@/redux/features/facilitiesSlice";
import { selectHospitalDetails } from "@/redux/features/hospitalDetailSlice";
import { useRouter } from "next/navigation";
import Loader from "../Loader";

const Footer = () => {
  const hospitalData = useSelector(selectHospitalDetails);
  const hospitalList = useSelector(selectHospitals);
  const facilityList = useSelector(selectFacilities);
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null; // Prevents hydration mismatch
  if (!hospitalData || !hospitalList.length || !facilityList.length) {
    return <Loader />;
  }

  const RenderListItem = ({ text }) => (
    <ListItem
      sx={{
        padding: "4px 0",
        display: "flex",
        alignItems: "center",
      }}
      onClick={() => router.push(`${facility.domain}`)}
    >
      <ListItemIcon sx={{ minWidth: "16px", color: "gray" }}>
        <FiberManualRecord fontSize="small" sx={{ fontSize: "8px" }} />
      </ListItemIcon>
      <Typography
        sx={{
          color: "gray",
          fontSize: "14px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          "&:hover": { color: "black" },
        }}
      >
        {text}
      </Typography>
    </ListItem>
  );

  return (<></>
    // <Box
    //   sx={{
    //     display: "flex",
    //     width: "100%",
    //     flexDirection: "column",
    //     alignItems: "center",
    //     padding: 1,
    //     backgroundColor: "#f9f9f9",
    //     color: "black",
    //   }}
    // >
    //   <Grid
    //     container
    //     spacing={3}
    //     justifyContent="center"
    //     width={{ xs: "100%", md: "90%" }}
    //   >
        // {/* Our Hospitals */}
        // <Grid item xs={12} sm={6} lg={2} display='none'>
        //   <Typography variant="h6" mb={1}>
        //     ACCF Network
        //   </Typography>
        //   {hospitalList.map((hospital, index) => (
        //     <Box
        //       key={hospital.id || index}
        //       onClick={() => window.open(hospital.location, "_blank")}
        //       sx={{
        //         cursor: "pointer",
        //         "&:hover": {},
        //       }}
        //     >
        //       <RenderListItem
        //         text={hospital.id === 1 ? "SCI" : hospital.name.split(" ")[0]}
        //       />
        //     </Box>
        //   ))}
        // </Grid>

        // {/* Facilities */}
        // <Grid item xs={12} sm={6} lg={4} display='none'>
        //   <Typography variant="h6" mb={1}>
        //     Facilities
        //   </Typography>
        //   <Grid container spacing={1}>
        //     {facilityList.map((facility, index) => (
        //       <Grid
        //         item
        //         xs={6}
        //         key={facility.id || index}
        //         sx={{
        //           cursor: "pointer",
        //           "&:hover": {
        //             // transform: 'scale(1.05)'
        //           },
        //         }}
        //         onClick={() => router.push(`/facilities#${facility.id}`)}
        //       >
        //         <RenderListItem text={facility.name} />
        //       </Grid>
        //     ))}
        //   </Grid>
        // </Grid>

        // {/* Contact Us */}
        // <Grid item xs={12} sm={6} lg={6}>
        //   <Typography variant="h6" mb={1}>
        //     Contact Us
        //   </Typography>
        //   {hospitalData.phone2 !== null ? (
        //     <Typography
        //       color="gray"
        //       fontSize="14px"
        //       display="flex"
        //       alignItems="center"
        //       mb={1}
        //       component="a"
        //       href={`tel:${hospitalData.phone2}`}
        //       sx={{
        //         textDecoration: "none",
        //         cursor: "pointer",
        //         "&:hover": { color: "black" },
        //       }}
        //     >
        //       <Phone sx={{ color: "gray", mr: 1 }} /> {hospitalData.phone2}
        //     </Typography>
        //   ) : (
        //     <></>
        //   )}
        //   {hospitalData.phone !== null ? (
        //     <Typography
        //       color="gray"
        //       fontSize="14px"
        //       display="flex"
        //       alignItems="center"
        //       mb={1}
        //       component="a"
        //       href={`tel:${hospitalData.phone || ""}`}
        //       sx={{
        //         textDecoration: "none",
        //         cursor: "pointer",
        //         "&:hover": { color: "black" },
        //       }}
        //     >
        //       <Phone sx={{ color: "gray", mr: 1 }} />{" "}
        //       {hospitalData.phone || "Not Available"}
        //     </Typography>
        //   ) : (
        //     <></>
        //   )}
        //   {hospitalData.whatsapp !== null ? (
        //     <Typography
        //       color="gray"
        //       fontSize="14px"
        //       display="flex"
        //       alignItems="center"
        //       mb={1}
        //       component="a"
        //       href={`https://wa.me/${hospitalData.whatsapp}`}
        //       target="_blank"
        //       rel="noopener noreferrer"
        //       sx={{
        //         textDecoration: "none",
        //         cursor: "pointer",
        //         "&:hover": { color: "black" },
        //       }}
        //     >
        //       <WhatsApp sx={{ color: "gray", mr: 1 }} /> {hospitalData.whatsapp}
        //     </Typography>
        //   ) : (
        //     <></>
        //   )}

        //   {hospitalData.email !== null ? (
        //     <Typography
        //       color="gray"
        //       fontSize="14px"
        //       display="flex"
        //       alignItems="center"
        //       mb={1}
        //       component="a"
        //       href={`mailto:${hospitalData.email}`}
        //       sx={{
        //         textDecoration: "none",
        //         cursor: "pointer",
        //         "&:hover": { color: "black" },
        //       }}
        //     >
        //       <Mail sx={{ color: "gray", mr: 1 }} />
        //       {hospitalData.email}
        //     </Typography>
        //   ) : (
        //     <></>
        //   )}

        //   <Typography
        //     color="gray"
        //     fontSize="14px"
        //     display="flex"
        //     alignItems="center"
        //     mb={1}
        //     component="a"
        //     // www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2802.9361854775275!2d94.0762858!3d27.2698476!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x374137da4953ce8f%3A0x5209d20793d399bf!2sLAKHIMPUR%20CANCER%20CENTRE!5e1!3m2!1sen!2sin!4v1747637931838!5m2!1sen!2sin
        //     href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        //       hospitalData.address || ""
        //     )}`}
        //     target="_blank"
        //     rel="noopener noreferrer"
        //     sx={{
        //       textDecoration: "none",
        //       cursor: "pointer",
        //       "&:hover": { color: "black" },
        //     }}
        //   >
        //     <LocationCity sx={{ color: "gray", mr: 1 }} />{" "}
        //     {hospitalData.address || "Not Available"}
        //   </Typography>

        //   <SocialIcons
        //     Facebook={hospitalData.Facebook}
        //     Twitter={hospitalData.Twitter}
        //     LinkedIn={hospitalData.LinkedIN}
        //     Instagram={hospitalData.Insta}
        //   />
        // </Grid>

        // {/* Location */}
    //     <Grid item xs={12} sm={6} lg={6}>
    //       <Typography variant="h6" mb={1}>
    //         Landmark
    //       </Typography>
    //       <GoogleMapEmbed URL={hospitalData.gmap || ""} />
    //     </Grid>
    //   </Grid>
    // </Box>
  );
};

export default Footer;
