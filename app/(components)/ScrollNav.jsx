'use client';

import { Box, Link, Typography, useMediaQuery } from '@mui/material';
import { Link as ScrollLink, Element } from 'react-scroll';
import { color1, color4 } from './Global';
import { lazy, Suspense, useEffect, useRef, useState, useCallback } from 'react';
import Loader from './Loader';
import DoctorSlider from './DoctorCard/DoctorSlider';
import ScrollReveal from './Animation/ScrollReveal';
import Partners from './Partners/Partners';
import WhatsHappening from './WhatsHappening';
import VideoGrid from './Videos/VideoGrid';
import { LatestVideos2 } from '@/lib/fetchData';
import SearchDoctors from './DoctorCard/SearchDoctors';
import { selectDoctors } from '@/redux/features/doctorSlice';
import { selectHospitalDetails } from '@/redux/features/hospitalDetailSlice';
import { useSelector } from 'react-redux';

const AccomplishmentsMain = lazy(() => import("./Accomplishments/AccomplichmentsMain"));
const Facilities = lazy(() => import("./Facilities/FacilityData"));
const OurHospitals = lazy(() => import("./Hospitals/OurHospitalsPage"));
const ImageSliderMain = lazy(() => import("./HomeImageSlider/ImageSliderMain"));

const navItems = [
    { label: 'Introduction', to: 'Intro' },
    { label: 'Our Doctors', to: 'Doctors' },
    { label: 'Accomplishments', to: 'Accomp' },
    { label: 'Facilities', to: 'Facilitie' },
    { label: 'Partners', to: 'Partners' },
    { label: 'Featured Stories', to: 'Featured' },
    { label: 'Our Stories', to: 'Stories' },
    { label: 'ACCF Network', to: 'Network' },
];

