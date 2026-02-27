'use client'
import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowBack } from "@mui/icons-material";
import { useEffect } from "react";

const Doctors = [
    {
        "SlNO": 1,
        "Name": "Dr. Devajit Choudhury",
        "Departments": "Administration",
        "Qualification": "MS (Surgery);FMAS",
        opds: []
    },
    {
        "SlNO": 2,
        "Name": "Dr. Kamal Chakraborty",
        "Departments": "Administration",
        "Qualification": "Diploma in Peadiartic",
        opds: []
    },
    {
        "SlNO": 3,
        "Name": "Lt Col(Dr) Pranab Bhuyan",
        "Departments": "Administration",
        "Qualification": "BDS; PGDHA; MBA; PhD",
        opds: []
    },
    {
        "SlNO": 4,
        "Name": "Dr Smriti Goswami",
        "Departments": "Radiation Oncology",
        "Qualification": "MBBS; MD(Radiation Oncology)",
        opds: [3, 6]
    },
    {
        "SlNO": 5,
        "Name": "Dr. Diplu Choudhury",
        "Departments": "Radiation Oncology",
        "Qualification": "MD (Radiation Oncology)",
        opds: [6]
    },
    {
        "SlNO": 6,
        "Name": "Dr. Ghritashee Bora",
        "Departments": "Radiation Oncology",
        "Qualification": "MD (Radiation Oncology)",
        opds: [4]
    },
    {
        "SlNO": 7,
        "Name": "Dr Moumita Paul",
        "Departments": "Radiation Oncology",
        "Qualification": "MBBS; MD(Radiation Oncology)",
        opds: [2]
    },
    {
        "SlNO": 8,
        "Name": "Dr. Luri Borah",
        "Departments": "Radiation Oncology",
        "Qualification": "MBBS; MD(Radiation Oncology)",
        opds: [7]
    },
    {
        "SlNO": 9,
        "Name": "Dr. Hima Bora",
        "Departments": "Radiation Oncology",
        "Qualification": "MBBS; MD",
        opds: [7]
    },
    {
        "SlNO": 10,
        "Name": "Dr. Biswajit Sarma",
        "Departments": "Radiation Oncology",
        "Qualification": "MBBS; MD(Radiation Oncology)",
        opds: [2]
    },
    {
        "SlNO": 11,
        "Name": "Dr. Rheetwik Baruah",
        "Departments": "Radiation Oncology",
        "Qualification": "MBBS; MD(Radiation Oncology)",
        opds: [4]
    },
    {
        "SlNO": 12,
        "Name": "Dr. Rajiv Paul",
        "Departments": "Surgical Oncology",
        "Qualification": "MBBS; MS(general surgery); DNB (Sugical Oncology)",
        opds: [4, 7]
    },
    {
        "SlNO": 13,
        "Name": "Dr. Ashutosh Sahewalla",
        "Departments": "Surgical Oncology",
        "Qualification": "MBBS; MS(general surgery); M.Ch (Surgical Oncology)",
        opds: [4, 7]
    },
    {
        "SlNO": 14,
        "Name": "Dr. Fermin Iswary",
        "Departments": "Surgical Oncology",
        "Qualification": "MBBS; MS(general surgery); Fellow surgical oncology",
        opds: [2, 5]
    },
    {
        "SlNO": 15,
        "Name": "Dr Ganesh Das",
        "Departments": "Surgical Oncology",
        "Qualification": "MBBS; MS; MCH(General Surgery)",
        opds: [3, 6]
    },
    {
        "SlNO": 16,
        "Name": "Dr. Dwipen Kalita",
        "Departments": "Surgical Oncology",
        "Qualification": "MBBS; MS(General Surgery)",
        opds: [2, 5]
    },
    {
        "SlNO": 17,
        "Name": "Dr. Swati Sattavan",
        "Departments": "Surgical Oncology",
        "Qualification": "MBBS; MS(general surgery); PDCC (Breast Surgery); Fellowship (Surgical Oncology)",
        opds: [3, 6]
    },
    {
        "SlNO": 18,
        "Name": "Dr. Arun PS",
        "Departments": "Surgical Oncology",
        "Qualification": "MBBS; MS(general surgery); DNB (General Surgery); MCh (Surgical Oncology)",
        opds: [3, 6]
    },
    {
        "SlNO": 19,
        "Name": "Dr. Arpan Choudhury",
        "Departments": "Surgical Oncology",
        "Qualification": "MBBS; MS(general surgery); DrNB (Surgical Oncology)",
        opds: [2, 5]
    },
    {
        "SlNO": 20,
        "Name": "Dr Bhavesh Kumar das",
        "Departments": "Surgical Oncology",
        "Qualification": "MBBS; MS(general surgery);",
        opds: [2, 5]
    },
    {
        "SlNO": 21,
        "Name": "Dr Mridul Kumar Sarma",
        "Departments": "Head and Neck Oncology",
        "Qualification": "MBBS; MS(ENT)",
        opds: [2, 5]
    },
    {
        "SlNO": 22,
        "Name": "Dr. Ajit Kr Missong",
        "Departments": "Head and Neck Oncology",
        "Qualification": "MBBS; MS(ENT); Fellowship(Head and Neck Oncology)",
        opds: [4, 7]
    },
    {
        "SlNO": 23,
        "Name": "Asim Debnath",
        "Departments": "Head and Neck Oncology",
        "Qualification": "MBBS; MS(ENT); Post doctoral fellowship in head and neck oncology",
        opds: [4, 7]
    },
    {
        "SlNO": 24,
        "Name": "Dr Debadeep Bagchi",
        "Departments": "Head and Neck Oncology",
        "Qualification": "MBBS; MS(ENT); MCh Head and Neck Oncology",
        opds: [2, 5]
    },
    {
        "SlNO": 25,
        "Name": "Dr. Mrinmoy Mayur Choudhury",
        "Departments": "Head and Neck Oncology",
        "Qualification": "MBBS; MS(ENT)",
        opds: [3, 6]
    },
    {
        "SlNO": 26,
        "Name": "Dr. (Mrs) Neelakshi Mahanta",
        "Departments": "Medical Oncology",
        "Qualification": "MBBS; MD( Medicine); Trained in Medical Oncology (WIA, Cancer Institute, Adyar, Chennai); WHO Fellow Geriatrics(Thailand)",
        opds: [3, 6]
    },
    {
        "SlNO": 27,
        "Name": "Dr. Arpita Ray",
        "Departments": "Medical Oncology",
        "Qualification": "MBBS; MD( Medicine); Fellowship in Medical Oncology(Solid tumor)",
        opds: [5]
    },
    {
        "SlNO": 28,
        "Name": "Dr. Niharika Kutum",
        "Departments": "Medical Oncology",
        "Qualification": "MBBS; MD( Medicine); Fellow in medical oncology in solid tumor",
        opds: [7]
    },
    {
        "SlNO": 29,
        "Name": "Dr. Naukib Ahmed Choudhury",
        "Departments": "Medical Oncology",
        "Qualification": "MBBS; MD( Medicine)",
        opds: []
    },
    {
        "SlNO": 30,
        "Name": "Dr Rup Jyoti Sarma",
        "Departments": "Medical Oncology",
        "Qualification": "MBBS; MD( Medicine); DM Medical Oncology",
        opds: [4]
    },
    {
        "SlNO": 31,
        "Name": "Dr. Ranjumoni Konwar",
        "Departments": "RADIOLOGY ( RADIODIAGNOSIS)",
        "Qualification": "MBBS; MD.( RADIODIAGNOSIS)",
        opds: []
    },
    {
        "SlNO": 32,
        "Name": "Dr. Aditi Das",
        "Departments": "Radiology",
        "Qualification": "MBBS; MD.( RADIODIAGNOSIS)",
        opds: []
    },
    {
        "SlNO": 33,
        "Name": "Dr. Binoy Kumar Choudhary",
        "Departments": "Radiology",
        "Qualification": "MBBS; MD.( RADIODIAGNOSIS); FICR;",
        opds: []
    },
    {
        "SlNO": 34,
        "Name": "Dr. Mandakinee Phukan",
        "Departments": "Nuclear Medicine",
        "Qualification": "MBBS; DNB (Nuclear Medicine)",
        opds: []
    },
    {
        "SlNO": 35,
        "Name": "Dr Jili Basing",
        "Departments": "Oncoanaesthesia",
        "Qualification": "MBBS; MD (Anaesthesia);Fellowship (Oncoanaesthesia); CCEPC",
        opds: []
    },
    {
        "SlNO": 36,
        "Name": "Dr Rousanara Begum",
        "Departments": "OncoAnaesthesiology",
        "Qualification": "MBBS; MD (Anaesthesia)",
        opds: []
    },
    {
        "SlNO": 37,
        "Name": "Nicky Kumari Shah",
        "Departments": "Oncoanaesthesia",
        "Qualification": "MBBS; MD (Anaesthesia); DA; DNB; Fellow Oncoanaesthesia; CCEPC",
        opds: []
    },
    {
        "SlNO": 38,
        "Name": "Dr. Upasana Majumdar",
        "Departments": "Anaesthesiology",
        "Qualification": "MBBS; MD (Anaesthesia)",
        opds: []
    },
    {
        "SlNO": 39,
        "Name": "Dr. Muktanjalee Deka",
        "Departments": "Pathology",
        "Qualification": "MBBS; MD (Pathology)",
        opds: []
    },
    {
        "SlNO": 40,
        "Name": "Dr Jagannath Dev Sharma",
        "Departments": "Oncopathology",
        "Qualification": "MBBS; MD (Pathology)",
        opds: []
    },
    {
        "SlNO": 41,
        "Name": "Dr. Barasha Sarma Bharadwaj",
        "Departments": "Oncopathology",
        "Qualification": "MBBS; DCP(GMCH); DNB",
        opds: []
    },
    {
        "SlNO": 42,
        "Name": "Dr. Lachit Kalita",
        "Departments": "Oncopathology",
        "Qualification": "MBBS; MD; Fellowship in Oncopathology",
        opds: []
    },
    {
        "SlNO": 43,
        "Name": "Dr.  Nandakanta Mahanta",
        "Departments": "Oncopathology",
        "Qualification": "MBBS; MD Pathology",
        opds: []
    },
    {
        "SlNO": 44,
        "Name": "Dr. Syeda Mohsina Rohman",
        "Departments": "Biochemistry",
        "Qualification": "MBBS; MD",
        opds: []
    },
    {
        "SlNO": 45,
        "Name": "Dr. Mousumi Borgohain Borah",
        "Departments": "Biochemistry",
        "Qualification": "MBBS; MD",
        opds: []
    },
    {
        "SlNO": 46,
        "Name": "Dr. Kaushik Nath",
        "Departments": "Biochemistry",
        "Qualification": "MBBS; MD Biochemistry",
        opds: []
    },
    {
        "SlNO": 47,
        "Name": "Dr. Mridusmita Das",
        "Departments": "Biochemistry",
        "Qualification": "MBBS; MD (BIOCHEMISYRY)",
        opds: []
    },
    {
        "SlNO": 48,
        "Name": "Dr. Daiji Gogoi Mohan",
        "Departments": "MICROBIOLOGY",
        "Qualification": "MBBS; MD",
        opds: []
    },
    {
        "SlNO": 49,
        "Name": "Dr. Supriya Sona",
        "Departments": "Microbiology",
        "Qualification": "MBBS; MD Microbiology",
        opds: []
    },
    {
        "SlNO": 50,
        "Name": "Dr. Sunita Das",
        "Departments": "Microbiology",
        "Qualification": "MBBS; MD Microbiology",
        opds: []
    },
    {
        "SlNO": 51,
        "Name": "Dr Arun Deka",
        "Departments": "Pain and Palliative Medicine",
        "Qualification": "MBBS; MD",
        opds: []
    },
    {
        "SlNO": 52,
        "Name": "Dr Shruti Kannan",
        "Departments": "Preventive Oncology",
        "Qualification": "MBBS; MS; DNB in Obstetrics; Gynaecology",
        opds: []
    }
]

