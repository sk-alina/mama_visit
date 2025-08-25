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
  Fab,
  Alert,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  PhotoCamera as CameraIcon,
} from '@mui/icons-material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Item Component with cute frames
function SortableItem({ id, item, onEdit, onDelete, onStatusChange, category }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Different frame styles for each category
  const getFrameStyle = (category) => {
    switch (category) {
      case 'yes':
        return {
          background: 'linear-gradient(45deg, #4CAF50, #8BC34A, #CDDC39)',
          border: '4px solid #4CAF50',
          boxShadow: '0 8px 32px rgba(76, 175, 80, 0.3)',
          '&::before': {
            background: 'linear-gradient(45deg, #66BB6A, #81C784, #A5D6A7)',
          },
        };
      case 'no':
        return {
          background: 'linear-gradient(45deg, #F44336, #E57373, #FFCDD2)',
          border: '4px solid #F44336',
          boxShadow: '0 8px 32px rgba(244, 67, 54, 0.3)',
          '&::before': {
            background: 'linear-gradient(45deg, #EF5350, #E57373, #FFAB91)',
          },
        };
      default: // not-sorted
        return {
          background: 'linear-gradient(45deg, #FF9800, #FFC107, #FFEB3B)',
          border: '4px solid #FF9800',
          boxShadow: '0 8px 32px rgba(255, 152, 0, 0.3)',
          '&::before': {
            background: 'linear-gradient(45deg, #FFB74D, #FFCC02, #FFF176)',
          },
        };
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'yes': return '#4CAF50';
      case 'no': return '#F44336';
      default: return '#FF9800';
    }
  };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{
        position: 'relative',
        width: '280px',
        height: '320px',
        cursor: isDragging ? 'grabbing' : 'grab',
        borderRadius: '20px',
        padding: '12px',
        ...getFrameStyle(category),
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-6px',
          left: '-6px',
          right: '-6px',
          bottom: '-6px',
          borderRadius: '26px',
          zIndex: -1,
          animation: 'shimmer 3s ease-in-out infinite',
        },
        '@keyframes shimmer': {
          '0%, 100%': { opacity: 0.7 },
          '50%': { opacity: 1 },
        },
        '&:hover': {
          transform: 'translateY(-4px)',
          transition: 'transform 0.3s ease',
        },
      }}
    >
      {/* Image container with cute decorative frame */}
      <Box
        sx={{
          width: '100%',
          height: '200px',
          borderRadius: '20px',
          overflow: 'hidden',
          mb: 2,
          position: 'relative',
          background: 'linear-gradient(45deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))',
          padding: '8px',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '4px',
            left: '4px',
            right: '4px',
            bottom: '4px',
            borderRadius: '16px',
            background: 'linear-gradient(45deg, rgba(255,182,193,0.3), rgba(255,218,185,0.3), rgba(255,255,224,0.3))',
            zIndex: 1,
          },
          '&::after': {
            content: '"✨"',
            position: 'absolute',
            top: '12px',
            left: '12px',
            fontSize: '16px',
            zIndex: 3,
            animation: 'sparkle 2s ease-in-out infinite',
          },
          '@keyframes sparkle': {
            '0%, 100%': { opacity: 0.7, transform: 'scale(1)' },
            '50%': { opacity: 1, transform: 'scale(1.2)' },
          },
        }}
      >
        {/* Decorative corner elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #FFB6C1, #FFA07A)',
            zIndex: 3,
            '&::before': {
              content: '"💖"',
              position: 'absolute',
              top: '-2px',
              left: '-2px',
              fontSize: '12px',
            },
          }}
        />
        
        <Box
          sx={{
            position: 'absolute',
            bottom: '8px',
            left: '8px',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #98FB98, #87CEEB)',
            zIndex: 3,
            '&::before': {
              content: '"🌟"',
              position: 'absolute',
              top: '-4px',
              left: '-4px',
              fontSize: '10px',
            },
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #DDA0DD, #F0E68C)',
            zIndex: 3,
            '&::before': {
              content: '"🎀"',
              position: 'absolute',
              top: '-3px',
              left: '-3px',
              fontSize: '11px',
            },
          }}
        />

        <img
          src={item.imageUrl}
          alt={item.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '12px',
            position: 'relative',
            zIndex: 2,
            border: '2px solid rgba(255, 255, 255, 0.8)',
          }}
        />
        
        {/* Action buttons overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            display: 'flex',
            gap: 1,
            zIndex: 4,
          }}
        >
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '2px solid rgba(255, 182, 193, 0.5)',
              '&:hover': { 
                backgroundColor: 'rgba(255, 255, 255, 1)',
                transform: 'scale(1.1)',
                boxShadow: '0 4px 12px rgba(255, 182, 193, 0.4)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <EditIcon fontSize="small" sx={{ color: '#FF69B4' }} />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '2px solid rgba(255, 99, 71, 0.5)',
              '&:hover': { 
                backgroundColor: 'rgba(255, 255, 255, 1)',
                transform: 'scale(1.1)',
                boxShadow: '0 4px 12px rgba(255, 99, 71, 0.4)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <DeleteIcon fontSize="small" sx={{ color: '#FF6347' }} />
          </IconButton>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          variant="h6"
          sx={{
            color: 'white',
            fontWeight: 'bold',
            mb: 1,
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
            fontSize: '1rem',
            lineHeight: 1.2,
          }}
        >
          {item.title}
        </Typography>
        
        {item.description && (
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              mb: 1,
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
              fontSize: '0.85rem',
              lineHeight: 1.2,
            }}
          >
            {item.description}
          </Typography>
        )}

        {/* Status chip */}
        <Box
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={item.status}
              onChange={(e) => {
                e.stopPropagation();
                onStatusChange(item.id, e.target.value);
              }}
              sx={{
                backgroundColor: getStatusColor(item.status),
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.8rem',
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '& .MuiSelect-icon': {
                  color: 'white',
                },
              }}
              MenuProps={{
                disablePortal: false,
                onClick: (e) => e.stopPropagation(),
              }}
            >
              <MenuItem value="not-sorted">🤔 Не решили</MenuItem>
              <MenuItem value="yes">✅ Беру</MenuItem>
              <MenuItem value="no">❌ Не беру</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
    </Paper>
  );
}

