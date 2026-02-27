"use client"; // ✅ This makes it a Client Component

import { removeBackslashes } from "@/lib/fetchData";
import { selectHospitalDetails } from "@/redux/features/hospitalDetailSlice";
import { Facebook, Instagram, LinkedIn, Twitter, X } from "@mui/icons-material";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";

const SocialIcons = () => {
  const HospitalDetails = useSelector(selectHospitalDetails);
  const icons = [
    { component: Facebook, url: HospitalDetails.facebook },
    { component: X, url: HospitalDetails.twitter }, // Add Twitter link here
    { component: LinkedIn, url: HospitalDetails.linkedin }, // Add LinkedIn link here
    { component: Instagram, url: HospitalDetails.instagram }, // Add Instagram link here
  ];

  return (
    <Box sx={{ display: "flex", gap: "10px"}}>
      {icons.map(({ component: Icon, url }, index) => (
        <Icon
          key={index}
          onClick={() => window.open(removeBackslashes(url), "_blank")}
          sx={{
            color: '#bf1e2e',
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 30,
            height: 30,
            borderRadius: "50%",
            border: "1px solid #bf1e2e",
            padding: "3px",
            cursor: "pointer",
            transition: "0.3s",
            "&:hover": {
              backgroundColor: '#bf1e2e',
              color: "white",
            },
          }}
        />
      ))}
    </Box>
  );
};

export default SocialIcons;
