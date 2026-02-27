'use client'
import { Box, Typography } from "@mui/material";
import Entries from "./entries";
import { FetchAboutUs2} from "@/lib/fetchData";
import OurHospitalsPage from "@/app/(components)/Hospitals/OurHospitalsPage";
import Loader from "@/app/(components)/Loader";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { removeBackslashes} from "@/lib/fetchData";
import { selectHospitalDetails } from "@/redux/features/hospitalDetailSlice";

const page = () => {
    const [about, setAbout] = useState([]);
    const HospitalDetails = useSelector(selectHospitalDetails);
    const fetchAboutUs = async () => {
        // setLoading2(true);
        try {
            const data = await FetchAboutUs2();
            // if(data?.leng)
            setAbout(data)
        } catch (error) {
            console.error("Error fetching hospital data:", error);
        } finally {
            // setLoading2(false);
        }
    };
    useEffect(() => {
        fetchAboutUs();
    }, [])

    // if(about.length > 0)
    return (<>
        {/* <ModelofCare/> */}
        <Box display="flex" sx={{ position: "relative", overflow: "hidden" }} width="100%" height="350px">
            <Image
                src={`https://accf-api.cancercareinstituteguwahati.org/storage/${removeBackslashes(HospitalDetails.about_bg)}`}
                alt="background"
                fill
                style={{ objectFit: "cover" }}
                // sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
                // priority
                quality={100}
            />

            <Box
                sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    backgroundColor: "rgba(255, 165, 0, 0.4)",
                    color: "white",
                    padding: "12px 0",
                }}

            >
                <Typography variant="h4" fontWeight="bold" textshadow="2px 2px 10px rgba(0,0,0,0.5)" paddingX={3}>
                    ABOUT US
                </Typography>
            </Box>

        </Box>
        <Box marginTop={3}>
            {/* <Typography  sx={{ fontSize: { xs: 24 } }} fontStyle="italic" marginTop={1} paddingX={2}>Assam cancer care foundation has inaugurated 8 state-of-the-art ACCF cancer hospitals in Assam</Typography> */}
            <Box marginX={2} marginY={1}>
                <OurHospitalsPage />
            </Box>
        </Box>
        <Box sx={{ padding: { md: 4, sm: 1 }, marginX: 1 }}>
            <Entries entries={about} />
        </Box>
    </>)
    // else
    // return(<Loader/>)
}
export default page;