const ScrollNav = () => {
    const [selected, setSelected] = useState(0);
    const [LatestVideosData, setVideos] = useState([]);
    const [fetchedSections, setFetchedSections] = useState({});
    const doctors = useSelector(selectDoctors);
    const HospitalDetails = useSelector(selectHospitalDetails);
    const sectionRefs = useRef({});
    const navRefs = useRef({});
    const isMobile = useMediaQuery('(max-width:900px)');

    // Fetch on-demand section data
    const fetchSectionData = useCallback(async (sectionId) => {
        if (fetchedSections[sectionId]) return;
        try {
            const res = await fetch(`/api/data/${sectionId}`);
            await res.json(); // Assuming this is used elsewhere
            setFetchedSections(prev => ({ ...prev, [sectionId]: true }));
        } catch (err) {
            console.error('Fetch error:', err);
        }
    }, [fetchedSections]);

    // Fetch videos only when user scrolls to "Stories"
    const fetchVideosIfNeeded = useCallback(() => {
        if (!LatestVideosData.length) {
            LatestVideos2().then(setVideos).catch(console.error);
        }
    }, [LatestVideosData]);

    useEffect(() => {
        fetchVideosIfNeeded();
    }, [])
    // Intersection observer setup
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    const sectionId = entry.target.getAttribute('data-section');
                    if (entry.isIntersecting && sectionId) {
                        const index = navItems.findIndex(item => item.to === sectionId);
                        setSelected(index);
                        if (!fetchedSections[sectionId]) {
                            fetchSectionData(sectionId);
                        }
                    }
                }
            },
            {
                threshold: 0.5,
                rootMargin: '0px 0px -20% 0px',
            }
        );

        const id = requestIdleCallback(() => {
            Object.values(sectionRefs.current).forEach((el) => {
                if (el) observer.observe(el);
            });
        });

        return () => {
            cancelIdleCallback(id);
            observer.disconnect();
        };
    }, [fetchSectionData, fetchedSections]);

    useEffect(() => {
        if (isMobile && navRefs.current[selected]) {
            navRefs.current[selected].scrollIntoView({
                behavior: 'smooth',
                inline: 'center',
                block: 'nearest'
            });
        }
    }, [selected, isMobile]);

    return (
        <>
            {/* Navigation Bar */}
            <Box sx={{
                width: "100%",
                overflowX: "hidden",
                position: "sticky",
                top: { sm: 56, xs: 56, md: 38 },
                zIndex: 4,
                backgroundColor: "white",
                boxShadow: 3
            }}>
                <Box sx={{
                    display: 'flex',
                    overflowX: 'auto',
                    whiteSpace: 'nowrap',
                    px: 4,
                    '&::-webkit-scrollbar': { display: 'none' },
                }}>
                    {navItems.map((item, index) => (
                        <Box key={item.to} display="flex" alignItems="center" sx={{ flexShrink: 0 }} ref={el => navRefs.current[index] = el}>
                            <ScrollLink to={item.to} smooth duration={500} offset={-80}>
                                <Link
                                    underline="none"
                                    sx={{
                                        fontSize: '12px',
                                        cursor: 'pointer',
                                        color: selected === index ? color1 : '#B0B0B0',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {item.label}
                                </Link>
                            </ScrollLink>
                            {index < navItems.length - 1 && (
                                <Typography sx={{
                                    mx: 1,
                                    fontSize: 30,
                                    color: selected === index ? color1 : '#B0B0B0',
                                }}>•</Typography>
                            )}
                        </Box>
                    ))}
                </Box>
            </Box>

            <Box
                display="flex"
                flexDirection="column"
                width="100%"
                boxShadow="5px 5px 15px rgba(0, 0, 0, 0.3)"
                marginBottom={3}
                sx={{ backgroundColor: '#f6f6f6', color: 'black' }}
            // fontFamily='fantasy'
            >
                {/* Sections */}
                <Element name="Intro">
                    <Box ref={el => sectionRefs.current['Intro'] = el} data-section="Intro"></Box>
                </Element>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, width: '100%' }}>
                    <Suspense fallback={<Loader />}><ImageSliderMain /></Suspense>
                    <Box px={2} sx={{ width: { xs: "100%", md: "40%" } }}>
                        <Box sx={{ display: { xs: 'flex', md: 'none' }, my: 2 }}>
                            <SearchDoctors doctors={doctors} />
                        </Box>
                        {HospitalDetails ? (
                            <>
                                <Typography variant="h6">{HospitalDetails.intro_heading}</Typography>
                                <Typography fontSize={14} textAlign="justify">{HospitalDetails.intro}</Typography>
                            </>
                        ) : <Loader />}
                    </Box>
                </Box>

                <Element name="Doctors">
                    <Box ref={el => sectionRefs.current['Doctors'] = el} data-section="Doctors" mx={1} display="flex" flexDirection="column">
                        <Suspense fallback={<Loader />}><DoctorSlider /></Suspense>
                    </Box>
                </Element>

                <Element name="Accomp">
                    <Box ref={el => sectionRefs.current['Accomp'] = el} data-section="Accomp" marginTop={5} display="flex" flexDirection="column" alignItems="center">
                        <Typography variant="h5" fontWeight="bolder">Our Accomplishments</Typography>
                    </Box>
                </Element>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Suspense fallback={<Loader />}><AccomplishmentsMain /></Suspense>
                </Box>

                <Element name="Facilitie">
                    <Box ref={el => sectionRefs.current['Facilitie'] = el} data-section="Facilitie" marginTop={5} display="flex" flexDirection="column" alignItems="center">
                        <Box width="90%">
                            <Typography variant="h5" fontWeight="bold" my={2}>Facilities</Typography>
                        </Box>
                    </Box>
                </Element>
                <Box marginBottom={5} display="flex" flexDirection="column" alignItems="center">
                    <Box width="90%">
                        <Facilities />
                    </Box>
                </Box>

                <Element name="Partners">
                    <Box mt={5} display="flex" justifyContent="center" ref={el => sectionRefs.current['Partners'] = el} data-section="Partners">
                        <Box width="90%">
                            <ScrollReveal animation="grow">
                                <Typography variant="h5" fontWeight="bold" mb={3} >Our Partners</Typography>
                            </ScrollReveal>
                        </Box>
                    </Box>
                </Element>
                <Box display="flex" justifyContent="center">
                    <Box width="90%">
                        <Suspense fallback={<Loader />}><Partners /></Suspense>
                    </Box>
                </Box>

                <Element name="Featured">
                    <Box ref={el => sectionRefs.current['Featured'] = el} data-section="Featured">

                    </Box>
                </Element>
                <Suspense fallback={<Loader />}><WhatsHappening /></Suspense>

                <Element name="Stories">
                    <Box ref={el => sectionRefs.current['Stories'] = el} data-section="Stories">
                        {LatestVideosData.length > 0 && (
                            <Box mt={5} display="flex" justifyContent="center">
                                <Box width="90%">
                                    <Typography variant="h5" fontWeight="bold" mb={3}>Our Stories</Typography>

                                </Box>
                            </Box>
                        )}
                    </Box>
                </Element>
                <Box display="flex" justifyContent="center">
                    <Box width="90%">
                        <Suspense fallback={<Loader />}><VideoGrid LatestVideosData={LatestVideosData} /></Suspense>
                    </Box>
                </Box>

                <Element name="Network">
                    <Box ref={el => sectionRefs.current['Network'] = el} data-section="Network" mt={5} display="flex" justifyContent="center">
                        <Box width="90%">
                            <Typography variant="h5" fontWeight="bold" mb={3}>ACCF Network</Typography>

                        </Box>
                    </Box>
                </Element>
                <Box display="flex" justifyContent="center">
                    <Box width="90%">
                        <Suspense fallback={<Loader />}><OurHospitals /></Suspense>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default ScrollNav;
