import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FlightTakeoff as FlightIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';

function Home() {
  const tripDates = {
    start: '12 сентября 2024',
    end: '29 сентября 2024',
    duration: '18 дней'
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      {/* Welcome Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h1" sx={{ mb: 2, color: 'primary.main' }}>
          Добро пожаловать, мамочка! 💕
        </Typography>
        <Typography variant="h5" sx={{ color: 'text.secondary', mb: 3 }}>
          Мы так рады, что ты приехала к нам в гости!
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Chip 
            icon={<CalendarIcon />} 
            label={`${tripDates.start} - ${tripDates.end}`}
            color="primary" 
            size="large"
          />
          <Chip 
            icon={<FlightIcon />} 
            label={tripDates.duration}
            color="secondary" 
            size="large"
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Video Message Section */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <FavoriteIcon />
                </Avatar>
                <Typography variant="h4" sx={{ color: 'primary.main' }}>
                  Видео-сообщение для мамы
                </Typography>
              </Box>
              
              <Paper 
                sx={{ 
                  height: 300, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundColor: 'grey.100',
                  border: '2px dashed',
                  borderColor: 'primary.light',
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    borderColor: 'primary.main',
                  }
                }}
              >
                <Box sx={{ textAlign: 'center', p: 3 }}>
                  <Typography variant="h6" sx={{ color: 'primary.main', mb: 2 }}>
                    📹 Место для видео-сообщения
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Здесь будет специальное видео-сообщение для мамы
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                    Нажмите, чтобы загрузить видео
                  </Typography>
                </Box>
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Info */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ mb: 3, color: 'secondary.main' }}>
                Быстрая информация
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationIcon sx={{ color: 'secondary.main', mr: 1 }} />
                  <Typography variant="h6">Наш адрес:</Typography>
                </Box>
                <Typography variant="body1" sx={{ ml: 4, color: 'text.secondary' }}>
                  22 Edgewater Circle<br />
                  Berlin, CT
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'secondary.main' }}>
                  📱 Телефоны:
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Дочка:</strong> 510-417-6856
                </Typography>
                <Typography variant="body1">
                  <strong>Aspen:</strong> 413-205-7451
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 2, color: 'secondary.main' }}>
                  ❤️ Важное:
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                  Мы очень любим тебя и хотим, чтобы ты чувствовала себя как дома. 
                  Если что-то нужно - просто скажи!
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Welcome Message */}
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ mb: 3, color: 'primary.main' }}>
                Мы так долго ждали этого момента! 🌟
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.2rem', lineHeight: 1.8, color: 'text.secondary' }}>
                Этот сайт создан специально для твоего визита. Здесь ты найдешь всё необходимое: 
                наше расписание, информацию о жилье и машине, место для записей о путешествии, 
                список того, что мы хотим сделать вместе, и контактную информацию.
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.2rem', lineHeight: 1.8, color: 'text.secondary', mt: 2 }}>
                Мы приготовили много интересного и хотим показать тебе всё самое лучшее! 
                Добро пожаловать в наш дом, мамочка! 💕
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Home;
