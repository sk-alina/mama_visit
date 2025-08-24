import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Chip,
  Avatar,
  Button,
  Alert,
  LinearProgress,
  IconButton,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FlightTakeoff as FlightIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  VideoLibrary as VideoIcon,
  CameraAlt as CameraIcon,
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { useWelcomeVideo } from '../hooks/useFirestore';

function Home() {
  const fileInputRef = useRef(null);
  
  // Use Firestore hook for persistent video storage
  const { 
    data: welcomeVideos, 
    loading: videoLoading, 
    error: videoError,
    addDocument: addVideo,
    updateDocument: updateVideo,
    deleteDocument: deleteVideo
  } = useWelcomeVideo();
  
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  // Get the current welcome video (there should only be one)
  const welcomeVideo = welcomeVideos.length > 0 ? welcomeVideos[0] : null;

  const tripDates = {
    start: '12 сентября 2025',
    end: '29 сентября 2025',
    duration: '18 дней'
  };

  // Countdown timer effect
  useEffect(() => {
    const tripStartDate = new Date('2025-09-12T00:00:00');
    
    const updateCountdown = () => {
      const now = new Date();
      const timeDiff = tripStartDate.getTime() - now.getTime();
      
      if (timeDiff > 0) {
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        
        setCountdown({ days, hours, minutes, seconds });
      } else {
        // Trip has started or ended
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  // Video upload functions
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleVideoUpload(file);
    }
  };

  const handleVideoUpload = async (file) => {
    setUploadError('');
    setUploading(true);
    setUploadProgress(0);

    const maxSize = 100 * 1024 * 1024; // 100MB for welcome video
    const videoTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/webm', 'video/quicktime'];

    if (file.size > maxSize) {
      setUploadError(`Файл слишком большой. Максимальный размер: 100MB`);
      setUploading(false);
      return;
    }

    if (!videoTypes.includes(file.type)) {
      setUploadError(`Неподдерживаемый формат видео. Поддерживаются: MP4, MOV, AVI, WebM`);
      setUploading(false);
      return;
    }

    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const videoData = {
            name: file.name,
            type: file.type,
            size: file.size,
            url: e.target.result,
            uploadDate: new Date().toISOString(),
          };
          
          // If there's already a video, update it; otherwise, add new one
          if (welcomeVideo) {
            await updateVideo(welcomeVideo.id, videoData);
          } else {
            await addVideo(videoData);
          }
          
          setUploadProgress(100);
          setTimeout(() => {
            setUploading(false);
            setUploadProgress(0);
          }, 500);
        } catch (error) {
          console.error('Error saving video to Firebase:', error);
          setUploadError('Ошибка при сохранении видео');
          setUploading(false);
          setUploadProgress(0);
        }
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      setUploadError('Ошибка при загрузке видео');
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removeVideo = async () => {
    if (welcomeVideo) {
      try {
        await deleteVideo(welcomeVideo.id);
        setUploadError('');
      } catch (error) {
        console.error('Error deleting video:', error);
        setUploadError('Ошибка при удалении видео');
      }
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
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
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mb: 3 }}>
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

        {/* Countdown Timer */}
        {countdown.days > 0 || countdown.hours > 0 || countdown.minutes > 0 || countdown.seconds > 0 ? (
          <Card sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <TimeIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h6" sx={{ color: 'primary.main' }}>
                  До начала поездки осталось:
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: 'secondary.main', fontWeight: 'bold' }}>
                    {countdown.days}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    дней
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: 'text.secondary', mx: 1 }}>:</Typography>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: 'secondary.main', fontWeight: 'bold' }}>
                    {countdown.hours.toString().padStart(2, '0')}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    часов
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: 'text.secondary', mx: 1 }}>:</Typography>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: 'secondary.main', fontWeight: 'bold' }}>
                    {countdown.minutes.toString().padStart(2, '0')}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    минут
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: 'text.secondary', mx: 1 }}>:</Typography>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: 'secondary.main', fontWeight: 'bold' }}>
                    {countdown.seconds.toString().padStart(2, '0')}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    секунд
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ) : (
          <Card sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="h5" sx={{ color: 'primary.main', mb: 1 }}>
                🎉 Поездка началась! 🎉
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Наслаждайтесь временем вместе!
              </Typography>
            </CardContent>
          </Card>
        )}
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
              
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="video/*"
                style={{ display: 'none' }}
                capture="environment" // Mobile camera
              />

              {/* Upload Progress */}
              {uploading && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Загрузка видео... {Math.round(uploadProgress)}%
                  </Typography>
                  <LinearProgress variant="determinate" value={uploadProgress} />
                </Box>
              )}

              {/* Upload Error */}
              {(uploadError || videoError) && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {uploadError || videoError}
                </Alert>
              )}

              {/* Loading State */}
              {videoLoading && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Загрузка данных...
                  </Typography>
                  <LinearProgress />
                </Box>
              )}

              {/* Video Display or Upload Area */}
              {welcomeVideo ? (
                <Box sx={{ position: 'relative' }}>
                  <Paper 
                    sx={{ 
                      height: 300, 
                      backgroundColor: 'black',
                      borderRadius: 2,
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <video
                      src={welcomeVideo.url}
                      controls
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  </Paper>
                  
                  {/* Video Info and Controls */}
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {welcomeVideo.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Размер: {(welcomeVideo.size / (1024 * 1024)).toFixed(1)} MB
                      </Typography>
                    </Box>
                    <IconButton 
                      onClick={removeVideo} 
                      color="error"
                      sx={{ ml: 2 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              ) : (
                <Paper 
                  onClick={openFileDialog}
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
                    <VideoIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" sx={{ color: 'primary.main', mb: 2 }}>
                      📹 Место для видео-сообщения
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                      Здесь будет специальное видео-сообщение для мамы
                    </Typography>
                    
                    {/* Upload Buttons */}
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                      <Button
                        variant="contained"
                        startIcon={<CameraIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          openFileDialog();
                        }}
                        size="small"
                      >
                        Камера
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<UploadIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          openFileDialog();
                        }}
                        size="small"
                      >
                        Загрузить
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              )}
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
                  <strong>Дочка кукунечка:</strong> 510-417-6856
                </Typography>
                <Typography variant="body1">
                  <strong>Аспен:</strong> 413-205-7451
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
