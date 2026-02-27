'use client'
import ImageSlider from "@/app/(components)/ImageSlider";
import Loader from "@/app/(components)/Loader";
import { selectNewsAvailability, selectNewsById } from "@/redux/features/newsSlice";
import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";

const Content = () => {
    const newsDetails = useSelector(selectNewsById());
    const newsAvailability = useSelector(selectNewsAvailability);
    if (!newsAvailability) return (<Loader />)
    return (<Box display="flex" flexDirection='column' width="100%" justifyContent="center">
        <Box padding={4} display="felx" width="100%">
            <Typography  variant="h4" fontWeight="bold">{newsDetails.content_heading}</Typography>
            <Typography  fontWeight="bold" marginY={1}>{newsDetails.news_event_date}</Typography>

            <Box display='flex' width='100%' justifyContent='center' marginBottom={5} paddingX={1}>
                <ImageSlider id={newsDetails.id} Images={newsDetails.newseventsimg}/>
            </Box>

            <Typography  textAlign='justify' marginBottom={3}>{newsDetails.content}</Typography>
        </Box>
    </Box>)
}
export default Content;