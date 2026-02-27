'use client'
import { Box } from "@mui/material";
import DoctorSlider from "../../../(components)/DoctorCard/DoctorSlider";

const doctorslider = () => {
  return (
    <Box marginX={1} display="flex" flexDirection="column">
      <DoctorSlider />
    </Box>
  );
};
export default doctorslider;
