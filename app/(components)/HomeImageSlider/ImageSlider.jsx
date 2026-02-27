"use client";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { memo } from "react";
import Loader from "../Loader";
import Image from "next/image";

const ImageSlider = ({ Images = [] }) => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Box
      sx={{
        display: "flex",
        width: { xs: "100%", md: "60%" },
        overflow: "hidden",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        position: "relative",
        "& .swiper-button-prev, & .swiper-button-next": {
          color: "#fff",
          zIndex: 10,
          display: isMdUp ? "block" : "none", // Hide nav buttons on small screens
        },
        // border:'1px black solid',
        "& .swiper-pagination": {
          bottom: "20px", // or adjust to '20px', '30px', etc. as needed
        },
        "& .swiper-pagination-bullet": {
          backgroundColor: "#fff", // Change this to your desired color
          opacity: 0.7,            // Optional: tweak for style
          borderRadius: 0,
          width: '19px',
          height: '5px'
        },
        "& .swiper-pagination-bullet-active": {
          backgroundColor: "#1976d2", // Active bullet color (e.g., MUI primary)
          opacity: 1,                 // Make it fully visible
        },
        height: '100%'
      }}
    >
      {Images.length > 0 ? (
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          effect="fade"
          // autoHeight={true}
          spaceBetween={10}
          slidesPerView={1}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          speed={1000}
          pagination={{ clickable: true }}
          navigation={isMdUp}
        >

          {Images.map((image, index) => (
            <SwiperSlide key={index}>
              <Image
                src={`https://accf-api.cancercareinstituteguwahati.org/storage/${image.photo}`}
                alt="img"
                width={600}
                height={300}
                style={{
                  width: "100%",
                  // height: "auto",
                  objectFit: "cover",
                  transition: "transform 1.5s ease-in-out",
                }}
                sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </SwiperSlide>
          ))}
        </Swiper>) : (
        <Box display='flex' width='100%' height={400} justifyContent='center' alignItems='center'>
          <Loader />
        </Box>
      )}
    </Box>
  );
};

export default memo(ImageSlider);