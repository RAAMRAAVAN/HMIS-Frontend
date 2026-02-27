'use client';
import { Box} from "@mui/material";
import Overview from "./Overview";
import { useSelector } from "react-redux";
import { selectDoctorById, selectDoctorID, selectDoctorsAvailability } from "@/redux/features/doctorSlice";
import Loader from "@/app/(components)/Loader";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const doctorID = useSelector(selectDoctorID);
  const router = useRouter();
  useEffect(() => {
      if (!doctorID) {
        router.replace('/'); // Redirects to the newsAndEvents route
      }
    }, [doctorID, router]);
  
    if (!doctorID) return null;
  return (
    <Box display="flex" width="100%" flexDirection='column'>
      <Overview />
    </Box>
  );
}
