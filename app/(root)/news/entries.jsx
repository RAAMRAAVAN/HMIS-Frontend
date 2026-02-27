"use client";
import { Box, Grid } from "@mui/material";
import NewsCard from "../../(components)/NewsCard";
import { useSelector } from "react-redux";
import { selectNewses} from "@/redux/features/newsSlice";

const Entries = () => {
    const news = useSelector(selectNewses);
    return (
        <Box display="flex" flexDirection="column" alignItems="center" width='100%' margin="auto">
            <Grid container spacing={3} justifyContent="start" paddingX={1} display='flex' sx={{ width: { md: '85%', sm: '100%' } }}>
                {news.map((entry, index) => (
                    <Grid key={entry.id} item xs={12} sm={6} md={4} display="flex" justifyContent="center">
                        <NewsCard
                            id={entry.id}
                            title={entry.content_heading}
                            text={entry.content}
                            // image={`/${HoName}News/${entry.path || "news1.jpeg"}`}
                            image={`/News/${entry.id}/1.jpg`} 
                            date={entry.news_event_date}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Entries;
