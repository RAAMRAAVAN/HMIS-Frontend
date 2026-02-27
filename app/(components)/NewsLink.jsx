'use client';

import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';

import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
  CardActions,
} from '@mui/material';
import { East } from '@mui/icons-material';

import { selectNewses, setID } from '@/redux/features/newsSlice';
import { selectHospitalDetails } from '@/redux/features/hospitalDetailSlice';
import ScrollReveal from './Animation/ScrollReveal';

function convertToArray(str) {
  return str?.split(',')[0] || '';
}

export default function NewsLink() {
  const router = useRouter();
  const dispatch = useDispatch();
  const hospitalData = useSelector(selectHospitalDetails);
  const news = useSelector(selectNewses);

  const [clicked, setClicked] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  return (
    <Grid
      container
      spacing={5}
      justifyContent="flex-start"
      sx={{ width: { md: '100%', sm: '100%' } }}
    >
      {/* Static Card for News Overview */}
      <Grid item xs={12} sm={6} md={3} display="flex" justifyContent="center">
        <ScrollReveal animation="grow" timeout={1000} style={{height:'100%'}}>
          <Card
            className="news-card"
            sx={{
              backgroundColor: 'rgb(232, 237, 238)',
              display: 'flex',
              width: '100%',
              height:'384px',
              position: 'relative',
            }}
          >
            <CardActionArea
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                justifyContent: 'start',
              }}
            >
              <Box display="flex" width="100%">
                <CardMedia
                  component="img"
                  sx={{ height: '175px', width: '100%' }}
                  image="/news.jpg"
                  alt="News Thumbnail"
                />
              </Box>
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="div"
                  onClick={() => {
                    setClicked(true);
                    setSelectedCard(0);
                    router.push(`/news`);
                  }}
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    backgroundColor: clicked && selectedCard === 0 ? '#ffeb3b' : '',
                    textDecoration: clicked && selectedCard === 0 ? 'underline' : 'none',
                    cursor: 'pointer',
                  }}
                >
                  News and events
                </Typography>
                {/* <br/> */}
                {/* <br/> */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  Find the latest news about our work and achievements
                </Typography>
              </CardContent>
              <CardActions
                onClick={() => {
                  router.push(`/news`);
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  marginBottom: 2,
                  width: '100%',
                }}
              >
                <div className="news-arrow">
                  <East fontSize="large" />
                </div>
              </CardActions>
            </CardActionArea>
          </Card>
          </ScrollReveal>
      </Grid>

      {/* Dynamic News Cards */}
      {news.slice(0, 3).map((entry, index) => (
        <Grid key={entry.id || index} item xs={12} sm={6} md={3} display="flex" justifyContent="center">
          <ScrollReveal animation="grow" timeout={1000}>
            <Card
              className="news-card"
              sx={{
                backgroundColor: 'rgb(232, 237, 238)',
                display: 'flex',
                width: '100%',
                height:'384px',
                position: 'relative',
              }}
            >
              <CardActionArea
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  justifyContent: 'start',
                }}
              >
                <Box display="flex" width="100%">
                  {/* Uncomment if needed */}
                  {entry.photos ? <CardMedia
                    component="img"
                    sx={{ height: '175px', width: '100%' }}
                    image={`https://accf-api.cancercareinstituteguwahati.org/storage/${entry.photos[0].photo_path}`}
                    alt={entry.name}
                  /> : <></>}

                </Box>
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    onClick={() => {
                      setClicked(true);
                      setSelectedCard(entry.id);
                      dispatch(setID(entry.id));
                      router.push(`/news#${entry.id}`);
                    }}
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      backgroundColor: clicked && selectedCard === entry.id ? '#ffeb3b' : '',
                      textDecoration: clicked && selectedCard === entry.id ? 'underline' : 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {entry.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    dangerouslySetInnerHTML={{
                      __html: entry.details,
                    }}
                  />
                </CardContent>
                <CardActions
                  onClick={() => {
                    setClicked(true);
                    setSelectedCard(entry.id);
                    dispatch(setID(entry.id));
                    router.push(`/news#${entry.id}`);
                  }}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    marginBottom: 2,
                    width: '100%',
                  }}
                >
                  <div className="news-arrow">
                    <East fontSize="large" />
                  </div>
                </CardActions>
              </CardActionArea>
            </Card>
          </ScrollReveal>
        </Grid>
      ))}
    </Grid>
  );
}
