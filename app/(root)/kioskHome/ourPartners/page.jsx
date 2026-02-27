"use client";
import { Box, Typography } from "@mui/material";
import ScrollReveal from "../../../(components)/Animation/ScrollReveal";
import { Suspense, useEffect } from "react";
import Partners from "../../../(components)/Partners/Partners";
import { useRouter } from "next/navigation";

const OurPartners = () => {
  const router = useRouter();
  useEffect(() => {
    let idleTimeout;

    const startIdleTimer = () => {
      clearTimeout(idleTimeout);
      idleTimeout = setTimeout(() => {
        router.push("/kioskHome");
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
        width="100%"
        justifyContent="center"
        marginTop={5}
        height="100vh"
      >
        <Box display="flex" width="90%" flexDirection="column" marginTop={2}>
          <ScrollReveal animation="grow" sx={{ display: "inline-block" }}>
            <Box display="flex" width="85vw" justifyContent="center">
              <Typography
                variant="h3"
                fontWeight="bold"
                marginBottom={3}
                sx={{ display: "inline-block", textAlign: "center" }}
              >
                Corporate Empanelment
              </Typography>
            </Box>
          </ScrollReveal>
          <Suspense>
            <Partners />
          </Suspense>
        </Box>
      </Box>
    </>
  );
};
export default OurPartners;
