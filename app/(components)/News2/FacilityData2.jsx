"use client";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { selectFacilities } from "@/redux/features/facilitiesSlice";
import Loader from "../Loader";
import { useEffect} from "react";
import { useMediaQuery } from '@mui/material';
import ReadMoreText from "./ReadMoreText";
import { selectNewses } from "@/redux/features/newsSlice";
import Image from "next/image";

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
      {News.map((news, index) => (
        <Box
          key={news.id}
          id={news._id}
          marginBottom={2}
          display="flex"
          flexDirection="column"
          width="100%"
          className="facility-box"
          sx={{
            height: {
              // background: "linear-gradient(to right, #ded5d9, #e1e5ea)",
              borderRadius: "15px",
              cursor: "pointer",
            },
          }}

        >
          <Grid
            container
            width="100%"
            // borderRadius={2}
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
              <Grid container
                sx={{ fontSize: { xs: "14px", md: "16px" } }}
                textAlign="justify"
                display='flex'
              >
                <Grid item xs={4} position="relative" width="1000px" height="300px">
                  <Image
                    src={`/News/${news.id}/1.jpg`}
                    alt="img"
                    priority
                    fill
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'center',
                      borderRadius: '10px'
                    }}
                  />
                </Grid >


                <Grid item xs={7} sx={{ marginX: { xs: 0, md: 2 } }} textAlign="justify">
                  <Typography
                    variant="h5"
                    id={`facility-title-${news.id}`}
                    sx={{
                      fontSize: { xs: "18px", md: "24px" },
                      fontWeight: "bold",
                      // padding: { xs: 2, md: 3 }
                    }}
                  >
                    {news.content_heading}
                  </Typography>
                  {FID === news.id ? <><Box display='none'></Box><ReadMoreText ShortText={news.content} LongText={news.content} Expand={true} ReadMoreOption={false} showReadmore={false} scrollBack={`facility-title-${news.id}`} /></> : <><ReadMoreText ShortText={news.content} LongText={news.content} Expand={false} ReadMoreOption={false} showReadmore={false} scrollBack={`facility-title-${news.id}`} /></>}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          
        </Box>
      ))}
    </Box>
  );
};

export default Facilities;
