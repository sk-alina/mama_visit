import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Grid,
  Paper,
  Avatar,
  Chip,
  Fab,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Alert,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Book as BookIcon,
  Photo as PhotoIcon,
  Favorite as FavoriteIcon,
  Place as PlaceIcon,
  VideoLibrary as VideoIcon,
  CameraAlt as CameraIcon,
  CloudUpload as UploadIcon,
  Close as CloseIcon,
  PlayArrow as PlayIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useDiaryEntries } from '../hooks/useFirestore';

function Diary() {
  const fileInputRef = useRef(null);
  
  // Use Firestore hook for persistent data
  const { 
    data: entries, 
    loading: entriesLoading, 
    error: entriesError,
    addDocument: addEntry,
    updateDocument: updateEntry,
    deleteDocument: deleteEntry
  } = useDiaryEntries();

  const [open, setOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [formData, setFormData] = useState({
    date: dayjs(),
    title: '',
    location: '',
    content: '',
    mood: '',
    photos: [],
    videos: [],
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [saving, setSaving] = useState(false);

  // Initialize with sample data if database is empty
  useEffect(() => {
    if (!entriesLoading && entries.length === 0) {
      const sampleEntry = {
        date: '2025-09-12',
        title: 'Первый день в Америке! (Пробнвый пост)',
        location: 'Berlin, CT',
        content: 'Наконец-то я здесь! Полёт был долгим, но дочка встретила меня в аэропорту. Дом очень уютный и красивый',
        mood: 'Счастливая',
        photos: [],
        videos: [],
        favorite: true,
      };
      addEntry(sampleEntry).catch(console.error);
    }
  }, [entriesLoading, entries.length, addEntry]);

  const moods = [
    'Счастливая', 'Восхищённая', 'Благодарная', 'Взволнованная', 
    'Спокойная', 'Вдохновлённая', 'Удивлённая', 'Радостная'
  ];

  const handleAdd = () => {
    setEditingEntry(null);
    setFormData({
      date: dayjs(),
      title: '',
      location: '',
      content: '',
      mood: '',
      photos: [],
      videos: [],
    });
    setUploadError('');
    setOpen(true);
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setFormData({
      date: dayjs(entry.date),
      title: entry.title,
      location: entry.location,
      content: entry.content,
      mood: entry.mood,
      photos: entry.photos || [],
      videos: entry.videos || [],
    });
    setUploadError('');
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingEntry) {
        // Update existing entry
        await updateEntry(editingEntry.id, {
          ...formData,
          date: formData.date.format('YYYY-MM-DD'),
        });
      } else {
        // Add new entry
        await addEntry({
          ...formData,
          date: formData.date.format('YYYY-MM-DD'),
          favorite: false,
        });
      }
      setOpen(false);
    } catch (error) {
      console.error('Error saving entry:', error);
      setUploadError('Ошибка при сохранении записи');
    } finally {
      setSaving(false);
    }
  };

  // File upload functions
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    handleFiles(files);
  };

  const handleFiles = async (files) => {
    setUploadError('');
    setUploading(true);
    setUploadProgress(0);

    const validFiles = [];
    const maxSize = 50 * 1024 * 1024; // 50MB
    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const videoTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/webm', 'video/quicktime'];

    for (const file of files) {
      if (file.size > maxSize) {
        setUploadError(`Файл "${file.name}" слишком большой. Максимальный размер: 50MB`);
        continue;
      }

      if (![...imageTypes, ...videoTypes].includes(file.type)) {
        setUploadError(`Неподдерживаемый формат файла: ${file.name}`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) {
      setUploading(false);
      return;
    }

    try {
      const processedFiles = await Promise.all(
        validFiles.map(async (file, index) => {
          // Simulate upload progress
          setUploadProgress(((index + 1) / validFiles.length) * 100);

          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const fileData = {
                id: Date.now() + index,
                name: file.name,
                type: file.type,
                size: file.size,
                url: e.target.result,
                isVideo: videoTypes.includes(file.type),
              };
              resolve(fileData);
            };
            reader.readAsDataURL(file);
          });
        })
      );

      const photos = processedFiles.filter(f => !f.isVideo);
      const videos = processedFiles.filter(f => f.isVideo);

      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...photos],
        videos: [...prev.videos, ...videos],
      }));

    } catch (error) {
      setUploadError('Ошибка при загрузке файлов');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removeMedia = (id, type) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter(item => item.id !== id),
    }));
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleDelete = async (id) => {
    try {
      await deleteEntry(id);
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const toggleFavorite = async (id) => {
    try {
      const entry = entries.find(e => e.id === id);
      if (entry) {
        await updateEntry(id, { favorite: !entry.favorite });
      }
    } catch (error) {
      console.error('Error updating favorite:', error);
    }
  };

  const sortedEntries = [...entries].sort((a, b) => dayjs(b.date).diff(dayjs(a.date)));

  const getMoodColor = (mood) => {
    const moodColors = {
      'Счастливая': '#ff6b9d',
      'Восхищённая': '#4ecdc4',
      'Благодарная': '#45b7d1',
      'Взволнованная': '#f9ca24',
      'Спокойная': '#6c5ce7',
      'Вдохновлённая': '#a29bfe',
      'Удивлённая': '#fd79a8',
      'Радостная': '#fdcb6e',
    };
    return moodColors[mood] || '#95a5a6';
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', position: 'relative' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" sx={{ color: 'primary.main', mb: 1 }}>
          Дневник путешествий 📖
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
          Место для впечатлений и воспоминаний о поездке
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Statistics Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2, width: 60, height: 60 }}>
                <BookIcon sx={{ fontSize: 30 }} />
              </Avatar>
              <Typography variant="h4" sx={{ color: 'primary.main', mb: 1 }}>
                {entries.length}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                Записей в дневнике
              </Typography>
              <Typography variant="h6" sx={{ color: 'secondary.main', mb: 1 }}>
                {entries.filter(e => e.favorite).length}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Любимых воспоминаний
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'secondary.main' }}>
                💡 Идеи для записей
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                • Что больше всего понравилось сегодня?
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                • Кто особенно запомнился?
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                • Что удивило или впечатлило?
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                • Какие эмоции?
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                • Что хотели бы запомнить навсегда?
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Diary Entries */}
        <Grid item xs={12} md={8}>
          {sortedEntries.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: 'grey.50' }}>
              <BookIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
                Дневник пока пуст
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                Начните записывать свои впечатления о поездке!
              </Typography>
              <Button variant="contained" onClick={handleAdd} startIcon={<AddIcon />}>
                Создать первую запись
              </Button>
            </Paper>
          ) : (
            sortedEntries.map((entry) => (
              <Card key={entry.id} sx={{ mb: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h5" sx={{ color: 'primary.main', mr: 2 }}>
                          {entry.title}
                        </Typography>
                        {entry.favorite && (
                          <FavoriteIcon sx={{ color: 'error.main' }} />
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                        <Chip
                          label={dayjs(entry.date).format('DD MMMM YYYY')}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        {entry.location && (
                          <Chip
                            icon={<PlaceIcon />}
                            label={entry.location}
                            size="small"
                            color="secondary"
                            variant="outlined"
                          />
                        )}
                        {entry.mood && (
                          <Chip
                            label={entry.mood}
                            size="small"
                            sx={{
                              backgroundColor: getMoodColor(entry.mood),
                              color: 'white',
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                    <Box>
                      <IconButton 
                        onClick={() => toggleFavorite(entry.id)} 
                        color={entry.favorite ? 'error' : 'default'}
                      >
                        <FavoriteIcon />
                      </IconButton>
                      <IconButton onClick={() => handleEdit(entry)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(entry.id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.primary' }}>
                    {entry.content}
                  </Typography>

                  {/* Media Gallery */}
                  {((entry.photos && entry.photos.length > 0) || (entry.videos && entry.videos.length > 0)) && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                        📷 Медиа ({(entry.photos?.length || 0) + (entry.videos?.length || 0)})
                      </Typography>
                      
                      <ImageList cols={3} rowHeight={160} gap={8}>
                        {/* Photos */}
                        {entry.photos?.map((photo) => (
                          <ImageListItem key={photo.id}>
                            <img
                              src={photo.url}
                              alt={photo.name}
                              style={{
                                width: '100%',
                                height: '160px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                                cursor: 'pointer',
                              }}
                              onClick={() => window.open(photo.url, '_blank')}
                            />
                          </ImageListItem>
                        ))}
                        
                        {/* Videos */}
                        {entry.videos?.map((video) => (
                          <ImageListItem key={video.id}>
                            <Box
                              sx={{
                                position: 'relative',
                                width: '100%',
                                height: '160px',
                                backgroundColor: 'black',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                cursor: 'pointer',
                              }}
                              onClick={() => window.open(video.url, '_blank')}
                            >
                              <video
                                src={video.url}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                }}
                              />
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: '50%',
                                  left: '50%',
                                  transform: 'translate(-50%, -50%)',
                                  color: 'white',
                                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                  borderRadius: '50%',
                                  p: 1.5,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <PlayIcon sx={{ fontSize: 30 }} />
                              </Box>
                            </Box>
                            <ImageListItemBar
                              title={video.name}
                              subtitle="Видео"
                              sx={{
                                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                              }}
                            />
                          </ImageListItem>
                        ))}
                      </ImageList>
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </Grid>
      </Grid>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="добавить запись"
        onClick={handleAdd}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <AddIcon />
      </Fab>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingEntry ? 'Редактировать запись' : 'Новая запись в дневнике'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Дата"
                  value={formData.date}
                  onChange={(newValue) => setFormData({ ...formData, date: newValue })}
                  sx={{ width: '100%' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Настроение"
                  select
                  SelectProps={{ native: true }}
                  value={formData.mood}
                  onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                >
                  <option value="">Выберите настроение</option>
                  {moods.map((mood) => (
                    <option key={mood} value={mood}>
                      {mood}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Заголовок"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Место"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Где вы были сегодня?"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ваши впечатления"
                  multiline
                  rows={6}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Расскажите о своих впечатлениях, эмоциях, интересных моментах дня..."
                />
              </Grid>

              {/* Media Upload Section */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  📸 Фото и видео
                </Typography>
                
                {/* Upload Buttons */}
                <Box sx={{ mb: 2 }}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    multiple
                    accept="image/*,video/*"
                    style={{ display: 'none' }}
                    capture="environment" // Mobile camera
                  />
                  
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={4}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<CameraIcon />}
                        onClick={openFileDialog}
                        sx={{ py: 1.5 }}
                      >
                        Камера
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<PhotoIcon />}
                        onClick={openFileDialog}
                        sx={{ py: 1.5 }}
                      >
                        Галерея
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<UploadIcon />}
                        onClick={openFileDialog}
                        sx={{ py: 1.5 }}
                      >
                        Загрузить
                      </Button>
                    </Grid>
                  </Grid>
                </Box>

                {/* Upload Progress */}
                {uploading && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Загрузка файлов... {Math.round(uploadProgress)}%
                    </Typography>
                    <LinearProgress variant="determinate" value={uploadProgress} />
                  </Box>
                )}

                {/* Upload Error */}
                {uploadError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {uploadError}
                  </Alert>
                )}

                {/* Media Preview */}
                {(formData.photos.length > 0 || formData.videos.length > 0) && (
                  <Box>
                    <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                      Загруженные файлы ({formData.photos.length + formData.videos.length})
                    </Typography>
                    
                    <ImageList cols={3} rowHeight={120} gap={8}>
                      {/* Photos */}
                      {formData.photos.map((photo) => (
                        <ImageListItem key={photo.id}>
                          <img
                            src={photo.url}
                            alt={photo.name}
                            style={{
                              width: '100%',
                              height: '120px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                            }}
                          />
                          <ImageListItemBar
                            actionIcon={
                              <IconButton
                                sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                                onClick={() => removeMedia(photo.id, 'photos')}
                              >
                                <CloseIcon />
                              </IconButton>
                            }
                          />
                        </ImageListItem>
                      ))}
                      
                      {/* Videos */}
                      {formData.videos.map((video) => (
                        <ImageListItem key={video.id}>
                          <Box
                            sx={{
                              position: 'relative',
                              width: '100%',
                              height: '120px',
                              backgroundColor: 'black',
                              borderRadius: '8px',
                              overflow: 'hidden',
                            }}
                          >
                            <video
                              src={video.url}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                            />
                            <Box
                              sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                color: 'white',
                                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                borderRadius: '50%',
                                p: 1,
                              }}
                            >
                              <PlayIcon />
                            </Box>
                          </Box>
                          <ImageListItemBar
                            actionIcon={
                              <IconButton
                                sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                                onClick={() => removeMedia(video.id, 'videos')}
                              >
                                <CloseIcon />
                              </IconButton>
                            }
                          />
                        </ImageListItem>
                      ))}
                    </ImageList>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Отмена</Button>
          <Button onClick={handleSave} variant="contained">
            {editingEntry ? 'Сохранить' : 'Добавить запись'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Diary;
