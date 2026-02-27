"use client";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { selectFacilities } from "@/redux/features/facilitiesSlice";
import Loader from "../Loader";
import { useEffect } from "react";
import { useMediaQuery } from '@mui/material';
import ReadMoreText from "./ReadMoreText";
import { selectNewses } from "@/redux/features/newsSlice";
import ImageSlider from "../ImageSlider";
import ScrollReveal from "../Animation/ScrollReveal";

function formatDateToReadable(dateStr) {
  const date = new Date(dateStr);

  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  // Helper to get ordinal suffix (st, nd, rd, th)
  const getOrdinal = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  };

  const dayWithSuffix = day.toString().padStart(2, '0') + getOrdinal(day);
  return `${dayWithSuffix} ${month} ${year}`;
}


const Facilities = ({ expand, FID }) => {
  const facilities = useSelector(selectFacilities);
  const News = useSelector(selectNewses);
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

  if (News.length === 0) {
    return <Loader />;
  }

  return (
    <Box paddingY={2} marginX={2} display='flex' width='100%' flexDirection='column'>
      {News.map((news, index) => (<ScrollReveal animation="grow" timeout={1000}>
        <Box
          key={news.id}
          id={news.id}
          marginBottom={2}
          display="flex"
          flexDirection="column"
          width="100%"
          className="facility-box"
          sx={{
            height: {
              borderRadius: "15px",
              cursor: "pointer",
            },
          }}

        >
          {index === 0 ? <></> :
            <Box style={{ display: 'flex', justifyContent: 'center' }} marginY={3}>
              <hr style={{ border: "1px solid lightgray", display: 'flex', width: '95%' }} />
            </Box>}
          <Box
            sx={{ fontSize: { xs: "14px", md: "16px" } }}
            textAlign="justify"
          >
            <Box
              sx={{
                width: { sm: '100%', md: "40%" },
                height: "280px",
                float: { sm: "none", md: 'left' },
                top: "0",
                marginLeft: { sm: 0, md: "10px" },
                paddingX: { xs: 1, md: 2 },
                position: 'relative'
              }}
            // border='1px black solid'
            >
              <ImageSlider id={news.id} Images={news.photos} />
            </Box>
            <Box sx={{ marginX: 2, marginY: 1 }}>
              <Typography
                variant="h5"
                id={`facility-title-${news.id}`}
                sx={{
                  fontSize: { xs: "18px", md: "24px" },
                  fontWeight: "bold",
                }}
              >
                {news.name}
              </Typography>
              <Typography variant="subtitle1" marginY={1} color="gray" fontSize={18}>{formatDateToReadable(news.date)}</Typography>
              {FID === news.id ? <><Box display='none'></Box><ReadMoreText ShortText={news.details} LongText={news.details} Expand={true} ReadMoreOption={false} showReadmore={false} scrollBack={`facility-title-${news.id}`} /></> : <><ReadMoreText ShortText={news.details} LongText={news.details} Expand={false} ReadMoreOption={false} showReadmore={false} scrollBack={`facility-title-${news.id}`} /></>}
            </Box>
          </Box>
        </Box>
        </ScrollReveal>
      ))}
    </Box>
  );
};

export default Facilities;
