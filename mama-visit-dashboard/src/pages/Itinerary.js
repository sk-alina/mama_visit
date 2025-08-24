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
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Grid,
  Paper,
  Avatar,
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
              label={dayjs(item.dateTime).format('DD MMMM YYYY')}
              size="small"
              color="primary"
              variant="outlined"
            />
            <Chip
              icon={<ScheduleIcon />}
              label={dayjs(item.dateTime).format('HH:mm')}
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
  const [events, setEvents] = useState([
    {
      id: '1',
      title: 'Прилёт мамы',
      description: 'Встреча в аэропорту, поездка домой',
      dateTime: dayjs('2024-09-12T14:00'),
    },
    {
      id: '2',
      title: 'Ужин дома',
      description: 'Первый семейный ужин, знакомство с домом',
      dateTime: dayjs('2024-09-12T19:00'),
    },
    {
      id: '3',
      title: 'Прогулка по городу',
      description: 'Показать окрестности, местные магазины',
      dateTime: dayjs('2024-09-13T10:00'),
    },
  ]);

  const [open, setOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dateTime: dayjs(),
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setEvents((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
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
      dateTime: event.dateTime,
    });
    setOpen(true);
  };

  const handleSave = () => {
    if (editingEvent) {
      setEvents(events.map(event =>
        event.id === editingEvent.id
          ? { ...event, ...formData }
          : event
      ));
    } else {
      const newEvent = {
        id: Date.now().toString(),
        ...formData,
      };
      setEvents([...events, newEvent]);
    }
    setOpen(false);
  };

  const handleDelete = (id) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const sortedEvents = [...events].sort((a, b) => dayjs(a.dateTime).diff(dayjs(b.dateTime)));

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h2" sx={{ color: 'primary.main', mb: 1 }}>
            Расписание поездки 📅
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary' }}>
            12-29 сентября 2024 • Планы и мероприятия
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
                  События (перетащите для изменения порядка)
                </Typography>
              </Box>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={events.map(e => e.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {events.map((event) => (
                    <SortableItem
                      key={event.id}
                      id={event.id}
                      item={event}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </SortableContext>
              </DndContext>

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
                  <ListItem key={event.id} sx={{ px: 0 }}>
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {event.title}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {dayjs(event.dateTime).format('DD MMM, HH:mm')}
                        </Typography>
                      }
                    />
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
                • Перетаскивайте события для изменения порядка
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                • Используйте кнопку редактирования для изменения деталей
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                • Добавляйте время и дату для каждого события
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
