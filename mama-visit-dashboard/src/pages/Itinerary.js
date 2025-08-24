import React, { useState, useEffect } from 'react';
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
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Grid,
  Paper,
  Avatar,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  DragIndicator as DragIcon,
  Schedule as ScheduleIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useItinerary } from '../hooks/useFirestore';

// Sortable Item Component
function SortableItem({ id, item, onEdit, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      sx={{
        mb: 2,
        p: 2,
        cursor: 'grab',
        '&:hover': {
          boxShadow: 3,
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton {...attributes} {...listeners} sx={{ mr: 2 }}>
          <DragIcon />
        </IconButton>
        
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" sx={{ color: 'primary.main' }}>
            {item.title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
            {item.description}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              icon={<EventIcon />}
              label={dayjs(item.date).format('DD MMMM YYYY')}
              size="small"
              color="primary"
              variant="outlined"
            />
            <Chip
              icon={<ScheduleIcon />}
              label={dayjs(item.date).format('HH:mm')}
              size="small"
              color="secondary"
              variant="outlined"
            />
          </Box>
        </Box>

        <Box>
          <IconButton onClick={() => onEdit(item)} color="primary">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => onDelete(item.id)} color="error">
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
}

function Itinerary() {
  // Use Firestore hook for persistent data
  const { 
    data: events, 
    loading: eventsLoading, 
    error: eventsError,
    addDocument: addEvent,
    updateDocument: updateEvent,
    deleteDocument: deleteEvent
  } = useItinerary();

  const [open, setOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dateTime: dayjs(),
  });

  // Initialize with sample data if database is empty
  useEffect(() => {
    if (!eventsLoading && events.length === 0) {
      const sampleEvents = [
        {
          title: 'Прилёт мамы',
          description: 'Встреча в аэропорту, поездка домой',
          date: '5-09-12T14:00',
        },
        {
          title: 'Ужин дома',
          description: 'Первый семейный ужин, знакомство с домом',
          date: '2025-09-12T19:00',
        },
        {
          title: 'Прогулка по городу',
          description: 'Показать окрестности, местные магазины',
          date: '2025-09-13T10:00',
        },
      ];

      // Add sample data
      sampleEvents.forEach(event => {
        addEvent(event).catch(console.error);
      });
    }
  }, [eventsLoading, events.length, addEvent]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = events.findIndex((item) => item.id === active.id);
      const newIndex = events.findIndex((item) => item.id === over.id);
      
      const reorderedEvents = arrayMove(events, oldIndex, newIndex);
      
      // Update order in Firestore
      try {
        await Promise.all(
          reorderedEvents.map((event, index) =>
            updateEvent(event.id, { order: index })
          )
        );
      } catch (error) {
        console.error('Error updating event order:', error);
      }
    }
  };

  const handleAdd = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      dateTime: dayjs(),
    });
    setOpen(true);
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      dateTime: dayjs(event.date || event.dateTime),
    });
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      console.log('Attempting to save event:', formData);
      
      if (!formData.title.trim()) {
        alert('Пожалуйста, введите название события');
        return;
      }

      const eventData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        date: formData.dateTime.toDate().toISOString(),
      };

      if (editingEvent) {
        // Update existing event
        console.log('Updating event:', editingEvent.id, eventData);
        await updateEvent(editingEvent.id, eventData);
        console.log('Event updated successfully');
      } else {
        // Add new event
        console.log('Adding new event:', eventData);
        const newEventId = await addEvent(eventData);
        console.log('Event added successfully with ID:', newEventId);
      }
      setOpen(false);
    } catch (error) {
      console.error('Error saving event:', error);
      alert(`Ошибка при сохранении события: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEvent(id);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const sortedEvents = [...events].sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h2" sx={{ color: 'primary.main', mb: 1 }}>
            План Жизни 📅
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary' }}>
            12-29 сентября 2025 • Расписание всего самого интересного
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          size="large"
          sx={{ borderRadius: 3 }}
        >
          Добавить событие
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <ScheduleIcon />
                </Avatar>
                <Typography variant="h5">
                  События
                </Typography>
              </Box>

              {sortedEvents.map((event) => (
                <Paper
                  key={event.id}
                  sx={{
                    mb: 2,
                    p: 2,
                    '&:hover': {
                      boxShadow: 3,
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ color: 'primary.main' }}>
                        {event.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                        {event.description}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                          icon={<EventIcon />}
                          label={`${dayjs(event.date).format('dddd')}, ${dayjs(event.date).format('DD MMMM YYYY')}`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        <Chip
                          icon={<ScheduleIcon />}
                          label={dayjs(event.date).format('HH:mm')}
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                      </Box>
                    </Box>

                    <Box>
                      <IconButton onClick={() => handleEdit(event)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(event.id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Paper>
              ))}

              {events.length === 0 && (
                <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: 'grey.50' }}>
                  <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
                    Пока нет запланированных событий
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Нажмите "Добавить событие", чтобы создать первое мероприятие
                  </Typography>
                </Paper>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, color: 'secondary.main' }}>
                Хронологический порядок
              </Typography>
              <List dense>
                {sortedEvents.map((event, index) => (
                  <ListItem key={event.id} sx={{ px: 0, py: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', minWidth: 'fit-content', mr: 2 }}>
                        {dayjs(event.date).format('ddd, DD MMM, HH:mm')}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, flex: 1, textAlign: 'right' }}>
                        {event.title}
                      </Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'secondary.main' }}>
                💡 Подсказки
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                • Выберай все самое интересное
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                • Используй кнопку редактирования для изменения деталей
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                • Добавляй время и дату для каждого события
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingEvent ? 'Редактировать событие' : 'Добавить новое событие'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Название события"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="Описание"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              sx={{ mb: 3 }}
            />
            <DateTimePicker
              label="Дата и время"
              value={formData.dateTime}
              onChange={(newValue) => setFormData({ ...formData, dateTime: newValue })}
              sx={{ width: '100%' }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Отмена</Button>
          <Button onClick={handleSave} variant="contained">
            {editingEvent ? 'Сохранить' : 'Добавить'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Itinerary;
