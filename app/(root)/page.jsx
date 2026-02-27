'use client'
import { Box, Typography } from "@mui/material";
import { Suspense, lazy, useEffect, useState } from "react";
import Loader from "../(components)/Loader";
import { FetchUpdates, UpdatesAccess, VideosAccess } from "@/lib/fetchData";
import DoctorSlider from '../(components)/DoctorCard/DoctorSlider';
import ScrollReveal from "../(components)/Animation/ScrollReveal";
import KioskHome from './kioskHome/page';
import { Element } from 'react-scroll';
import { selectHospitalDetails } from "@/redux/features/hospitalDetailSlice";

const ImageSliderMain = lazy(() => import("../(components)/HomeImageSlider/ImageSliderMain"));
// const DoctorSlider = lazy(() => import("../(components)/DoctorCard/DoctorSlider"));
const Facilities = lazy(() => import("../(components)/Facilities/FacilityData"));
const AccomplishmentsMain = lazy(() => import("../(components)/Accomplishments/AccomplichmentsMain"));
const WhatsHappening = lazy(() => import("../(components)/WhatsHappening"));
const OurHospitals = lazy(() => import("../(components)/Hospitals/OurHospitalsPage"));
const VideoGrid = lazy(() => import("../(components)/Videos/VideoGrid"));
const Partners = lazy(() => import("../(components)/Partners/Partners"));
import TextCarousel from "../(components)/TextCarousel";
import ScrollNav from "../(components)/ScrollNav";
import { useSelector } from "react-redux";
import { LatestVideos2 } from "../../lib/fetchData";
import SearchDoctors from "../(components)/DoctorCard/SearchDoctors";
import { selectDoctors } from "@/redux/features/doctorSlice";

const customVideo = [{id: 1, hospitalId: "1", addedBy: 1, name: "TATA Trust Asymptomatic", indexx: 1, link: null, name:"TATA Trust Asymptomatic", photo:"thumbnails/uGIqOddCYsqD433RG0IQaxdnL2ZtFnX33IgnqSIJ.png", updated_at:"2025-05-21 07:16:44", video:"TATA Trust Asymptomatic (Sub) (2).mp4"}]

// ✅ Server Component
const Home = () => {
  // const homeContent = HomeContent;
  const doctors = useSelector(selectDoctors);
  const HospitalDetails = useSelector(selectHospitalDetails);

  const [LatestVideosData, setVideos] = useState([]);
  const [updates, setUpdates] = useState([]);

  const fetchVideos = async () => {
    // console.log("fetch videos")
    setVideos(await LatestVideos2())
  }

  const fetchUpdates = async () => {
    // console.log("fetch videos")
    setUpdates(await FetchUpdates())
  }
  useEffect(() => {
    fetchVideos();
    fetchUpdates();
  }, [])

  return (
    <>

      {updates.length > 0 ? <TextCarousel updates={updates} /> : <></>}
      {/* <ScrollNav /> */}
      <Box sx={{backgroundColor:'#230239',
            backgroundSize: "cover", // or 'contain' depending on your needs
            backgroundPosition: "center", display:'flex', width:'100vw', height:'100%', position:'absolute'}}></Box>
      <KioskHome/>
      <Box
        display="flex"
        flexDirection="column"
        width="100%"
        boxShadow="5px 5px 15px rgba(0, 0, 0, 0.3)"
        marginBottom={3}
        sx={{ backgroundColor: '#f6f6f6', color: 'black' }}
        // fontFamily='fantasy'
      >
        
        {/* Intro */}
        {/* <Box display="flex" width="100%" sx={{ flexDirection: { xs: "column", md: "row" } }}>
          <Suspense fallback={<Loader />}>
            <ImageSliderMain />
          </Suspense>
          <Box paddingX={2} sx={{ width: { xs: "100%", md: "40%" } }}>
            <Box position='relative' marginY={2} sx={{display:{md:'none', lg:'none', sm:'flex', xs:'flex'}}}>
              <SearchDoctors doctors={doctors} />
            </Box>
            {HospitalDetails ? (
              <>
                <Typography variant="h6">{HospitalDetails.intro_heading}</Typography>
                <Typography textAlign="justify" fontSize={14}>{HospitalDetails.intro}</Typography>
              </>
            ) : (
              <Loader />
            )}
          </Box>
        </Box> */}

        {/* Consultants Section */}
        {/* <Element name="Doctors">
          <Box marginX={1} display="flex" flexDirection='column'>
            <Suspense fallback={<Loader />}>
              <DoctorSlider />
            </Suspense>
          </Box>
        </Element> */}

        {/* <Element name="Accomp">
          <Box marginY={5} textAlign="center" display="flex" justifyContent='center' flexDirection='column' >
            <Typography fontWeight="bolder" variant="h5" zIndex={2}>
              Our Accomplishments
            </Typography>
            <Box zIndex={2}>
              <Suspense fallback={<Loader />}>
                <AccomplishmentsMain />
              </Suspense>
            </Box>
          </Box>
        </Element> */}
        {/* Facilities */}
        {/* <Element name="Facilities">
          <Box display='flex' width='100%' justifyContent='center' marginTop={5}>
            <Box display='flex' width='90%' flexDirection='column'>
              <Typography variant="h5" fontWeight="bold" marginY={2}>
                Facilities
              </Typography>
              <Suspense fallback={<Loader />}>
                <Facilities />
              </Suspense>
            </Box>
          </Box>
        </Element> */}

        {/* <Element name="Partners">
          <Box display='flex' width='100%' justifyContent='center' marginTop={5}>
            <Box display='flex' width='90%' flexDirection='column' marginTop={2}>
              <ScrollReveal animation="grow" sx={{ display: 'inline-block' }}>
                <Typography variant="h5" fontWeight="bold" marginBottom={3} sx={{ display: 'inline-block' }}>
                  Our Partners
                </Typography>
              </ScrollReveal>
              <Suspense>
                <Partners />
              </Suspense>

            </Box>
          </Box>
        </Element> */}
        {/* What's Happening */}
        {/* <Element name="Featured">
          <Suspense fallback={<Loader />}>
            <WhatsHappening />
          </Suspense>
        </Element> */}

        <Element name="Stories">
          {LatestVideosData.length > 0 ? <Box display='flex' width='100%' justifyContent='center' marginTop={5}>
            <Box display='flex' width='90%' flexDirection='column' marginTop={2}>
              <Typography variant="h5" fontWeight="bold" marginBottom={3}>
                Our Stories
              </Typography>
              <Suspense>
                <VideoGrid LatestVideosData={customVideo} />
              </Suspense>
            </Box>
          </Box> : <></>}
        </Element>


        {/* Our Hospitals */}
        {/* <Element name="Network">
          <Box display='flex' width='100%' justifyContent='center' marginTop={5}>
            <Box display='flex' width='90%' flexDirection='column'>
              <Typography variant="h5" fontWeight="bold" marginBottom={3}>
                ACCF Network
              </Typography>
              <Suspense fallback={<Loader />}>
                <OurHospitals />
              </Suspense>
            </Box>
          </Box>
        </Element> */}
      </Box>
    </>
  );
}
export default Home;