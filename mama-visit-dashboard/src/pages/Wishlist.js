import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Grid,
  Paper,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Divider,
  Fab,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Favorite as FavoriteIcon,
  ShoppingCart as ShoppingIcon,
  Place as PlaceIcon,
  DragIndicator as DragIcon,
} from '@mui/icons-material';
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
import { useWishlist } from '../hooks/useFirestore';

// Sortable Item Component
function SortableItem({ id, item, onEdit, onDelete, onToggleComplete, type }) {
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
        opacity: item.completed ? 0.6 : 1,
        '&:hover': {
          boxShadow: 3,
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton {...attributes} {...listeners} sx={{ mr: 2 }}>
          <DragIcon />
        </IconButton>
        
        <Checkbox
          checked={item.completed}
          onChange={() => onToggleComplete(item.id)}
          color="primary"
        />
        
        <Box sx={{ flexGrow: 1, ml: 2 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: item.completed ? 'text.secondary' : 'primary.main',
              textDecoration: item.completed ? 'line-through' : 'none'
            }}
          >
            {item.title}
          </Typography>
          {item.description && (
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
              {item.description}
            </Typography>
          )}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {item.priority && (
              <Chip
                label={item.priority}
                size="small"
                color={
                  item.priority === 'Высокий' ? 'error' :
                  item.priority === 'Средний' ? 'warning' : 'default'
                }
                variant="outlined"
              />
            )}
            {item.location && (
              <Chip
                icon={<PlaceIcon />}
                label={item.location}
                size="small"
                color="secondary"
                variant="outlined"
              />
            )}
            {type === 'shopping' && item.quantity && (
              <Chip
                label={`Количество: ${item.quantity}`}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
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

function Wishlist() {
  const [tabValue, setTabValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [currentType, setCurrentType] = useState('wishlist');

  // Use Firestore hook for persistent data
  const { 
    data: wishlistData, 
    loading: wishlistLoading, 
    error: wishlistError,
    addDocument: addWishlistItem,
    updateDocument: updateWishlistItem,
    deleteDocument: deleteWishlistItem
  } = useWishlist();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: '',
    location: '',
    quantity: '',
  });

  // Separate wishlist and shopping items from Firestore data
  const wishlistItems = wishlistData.filter(item => item.type === 'wishlist' || !item.type);
  const shoppingItems = wishlistData.filter(item => item.type === 'shopping');

  // Initialize with sample data if database is empty
  useEffect(() => {
    if (!wishlistLoading && wishlistData.length === 0) {
      const sampleWishlistItems = [
        {
          title: 'Посетить Статую Свободы',
          description: 'Увидеть знаменитую статую и сделать фотографии',
          priority: 'Высокий',
          location: 'Нью-Йорк',
          completed: false,
          type: 'wishlist',
        },
        {
          title: 'Попробовать настоящую американскую пиццу',
          description: 'Найти хорошую пиццерию и попробовать местную кухню',
          priority: 'Средний',
          location: 'Любое место',
          completed: false,
          type: 'wishlist',
        },
        {
          title: 'Прогуляться по Центральному парку',
          description: 'Насладиться природой в центре большого города',
          priority: 'Средний',
          location: 'Нью-Йорк',
          completed: true,
          type: 'wishlist',
        },
      ];

      const sampleShoppingItems = [
        {
          title: 'Подарки для внуков',
          description: 'Игрушки и сувениры из Америки',
          quantity: '3-4 штуки',
          priority: 'Высокий',
          completed: false,
          type: 'shopping',
        },
        {
          title: 'Американский кофе',
          description: 'Хороший кофе для дома',
          quantity: '2 пачки',
          priority: 'Средний',
          completed: false,
          type: 'shopping',
        },
        {
          title: 'Магниты на холодильник',
          description: 'Сувениры с видами городов',
          quantity: '5-6 штук',
          priority: 'Низкий',
          completed: false,
          type: 'shopping',
        },
      ];

      // Add sample data
      [...sampleWishlistItems, ...sampleShoppingItems].forEach(item => {
        addWishlistItem(item).catch(console.error);
      });
    }
  }, [wishlistLoading, wishlistData.length, addWishlistItem]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const items = currentType === 'wishlist' ? wishlistItems : shoppingItems;
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      
      const reorderedItems = arrayMove(items, oldIndex, newIndex);
      
      // Update order in Firestore
      try {
        await Promise.all(
          reorderedItems.map((item, index) =>
            updateWishlistItem(item.id, { order: index })
          )
        );
      } catch (error) {
        console.error('Error updating item order:', error);
      }
    }
  };

  const handleAdd = (type) => {
    setCurrentType(type);
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      priority: '',
      location: '',
      quantity: '',
    });
    setOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      priority: item.priority || '',
      location: item.location || '',
      quantity: item.quantity || '',
    });
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingItem) {
        // Update existing item
        await updateWishlistItem(editingItem.id, formData);
      } else {
        // Add new item
        await addWishlistItem({
          ...formData,
          type: currentType,
          completed: false,
        });
      }
      setOpen(false);
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteWishlistItem(id);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleToggleComplete = async (id) => {
    try {
      const item = wishlistData.find(item => item.id === id);
      if (item) {
        await updateWishlistItem(id, { completed: !item.completed });
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const currentItems = tabValue === 0 ? wishlistItems : shoppingItems;

  const completedCount = currentItems.filter(item => item.completed).length;
  const totalCount = currentItems.length;

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', position: 'relative' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" sx={{ color: 'primary.main', mb: 1 }}>
          Список желаний 💝
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
          Что хотим сделать и купить во время поездки
        </Typography>
      </Box>

      {/* Featured Drink Section */}
      <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)' }}>
        <CardContent sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
            🥤 Особенный напиток
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mb: 2 
          }}>
            <Box
              sx={{
                width: '200px',
                height: '150px',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              }}
            >
              <img
                src="/images/drink.jpg"
                alt="Special drink"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>
          </Box>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Напиток, который обязательно нужно попробовать! 🌟
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Statistics */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2, width: 60, height: 60 }}>
                <FavoriteIcon sx={{ fontSize: 30 }} />
              </Avatar>
              <Typography variant="h4" sx={{ color: 'primary.main', mb: 1 }}>
                {completedCount}/{totalCount}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                Выполнено
              </Typography>
              <Box sx={{ width: '100%', backgroundColor: 'grey.200', borderRadius: 1, height: 8 }}>
                <Box
                  sx={{
                    width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%`,
                    backgroundColor: 'primary.main',
                    height: '100%',
                    borderRadius: 1,
                    transition: 'width 0.3s ease',
                  }}
                />
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'secondary.main' }}>
                📋 Как пользоваться
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                ✅ Отмечай выполненные пункты галочкой
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                🔥 Используй высокий приоритет для важных дел
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                ✏️ Редактируй или удаляй пункты по необходимости
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                💡 Добавляй новые идеи по мере их появления
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Lists */}
        <Grid item xs={12} md={8}>
          <Card>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
                <Tab 
                  label={`Список желаний (${wishlistItems.length})`} 
                  icon={<FavoriteIcon />}
                  iconPosition="start"
                />
                <Tab 
                  label={`Покупки (${shoppingItems.length})`} 
                  icon={<ShoppingIcon />}
                  iconPosition="start"
                />
              </Tabs>
            </Box>

            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">
                  {tabValue === 0 ? 'Что хотим сделать' : 'Что хотим купить'}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleAdd(tabValue === 0 ? 'wishlist' : 'shopping')}
                >
                  Добавить
                </Button>
              </Box>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={currentItems.map(item => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {currentItems.map((item) => (
                    <SortableItem
                      key={item.id}
                      id={item.id}
                      item={item}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onToggleComplete={handleToggleComplete}
                      type={tabValue === 0 ? 'wishlist' : 'shopping'}
                    />
                  ))}
                </SortableContext>
              </DndContext>

              {currentItems.length === 0 && (
                <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: 'grey.50' }}>
                  <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
                    {tabValue === 0 ? 'Список желаний пуст' : 'Список покупок пуст'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                    {tabValue === 0 
                      ? 'Добавьте то, что хотели бы сделать во время поездки'
                      : 'Добавьте то, что хотели бы купить'
                    }
                  </Typography>
                  <Button 
                    variant="contained" 
                    onClick={() => handleAdd(tabValue === 0 ? 'wishlist' : 'shopping')} 
                    startIcon={<AddIcon />}
                  >
                    Добавить первый пункт
                  </Button>
                </Paper>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="добавить пункт"
        onClick={() => handleAdd(tabValue === 0 ? 'wishlist' : 'shopping')}
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
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingItem ? 'Редактировать пункт' : 'Добавить новый пункт'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Название"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Описание"
                  multiline
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Приоритет</InputLabel>
                  <Select
                    value={formData.priority}
                    label="Приоритет"
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <MenuItem value="Высокий">Высокий</MenuItem>
                    <MenuItem value="Средний">Средний</MenuItem>
                    <MenuItem value="Низкий">Низкий</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label={currentType === 'shopping' ? 'Количество' : 'Место'}
                  value={currentType === 'shopping' ? formData.quantity : formData.location}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    [currentType === 'shopping' ? 'quantity' : 'location']: e.target.value 
                  })}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Отмена</Button>
          <Button onClick={handleSave} variant="contained">
            {editingItem ? 'Сохранить' : 'Добавить'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Wishlist;
