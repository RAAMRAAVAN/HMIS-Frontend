"use client";
import { Box, Button, Grid, Typography } from "@mui/material";
import { color } from "../Global";
import { useSelector } from "react-redux";
import { selectFacilities } from "@/redux/features/facilitiesSlice";
import Loader from "../Loader";
import { useEffect, useState, useRef } from "react";
import { useMediaQuery } from '@mui/material';
import ReadMoreText from "./ReadMoreText";
import Image from "next/image";
import ScrollReveal from "../Animation/ScrollReveal";

const Facilities = ({ expand, FID }) => {
  const facilities = useSelector(selectFacilities);
  // console.log("expand=", expand);
  const isMd = useMediaQuery('(min-width: 768px)');
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.substring(1);
      if (hash) {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    }
  }, []);

  if (facilities.length === 0) {
    return <Loader />;
  }

  return (
    <Box paddingY={2} marginX={1}>
      {facilities.map((facility, index) => (<ScrollReveal animation="grow" timeout={1000}>
        <Box
          key={facility.id}
          id={facility.id}
          marginBottom={2}
          display="flex"
          flexDirection="column"
          width="100%"
          className="facility-box"
          boxShadow={5}
          borderRadius={3}
          sx={{
            height: {
              background: "linear-gradient(to right, #ded5d9, #e1e5ea)",
              borderRadius: "15px",
              cursor: "pointer",
            },
          }}

        >
          <Grid
            container
            width="100%"
            borderRadius={2}
            padding={0}
            display="flex"
            sx={{
              overflow: "hidden",
              flexDirection: { md: index % 2 === 0 ? "row-reverse" : "row" },
            }}
          >
            <Grid
              item
              xs={12}
              md={12}
              sx={{
                borderRadius: {
                  xs: "0px 0px 10px 10px",
                  lg: "10px 0px 0px 10px",
                },
                display: "flex",
                flexDirection: "column",
                // padding: 3,
                backgroundColor: "transparent",
              }}
            >
              <Typography
                variant="h5"
                id={`facility-title-${facility.id}`}
                sx={{
                  fontSize: { xs: "18px", md: "24px" },
                  fontWeight: "bold",
                  padding: { xs: 2, md: 3 }
                }}
              >
                {facility.name}
              </Typography>
              <Box
                display="flex"
                width="100%"
                height="20px"
                alignItems="center"
                marginBottom={1}
                sx={{ marginLeft: { xs: 2, md: 3 } }}
              >
                <Box
                  display="flex"
                  className="facility-progress"

                  sx={{ width: { md: '5%', xs: "20%" } }}
                  height="10px"
                  backgroundColor={color}
                  borderRadius={20}
                ></Box>
              </Box>

              <Box
                sx={{ fontSize: { xs: "14px", md: "16px" } }}
                textAlign="justify"
              >
                <Box
                  sx={{
                    width: { sm: '100%', md: "40%" },
                    height: "300px",
                    float: { sm: "none", md: 'right' },
                    top: "0",
                    marginLeft: { sm: 0, md: "10px" },
                    padding: { sm: 0, md: 3 }
                  }}

                >
                  <Image
                    src={`https://accf-api.cancercareinstituteguwahati.org/storage/${facility.photo}`}
                    alt="img"
                    className={isMd ? "facility-image" : ""}
                    width={400}
                    height={300}
                    priority
                    sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  />
                </Box>
                <Box sx={{ marginX: { xs: 0, md: 2 } }}>
                  {FID === facility.id ? <><Box display='none'></Box><ReadMoreText ShortText={facility.long_description} LongText={facility.description} Expand={true} ReadMoreOption={facility.read_more2} showReadmore={facility.read_more2} scrollBack={`facility-title-${facility._id}`} /></> : <><ReadMoreText ShortText={facility.long_description} LongText={facility.description} Expand={false} ReadMoreOption={facility.read_more2} showReadmore={facility.read_more2} scrollBack={`facility-title-${facility.id}`} /></>}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </ScrollReveal>
      ))}
    </Box>
  );
};

export default Facilities;
