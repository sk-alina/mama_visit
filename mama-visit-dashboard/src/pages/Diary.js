import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Book as BookIcon,
  Photo as PhotoIcon,
  Favorite as FavoriteIcon,
  Place as PlaceIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

function Diary() {
  const [entries, setEntries] = useState([
    {
      id: '1',
      date: dayjs('2024-09-12'),
      title: 'Первый день в Америке! (Пробнвый пост)',
      location: 'Berlin, CT',
      content: 'Наконец-то я здесь! Полёт был долгим, но дочка встретила меня в аэропорту. Дом очень уютный и красивый',
      mood: 'Счастливая',
      photos: [],
      favorite: true,
    },
  ]);

  const [open, setOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [formData, setFormData] = useState({
    date: dayjs(),
    title: '',
    location: '',
    content: '',
    mood: '',
  });

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
    });
    setOpen(true);
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setFormData({
      date: entry.date,
      title: entry.title,
      location: entry.location,
      content: entry.content,
      mood: entry.mood,
    });
    setOpen(true);
  };

  const handleSave = () => {
    if (editingEntry) {
      setEntries(entries.map(entry =>
        entry.id === editingEntry.id
          ? { ...entry, ...formData }
          : entry
      ));
    } else {
      const newEntry = {
        id: Date.now().toString(),
        ...formData,
        photos: [],
        favorite: false,
      };
      setEntries([newEntry, ...entries]);
    }
    setOpen(false);
  };

  const handleDelete = (id) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const toggleFavorite = (id) => {
    setEntries(entries.map(entry =>
      entry.id === id
        ? { ...entry, favorite: !entry.favorite }
        : entry
    ));
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
          Записывайте свои впечатления и воспоминания о поездке
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
                • Какие новые места посетили?
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                • Что удивило или впечатлило?
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                • Какие эмоции испытывали?
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

                  {entry.photos && entry.photos.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                        📷 Фотографии ({entry.photos.length})
                      </Typography>
                      {/* Photo gallery would go here */}
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
