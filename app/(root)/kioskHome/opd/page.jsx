"use client";

import { Box, Button, Grid, Typography } from "@mui/material";
// import { color3 } from '../../(components)/Global';
import ContentSlider from "./Slider";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Floors = [
    {
        id: 1,
        floor: "GROUND FLOOR",
        Department: "Radiation Oncology",
        Departments: [{ label: "Monday", doctors: [{name:'Dr. Moumita Pal'}, {name:'Dr. Biswajit Sharma'}] }, { label: "Tuesday", doctors: [{name:'Dr. Smriti Goswami'}] }, { label: "Wednesday", doctors: [{name:'Dr. Rheetwik Baruah'}]}],
        Days2: [{ label: "Thursday", doctors: [{name:'Dr. Gitashree Bora'}] }, { label: "Friday", doctors: [{name:'Dr. Diplu Choudhhury'}, {name:'Dr. Smriti Goswami'}] }, { label: "Saturday", doctors: [{name:'Dr. Luri Borah'}, {name:'Dr. Hima Bora'}] }]
    },
    {
        id: 2,
        floor: "SECOND FLOOR",
        Department: "Surgical Oncology",
        Departments: [{ label: "Monday", doctors: [{name:'Dr Bhavesh Kumar das'}, {name:'Dr. Arpan Choudhury'}, {name:'Dr. Dwipen Kalita'}, {name:'Dr. Fermin Iswary'}] }, { label: "Tuesday", doctors: [{name:'Dr. Ganesh Das'}, {name:'Dr. Arun PS'}, {name:'Dr Swati Sattavan'}] }, { label: "Wednesday", doctors: [{name:'Dr. Rajiv Paul'}, {name:'Dr. Ashutosh Sahewalla'}, {name:'Dr. Hrishkesh Deka'}]}],
        Days2: [{ label: "Thursday", doctors: [{name:'Dr Bhavesh Kumar das'}, {name:'Dr. Arpan Choudhury'}, {name:'Dr. Dwipen Kalita'}, {name:'Dr. Fermin Iswary'}] }, { label: "Friday", doctors: [{name:'Dr. Ganesh Das'}, {name:'Dr. Arun PS'}, {name:'Dr Swati Sattavan'}] }, { label: "Saturday", doctors: [{name:'Dr. Rajiv Paul'}, {name:'Dr. Ashutosh Sahewalla'}, {name:'Dr. Hrishkesh Deka'}] }]
    },
    {
        id: 3,
        floor: "THIRD FLOOR",
        Department: "Medical Oncology",
        Departments: [{ label: "Monday", doctors: [{name:'Dr. Tarjina Begum'}] }, { label: "Tuesday", doctors: [{name:'Dr. (Mrs) Neelakshi Mahanta'}] }, { label: "Wednesday", doctors: [{name:'Dr Rup Jyoti Sarma'}]}],
        Days2: [{ label: "Thursday", doctors: [{name:'Dr. Arpita Ray'}] }, { label: "Friday", doctors: [{name:'Dr. (Mrs) Neelakshi Mahanta'}] }, { label: "Saturday", doctors: [ {name:'Dr. Niharika Kutum'}] }]
    },
    {
        id: 4,
        floor: "THIRD FLOOR",
        Department: "Head and Neck Oncology",
        Departments: [{ label: "Monday", doctors: [{name:'Dr. Mridul Kumar Sarma'}, {name:'Dr. Debadeep Bagchi'}] }, { label: "Tuesday", doctors: [{name:'Dr. Mrinmoy Mayur Choudhury'}, {name:'Dr. Maitree'}] }, { label: "Wednesday", doctors: [{name:'Dr. AK Missong'}, {name:'Dr. Asimdeb Nath'}]}],
        Days2: [{ label: "Thursday", doctors: [{name:'Dr. Mridul Kumar Sarma'}, {name:'Dr. Debadeep Bagchi'}] }, { label: "Friday", doctors: [{name:'Dr. Mrinmoy Mayur Choudhury'}, {name:'Dr. Maitree'}] }, { label: "Saturday", doctors: [{name:'Dr. AK Missong'}, {name:'Dr. Asimdeb Nath'}] }]
    },
    {
        id: 5,
        floor: "THIRD FLOOR",
        Department: "Hemato Oncology",
        Departments: [{ label: "Monday", doctors: [{name:'Dr. Laksmy CV'}, {name:'Dr. Rajat Pincha'}] }, { label: "Tuesday", doctors: [{name:'Dr. Laksmy CV'}, {name:'Dr. Rajat Pincha'}] }, { label: "Wednesday", doctors: [{name:'Dr. Laksmy CV'}, {name:'Dr. Rajat Pincha'}]}],
        Days2: [{ label: "Thursday", doctors: [{name:'Dr. Laksmy CV'}, {name:'Dr. Rajat Pincha'}] }, { label: "Friday", doctors: [{name:'Dr. Laksmy CV'}, {name:'Dr. Rajat Pincha'}] }, { label: "Saturday", doctors: [{name:'Dr. Laksmy CV'}, {name:'Dr. Rajat Pincha'}] }]
    }
]

const OPDDoctors = () => {
    const router = useRouter();
    useEffect(() => {
        let idleTimeout;
    
        const startIdleTimer = () => {
          clearTimeout(idleTimeout);
          idleTimeout = setTimeout(() => {
            router.push("/kioskHome/doctorsDirectory");
          }, 40000); // 10 seconds of no activity
        };
    
        const resetTimerOnActivity = () => {
          startIdleTimer();
        };
    
        const activityEvents = ["mousemove", "mousedown", "keydown", "touchstart"];
    
        activityEvents.forEach((event) => {
          window.addEventListener(event, resetTimerOnActivity);
        });
    
        // Start timer initially
        startIdleTimer();
    
        // Cleanup
        return () => {
          clearTimeout(idleTimeout);
          activityEvents.forEach((event) => {
            window.removeEventListener(event, resetTimerOnActivity);
          });
        };
      }, [router]);
    return (<>
        <Box display='flex' width='100%' justifyContent='center'>
            <Box display='flex' width='100%' height='100vh' alignItems='center' flexDirection='column' sx={{
                overflow: 'hidden',
                boxShadow:3,
                position:'relative',
                // Pseudo-element for background blur
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    width:'100%',
                    height:'100%',
                    left: 0,
                    backgroundImage: "url(/background.jpg)",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    filter: 'blur(10px)',
                    zIndex: 0,
                }, borderRadius: '10px',}}>
            <Typography textAlign='center' marginTop={5} fontWeight='bold' variant="h3" color="rgb(0, 49, 83)" position='relative'>OPD Services Department</Typography>
            <Typography textAlign='center' fontWeight='bold' variant="h5" color="white" position='relative'>Doctor/ Consultant/ Room Description</Typography>
            {/* <Box display='flex' height='20vh'></Box> */}
            <ContentSlider Floors={Floors} />
        </Box>
    </Box >
    </>)
}
export default OPDDoctors;