// import { Box, Typography, Grid, IconButton, Button } from '@mui/material';
// import { useRouter, useSearchParams } from 'next/navigation';
// import ArrowBack from '@mui/icons-material/ArrowBack';
// import Doctors from './Doctors'; // Ensure this is imported correctly

const Days = (opds) => {
    const dayMap = {
        1: "Sunday",
        2: "Monday",
        3: "Tuesday",
        4: "Wednesday",
        5: "Thursday",
        6: "Friday",
        7: "Saturday",
    };

    return opds
        .map((num) => dayMap[num])
        .filter(Boolean)
        .join(', ');
};

const Department = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const departmentName = searchParams.get("name");


    //   const router = useRouter();
      useEffect(() => {
          let idleTimeout;
      
          const startIdleTimer = () => {
            clearTimeout(idleTimeout);
            idleTimeout = setTimeout(() => {
              router.push("/doctorsDirectory");
            }, 10000); // 10 seconds of no activity
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

    return (
        <Box display='flex' width='100%' justifyContent='center' position='relative'>
            <Box display='flex' width='100%' flexDirection='column' sx={{
                overflow: 'hidden',
                boxShadow: 3,
                position: 'relative',
                // Pseudo-element for background blur
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    width: '100%',
                    height: '100%',
                    left: 0,
                    backgroundImage: "url(/bg3.jpg)",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    filter: 'blur(10px)',
                    zIndex: 0,
                }
            }}>
                <Box position='absolute' left={10} display='flex' top={10}>
                    <IconButton
                        onClick={() => router.back()}
                        sx={{
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'transparent',
                                color: 'white',
                            }, position:'relative', zIndex:10001
                        }}
                        aria-label="Go back"
                    >
                        <ArrowBack sx={{ fontSize: 70 }} />
                        <Typography fontSize={30} fontWeight='bold'>Back</Typography>
                    </IconButton>
                </Box>
                <Typography textAlign='center' position='relative' marginY={3} fontWeight='bold' variant="h3" sx={{ color: 'rgb(0, 49, 83)', textShadow: '0px 4px 8px white', }}>
                    {departmentName}
                </Typography>
                <Grid container paddingY={5} display='flex' width='100%'>
                    {Doctors.map((doctor, index) => {
                        if (departmentName === doctor.Departments)
                            return (
                                <Grid key={index} item xs={12} sm={6} md={4} lg={3} padding={4} display="flex" flexDirection='column' width="100%">
                                    <Button
                                        // onClick={() => { router.push('/') }}
                                        sx={{
                                            display: 'flex',
                                            padding: 2,
                                            flexDirection: 'column',
                                            width: "400px",
                                            boxShadow: 3,
                                            height: '400px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, darkviolet, darkviolet, rgb(37, 150, 221))',
                                            cursor: 'pointer',
                                            border:'5px white solid'
                                        }}
                                    >
                                        <Typography fontWeight='bold' color="white" fontSize='24px'>{doctor.Name}</Typography>
                                        <Typography color="white" fontSize='17px'>[{doctor.Qualification}]</Typography>
                                    </Button>
                                    {doctor.opds.length > 0 && (
                                        <Box display='flex' flexDirection='column' marginTop={1} position='relative'>
                                            <Typography fontWeight='bold' marginRight={1} textAlign='center' color="white" fontSize={22}>Available On:</Typography>
                                            <Typography textAlign='center' color="white" fontSize={22}>{Days(doctor.opds)}</Typography>
                                        </Box>
                                    )}
                                </Grid>
                            )
                        return null;
                    })}
                </Grid>
            </Box>
        </Box>
    );
};

export default Department;
