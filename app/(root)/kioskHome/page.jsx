"use client";

import { Box, Button, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FeedbackModal from "../feedback/feedbackClient"; // Adjust the path as needed

const KioskHome = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    let idleTimeout;

    const startIdleTimer = () => {
      clearTimeout(idleTimeout);
      idleTimeout = setTimeout(() => {
        router.push("/kioskHome/opd");
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
    <>
      <Box
        display="flex"
        height="70vh"
        paddingX={5}
        marginY={2}
        marginBottom="200px"
        // border="1px black solid"
      >
        <Grid
          container
          alignItems="start"
          justifyContent="start"
          sx={{
            backgroundImage: "url(/fg.jpg)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Grid item xs={12} sm={6} md={2.4} height="300px" padding={3}>
            <Button
              onClick={() => router.push("/kioskHome/opd")}
              sx={{
                width: "100%",
                boxShadow: 5,
                backgroundColor: "purple",
                borderRadius: 5,
                height: "30vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography color="white" variant="h4" fontWeight="bold">
                OPD Doctors
              </Typography>
            </Button>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4} height="300px" padding={3}>
            <Button
              onClick={() => router.push("/kioskHome/doctorsDirectory")}
              sx={{
                width: "100%",
                boxShadow: 5,
                backgroundColor: "purple",
                borderRadius: 5,
                height: "30vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography color="white" variant="h4" fontWeight="bold">
                Doctor's Directory
              </Typography>
            </Button>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4} height="300px" padding={3}>
            <Button
              onClick={() => router.push("/kioskHome/doctorslider")}
              sx={{
                width: "100%",
                boxShadow: 5,
                backgroundColor: "purple",
                borderRadius: 5,
                height: "30vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography color="white" variant="h4" fontWeight="bold">
                Our Doctors
              </Typography>
            </Button>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4} height="300px" padding={3}>
            <Button
              onClick={() => router.push("/kioskHome/ourPartners")}
              sx={{
                width: "100%",
                boxShadow: 5,
                backgroundColor: "purple",
                borderRadius: 5,
                height: "30vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography color="white" variant="h4" fontWeight="bold">
                Corporate Empanelment
              </Typography>
            </Button>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4} height="300px" padding={3}>
            <Button
              onClick={() =>
                router.push(
                  "https://accfapp.in/feedback_form_kiosk?form_type=IPD&&code=1"
                )
              }
              sx={{
                width: "100%",
                boxShadow: 5,
                backgroundColor: "purple",
                borderRadius: 5,
                height: "30vh",
                flexDirection: "column",
                display: "flex",
                alignItems: "center",
                position: "relative",
                justifyContent: "center",
              }}
            >
              <Typography
                color="white"
                variant="h5"
                fontSize="30px"
                fontWeight="bold"
              >
                Feedback/ Suggestion
              </Typography>
            </Button>
          </Grid>
        </Grid>

        <FeedbackModal open={open} handleClose={handleClose} />
      </Box>
    </>
  );
};

export default KioskHome;
