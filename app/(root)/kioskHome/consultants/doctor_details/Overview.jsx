'use client';
import { Box, Button, createTheme, Grid, Typography } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import Loader from "@/app/(components)/Loader";
import { color1, DoctorDetails } from "@/app/(components)/Global";
import '@/lib/custom-dayjs-locale';
import DINCModal from "@/app/(components)/DoctorCard/DINCModal";
import { useSelector } from "react-redux";
import { selectDoctorById, selectDoctorsAvailability } from "@/redux/features/doctorSlice";
import Image from "next/image";

const today = dayjs();

// Share Function
const handleShare = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: "Doctor Profile",
        text: "Check out this doctor's profile!",
        url: window.location.href,
      });
      // console.log("Successfully shared");
    } catch (error) {
      console.error("Error sharing:", error);
    }
  } else {
    alert("Sharing is not supported on this device.");
  }
};

const Overview = () => {
  const doctorDetails = useSelector(selectDoctorById());
  const DoctorsAvailability = useSelector(selectDoctorsAvailability);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(dayjs());
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const [staticOPD, setStaticOPD] = useState([1, 2, 3, 4, 5, 6]);

  // useEffect(() => {
  //     const timer = setTimeout(() => setLoading(false), 0);
  //     return () => clearTimeout(timer);
  // }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top on load
    // const timer = setTimeout(() => setLoading(false), 1000);
    // return () => clearTimeout(timer);
  }, []);

  const theme = createTheme({
    components: {
      MuiPickersDay: {
        styleOverrides: {
          root: {
            '&.Mui-disabled': {
              color: '#ccc', // Custom color
              backgroundColor: '#FFF'
            },
          },
        },
      },
    },
  });


  if (loading || !DoctorsAvailability) return <Loader />;

  return (
    <Box display="flex" width="100%" flexDirection="column" alignItems='center' marginBottom='150px'>
      <DINCModal open={open} handleClose={() => setOpen(false)} doctorDetails={doctorDetails} />

      <Grid container width='100%' sx={{ backgroundColor: "#f8f8f8", paddingX: 2 }} justifyContent='space-between'>
        {/* Doctor Image */}
        <Grid item md={4} xs={12} display="flex" justifyContent="center" alignItems="end" position='relative'>
          <Box
            display="flex"
            width="300px"
            height="400px"
            zIndex={1}
            border={`3px ${DoctorDetails} solid`}
            overflow="hidden"
            justifyContent="center"
            alignItems="center"
          >
            <Image
              src={
                doctorDetails?.photo
                  ? `https://accf-api.cancercareinstituteguwahati.org/storage/${doctorDetails.photo}`
                  : `/doctor_image.webp`
              }
              alt="Doctor Image"
              width={300}
              height={400}
              priority={true}
              quality={10}
              placeholder="blur"
              blurDataURL="/doctor_image.webp"
              style={{
                objectFit: "cover",      // Maintain aspect ratio, crop if needed
                objectPosition: "center", // Center the image
                width: "100%",
                height: "100%",
                opacity: imageLoaded ? 1 : 0,
                transition: "opacity 1s ease-in-out",
              }}
              onLoad={() => setImageLoaded(true)}
            />
          </Box>

        </Grid>

        {/* Doctor Details */}
        <Grid item md={4} xs={12} display="flex" flexDirection="column" justifyContent="center" gap={1} padding={1}>
          <Box display='flex' border='1px black sold' alignItems='center'><Typography fontWeight='bold' color={color1} fontSize={30} marginRight={1}>Department: </Typography><Typography fontSize={30}>{doctorDetails.depertment || ""}</Typography></Box>
          <Typography fontWeight="bolder" fontSize={24}>{doctorDetails.name}</Typography>
          <Box display='flex' border='1px black sold' alignItems='center'><Typography fontWeight='bold' color="gray" marginRight={1}>Designation: </Typography> <Typography>{doctorDetails.designation}</Typography></Box>
          <Box display='flex' border='1px black sold' alignItems='center'><Typography fontWeight='bold' color="gray" marginRight={1}>Specialization: </Typography> <Typography>{doctorDetails.specialization || ''}</Typography></Box>
          
          <Box display='flex' border='1px black sold' alignItems='center'><Typography fontWeight='bold' color="gray" marginRight={1} marginY={1}>Qualifications: </Typography> <Typography>{doctorDetails.qualification || ''}</Typography></Box>
        </Grid>

        {/* Calendar Section */}

        <Grid item md={4} xs={12} display="flex" justifyContent="center" alignItems="center">
          {staticOPD && staticOPD.length !== 0 && false &&(
            <Box backgroundColor='white' sx={{ borderRadius: '20px' }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                  value={dayjs()} // fixed current date
                  readOnly // makes the calendar non-editable
                  disableHighlightToday
                  showDaysOutsideCurrentMonth={true}
                  minDate={today}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '350px',
                    height: '500px',
                    overflow: 'hidden',
                    '.MuiDayCalendar-weekDayLabel': {
                      fontWeight: 'bold',
                      margin: '4px',
                    }
                  }}
                  slots={{
                    day: (props) => {
                      const { day, selectedDays, ...other } = props;
                      const isBeforeToday = day.isBefore(today, 'day');
                      const isHighlighted = staticOPD.includes(day.day()); // Highlight based on weekday index (0–6)
                      const isNotThisMonth = day.month() !== today.month();
                      return (
                        <PickersDay
                          {...other}
                          day={day}
                          selected={false}
                          disableMargin
                          sx={{
                            backgroundColor: isBeforeToday || isNotThisMonth ? '#eeeeee' : isHighlighted ? DoctorDetails : '#f8f8f8',
                            color: isHighlighted ? 'white' : '#c2c2c2',
                            // backgroundColor: isHighlighted ? DoctorDetails : '#f0f0f0',
                            fontWeight: 'bold',
                            cursor: 'default',
                            margin: '4px',
                            minWidth: '36px',
                            minHeight: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            '&:hover': {
                              backgroundColor: isHighlighted ? DoctorDetails : '#f0f0f0',
                            },
                          }}
                        />
                      );
                    },
                  }}
                />
              </LocalizationProvider>
            </Box>
          )}
        </Grid>
      </Grid>
      {/* <Box display='felx' width='90%' marginTop={5}>
        <Typography fontWeight='bold' paddingX={1} >About {doctorDetails.name}</Typography>
      </Box> */}
      <Grid container display='none' width='90%' paddingY={1} paddingX={1}>
        <Grid item md={2} xs={12} display='flex' padding={1}>
          <Typography fontWeight='bold' fontSize='14px' color="gray">Achievements:
            <Typography fontSize='14px' color="gray">{doctorDetails.achievements}</Typography>
          </Typography>

        </Grid>
        <Grid item md={2} xs={12} display='flex' padding={1} sx={{ borderTop: { xs: '1px lightgray solid', md: 'none' }, borderBottom: { xs: '1px lightgray solid', md: 'none' }, borderLeft: { xs: 'none', md: '1px lightgray solid' }, borderRight: { xs: 'none', md: '1px lightgray solid' } }}>
          <Typography fontWeight='bold' fontSize='14px' color="gray">Awards:
            <Typography fontSize='14px' color="gray">{doctorDetails.awards}</Typography>
          </Typography>
        </Grid>
        <Grid item md={2} xs={12} display='flex' padding={1}>
          <Typography fontWeight='bold' fontSize='14px' color="gray">Speciality:
            <Typography fontSize='14px' color="gray">{doctorDetails.specializations}</Typography>
          </Typography>
        </Grid>
      </Grid>
      {/* <Grid container display='flex' width='90%' marginTop={1} marginBottom={5}>
        <Grid item md={6} xs={12}>
          <Typography textAlign='justify' color="gray">
            {doctorDetails.profile_details}
          </Typography>
        </Grid>
      </Grid> */}
    </Box>
  );
};

export default Overview;