// Droppable Area Component
function DroppableArea({ id, title, items, children, color }) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        minHeight: '400px',
        p: 2,
        borderRadius: 3,
        border: `3px dashed ${color}`,
        backgroundColor: isOver ? `${color}20` : `${color}10`,
        position: 'relative',
        transition: 'background-color 0.2s ease',
        transform: isOver ? 'scale(1.02)' : 'scale(1)',
      }}
    >
      <Typography
        variant="h5"
        sx={{
          color: color,
          fontWeight: 'bold',
          mb: 3,
          textAlign: 'center',
        }}
      >
        {title} ({items.length})
      </Typography>
      
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 3,
          justifyItems: 'center',
        }}
      >
        {children}
      </Box>
      
      {items.length === 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: 'text.secondary',
          }}
        >
          <Typography variant="h6" sx={{ opacity: isOver ? 0.8 : 0.5 }}>
            {isOver ? 'Отпусти здесь!' : 'Перетащи сюда предметы'}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

function Packing() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    status: 'not-sorted',
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [activeId, setActiveId] = useState(null);
  
  const fileInputRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Sample data
  useEffect(() => {
    const sampleItems = [
      {
        id: '1',
        title: 'Подарки',
        description: 'Игрушки и сувениры из России',
        imageUrl: '/images/echo.png', // Using existing image as placeholder
        status: 'yes',
      },
      {
        id: '2',
        title: 'Теплая одежда',
        description: 'Свитера и куртки на случай холодов',
        imageUrl: '/images/echo.png',
        status: 'not-sorted',
      },
    ];
    setItems(sampleItems);
  }, []);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file) => {
    setUploadError('');
    setUploading(true);
    setUploadProgress(0);

    const maxSize = 10 * 1024 * 1024; // 10MB
    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (file.size > maxSize) {
      setUploadError('Файл слишком большой. Максимальный размер: 10MB');
      setUploading(false);
      return;
    }

    if (!imageTypes.includes(file.type)) {
      setUploadError('Неподдерживаемый формат файла. Используй JPG, PNG или GIF');
      setUploading(false);
      return;
    }

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Convert to base64 for demo purposes
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          imageUrl: e.target.result,
        }));
        setUploading(false);
        setUploadProgress(0);
      };
      reader.readAsDataURL(file);

    } catch (error) {
      setUploadError('Ошибка при загрузке файла');
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      status: 'not-sorted',
    });
    setUploadError('');
    setOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl,
      status: item.status,
    });
    setUploadError('');
    setOpen(true);
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      setUploadError('Пожалуйста, введи название предмета');
      return;
    }

    if (!formData.imageUrl) {
      setUploadError('Пожалуйста, загрузи фотографию');
      return;
    }

    if (editingItem) {
      setItems(prev => prev.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData }
          : item
      ));
    } else {
      const newItem = {
        id: Date.now().toString(),
        ...formData,
      };
      setItems(prev => [...prev, newItem]);
    }

    setOpen(false);
  };

  const handleDelete = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleStatusChange = (id, newStatus) => {
    setItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, status: newStatus }
        : item
    ));
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeItem = items.find(item => item.id === active.id);
    if (!activeItem) return;

    // Determine new status based on drop zone
    let newStatus = activeItem.status;
    if (over.id === 'yes-zone') newStatus = 'yes';
    else if (over.id === 'no-zone') newStatus = 'no';
    else if (over.id === 'not-sorted-zone') newStatus = 'not-sorted';

    if (newStatus !== activeItem.status) {
      handleStatusChange(active.id, newStatus);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  // Categorize items
  const yesItems = items.filter(item => item.status === 'yes');
  const noItems = items.filter(item => item.status === 'no');
  const notSortedItems = items.filter(item => item.status === 'not-sorted');

  const activeItem = activeId ? items.find(item => item.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{ maxWidth: 1400, mx: 'auto', position: 'relative' }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h2" sx={{ color: 'primary.main', mb: 1 }}>
            Что везти 🧳
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary' }}>
            Планируем, что взять с собой, а что оставить
          </Typography>
        </Box>

        {/* Statistics */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ textAlign: 'center', backgroundColor: '#4CAF5010' }}>
              <CardContent>
                <Typography variant="h4" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                  {yesItems.length}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  Беру с собой ✅
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ textAlign: 'center', backgroundColor: '#F4433610' }}>
              <CardContent>
                <Typography variant="h4" sx={{ color: '#F44336', fontWeight: 'bold' }}>
                  {noItems.length}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  Не беру ❌
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ textAlign: 'center', backgroundColor: '#FF980010' }}>
              <CardContent>
                <Typography variant="h4" sx={{ color: '#FF9800', fontWeight: 'bold' }}>
                  {notSortedItems.length}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  Не решила 🤔
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Categories */}
        <Grid container spacing={3}>
          {/* Not Sorted */}
          <Grid item xs={12}>
            <SortableContext items={notSortedItems.map(item => item.id)} strategy={rectSortingStrategy}>
              <DroppableArea
                id="not-sorted-zone"
                title="🤔 Не решила"
                items={notSortedItems}
                color="#FF9800"
              >
                {notSortedItems.map((item) => (
                  <SortableItem
                    key={item.id}
                    id={item.id}
                    item={item}
                    category="not-sorted"
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </DroppableArea>
            </SortableContext>
          </Grid>

          {/* Yes */}
          <Grid item xs={12} md={6}>
            <SortableContext items={yesItems.map(item => item.id)} strategy={rectSortingStrategy}>
              <DroppableArea
                id="yes-zone"
                title="✅ Беру с собой"
                items={yesItems}
                color="#4CAF50"
              >
                {yesItems.map((item) => (
                  <SortableItem
                    key={item.id}
                    id={item.id}
                    item={item}
                    category="yes"
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </DroppableArea>
            </SortableContext>
          </Grid>

          {/* No */}
          <Grid item xs={12} md={6}>
            <SortableContext items={noItems.map(item => item.id)} strategy={rectSortingStrategy}>
              <DroppableArea
                id="no-zone"
                title="❌ Не беру"
                items={noItems}
                color="#F44336"
              >
                {noItems.map((item) => (
                  <SortableItem
                    key={item.id}
                    id={item.id}
                    item={item}
                    category="no"
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </DroppableArea>
            </SortableContext>
          </Grid>
        </Grid>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="добавить предмет"
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
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingItem ? 'Редактировать предмет' : 'Добавить новый предмет'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Название предмета"
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

                {/* Photo Upload */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                    📸 Фотография предмета
                  </Typography>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<CameraIcon />}
                    onClick={openFileDialog}
                    sx={{ mb: 2 }}
                  >
                    Загрузить фото
                  </Button>

                  {uploading && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Загрузка... {Math.round(uploadProgress)}%
                      </Typography>
                      <LinearProgress variant="determinate" value={uploadProgress} />
                    </Box>
                  )}

                  {uploadError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {uploadError}
                    </Alert>
                  )}

                  {formData.imageUrl && (
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        style={{
                          maxWidth: '200px',
                          maxHeight: '200px',
                          borderRadius: '8px',
                          border: '2px solid #e0e0e0',
                        }}
                      />
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Статус</InputLabel>
                    <Select
                      value={formData.status}
                      label="Статус"
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <MenuItem value="not-sorted">🤔 Не решила</MenuItem>
                      <MenuItem value="yes">✅ Беру</MenuItem>
                      <MenuItem value="no">❌ Не беру</MenuItem>
                    </Select>
                  </FormControl>
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

        {/* Drag Overlay */}
        <DragOverlay>
          {activeItem ? (
            <SortableItem
              id={activeItem.id}
              item={activeItem}
              category={activeItem.status}
              onEdit={() => {}}
              onDelete={() => {}}
              onStatusChange={() => {}}
            />
          ) : null}
        </DragOverlay>
      </Box>
    </DndContext>
  );
}

export default Packing;
