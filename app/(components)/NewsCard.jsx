'use client'
import { Card, CardContent, Typography, Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setID } from "@/redux/features/newsSlice";
import Image from "next/image";

const NewsCard = ({ id, image, title = "No Title", text = "No Description", date = "No Date" }) => {
  const dispatch = useDispatch();
  const truncateText = (str = "", limit) => (str.length > limit ? `${str.slice(0, limit)}...` : str);
  const router = useRouter();

  return (
    <Card
      sx={{
        height: 420,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        // m: 3,
        overflow: "hidden",
        position: "relative",
        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
        "&:hover": {
          transform: "scale(1.01)",
          boxShadow: 3,
        },
        cursor:'pointer'
      }}
    >
      {/* <Link href="/newsAndEvents/details" passHref> */}
        <Box component="a" sx={{ height: "100%", textDecoration: "none", color: "inherit", position: "relative" }}>
          {/* Image Section */}
          <Box sx={{ position: "relative", height: 200 }}>
            <Image
              src={image}
              alt="img"
              fill
              priority={false}
              style={{ borderRadius: "4px", objectFit:"cover" }}
              sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Date Overlay */}
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                background: "rgba(0, 0, 0, 0.5)",
                color: "white",
                textAlign: "center",
                py: 1,
              }}
            >
              <Typography  variant="subtitle1">{date}</Typography>
            </Box>
          </Box>

          {/* Card Content */}
          <CardContent sx={{ pb: 6 }}>
            <Typography  variant="h6">{truncateText(title, 47)}</Typography>
            <Typography  variant="body2" sx={{ color: "text.secondary" }}>
              {truncateText(text, 151)}
            </Typography>
          </CardContent>


        </Box>
      {/* </Link> */}
      {/* Read More Button (Bottom Left) */}
      <Button
        variant="contained"
        color="success"
        size="small"
        sx={{
          position: "absolute",
          bottom: 8,
          left: 16,
          textTransform: "none",
          fontWeight: 500,
          // padding: 0,
          minWidth: "auto",
        }}
        onClick={() => {dispatch(setID(id));router.push(`/news/details`)}}
      >
        Read More
      </Button>
    </Card>
  );
};

export default NewsCard;
