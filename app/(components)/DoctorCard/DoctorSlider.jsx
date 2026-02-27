"use client";

import {
  Box,
  IconButton,
  Grid,
  useMediaQuery,
  Typography,
} from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import { useSwipeable } from "react-swipeable";
import NewDoctorCard from "../../(components)/NewDoctorCard";
import { color1 } from "../Global";
import { useDispatch, useSelector } from "react-redux";
import {
  selectDoctors,
  selectPage,
  setPage,
} from "@/redux/features/doctorSlice";
import Loader from "../Loader";
import { AnimatePresence, motion } from "framer-motion";
import SearchDoctors from "./SearchDoctors";
import { useRouter } from "next/navigation";

const DoctorSlider = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const doctors = useSelector(selectDoctors);
  const page = useSelector(selectPage);
  const [direction, setDirection] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Responsive breakpoints
  const isXs = useMediaQuery("(max-width:600px)");
  const isSm = useMediaQuery("(min-width:601px) and (max-width:960px)");
  const isMd = useMediaQuery("(min-width:961px) and (max-width:1280px)");
  const isLg = useMediaQuery("(min-width:1281px)");

  const doctorsPerPage = isXs ? 1 : isSm ? 2 : isMd ? 2 : 4;

  // Filter doctors by search
  const filteredDoctors = useMemo(
    () =>
      doctors.filter((doctor) =>
        doctor.name?.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [doctors, searchQuery]
  );

  const totalDoctors = filteredDoctors.length;
  const totalPages = Math.max(1, Math.ceil(totalDoctors / doctorsPerPage));

  const startIdx = (page - 1) * doctorsPerPage;
  const displayedDoctors = filteredDoctors.slice(
    startIdx,
    startIdx + doctorsPerPage
  );

  // Navigation handlers
  const handleNext = () => {
    if (page < totalPages) {
      setDirection(1);
      dispatch(setPage(page + 1));
    }
    else{
        router.push("/kioskHome/ourPartners");
        dispatch(setPage(1))
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      setDirection(-1);
      dispatch(setPage(page - 1));
    }
  };

  // Swipe handlers
  const handlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  // Auto-slide after 10s idle
  useEffect(() => {
    let idleTimeout;

    const startIdleTimer = () => {
      clearTimeout(idleTimeout);
      idleTimeout = setTimeout(() => {
        handleNext();
      }, 10000);
    };

    const resetTimer = () => startIdleTimer();

    const events = ["mousemove", "mousedown", "keydown", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetTimer));

    startIdleTimer();

    return () => {
      clearTimeout(idleTimeout);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [page, totalPages]); // ✅ important

  return (
    <>
      {/* Header */}
      <Box display="flex" justifyContent="center" marginTop={5}>
        <Grid
          container
          sx={{ width: { lg: "90%", md: "90%", sm: "100%", xs: "90%" } }}
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid item lg={2} md={4} sm={4} xs={12}>
            <Typography
              variant="h4"
              fontWeight="bold"
              onClick={() => dispatch(setPage(1))}
              sx={{ cursor: "pointer" }}
            >
              Our Doctors
            </Typography>
          </Grid>
          <Grid item lg={6} md={6} sm={6} xs={12} sx={{ px: { xs: 0, sm: 2 } }}>
            <Box sx={{ display: { lg: "flex", md: "flex", sm: "none", xs: "none" } }}>
              <SearchDoctors doctors={doctors} />
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Slider */}
      <Box
        {...handlers}
        position="relative"
        display="flex"
        width="100%"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        my={5}
        sx={{ touchAction: "pan-y", minHeight: 430, overflowX: "hidden" }}
      >
        {filteredDoctors.length > 0 ? (
          <Box
            sx={{
              width: { lg: "90%", md: "90%", xs: "100%" },
              minHeight: 380,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            {/* Prev Button */}
            <IconButton
              onClick={handlePrev}
              disabled={page === 1}
              sx={{
                position: "absolute",
                left: 0,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                color: color1,
                "&:hover": { backgroundColor: "rgba(0,0,0,0.2)" },
                display: { xs: "none", sm: "flex" },
              }}
            >
              <ArrowBackIosNew sx={{ fontSize: "2.5rem" }} />
            </IconButton>

            {/* Animated Doctors */}
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, x: direction === 1 ? 100 : -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction === 1 ? -100 : 100 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                style={{ width: "100%", display: "flex", justifyContent: "center" }}
              >
                <Grid container spacing={5} justifyContent="center" sx={{ minHeight: 350 }}>
                  {displayedDoctors.map((doctor) => (
                    <Grid
                      key={doctor.id}
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={4}
                      xl={3}
                      display="flex"
                      justifyContent="center"
                      alignItems="stretch"
                    >
                      <NewDoctorCard
                        id={doctor.id}
                        image={doctor.photo}
                        name={doctor.name}
                        speciality={doctor.specialization}
                        designation={doctor.designation}
                        department={doctor.depertment}
                        qualifications={doctor.qualification}
                      />
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            </AnimatePresence>

            {/* Next Button */}
            <IconButton
              onClick={handleNext}
              disabled={page === totalPages}
              sx={{
                position: "absolute",
                right: 0,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                color: color1,
                "&:hover": { backgroundColor: "rgba(0,0,0,0.2)" },
                display: { xs: "none", sm: "flex" },
              }}
            >
              <ArrowForwardIos sx={{ fontSize: "2.5rem" }} />
            </IconButton>
          </Box>
        ) : (
          <Loader />
        )}
      </Box>
    </>
  );
};

export default DoctorSlider;
