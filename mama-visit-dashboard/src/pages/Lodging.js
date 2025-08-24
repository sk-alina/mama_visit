import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Paper,
} from '@mui/material';
import {
  Hotel as HotelIcon,
  DirectionsCar as CarIcon,
  Wifi as WifiIcon,
  Kitchen as KitchenIcon,
  Tv as TvIcon,
  AcUnit as AcIcon,
  LocalLaundryService as LaundryIcon,
  LocalParking as ParkingIcon,
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Key as KeyIcon,
} from '@mui/icons-material';

function Lodging() {
  const [editDialog, setEditDialog] = useState({ open: false, type: '', data: {} });

  const [lodgingInfo, setLodgingInfo] = useState({
    address: '22 Edgewater Circle, Berlin, CT',
    type: 'Дом',
    bedrooms: '3 спальни',
    bathrooms: '2 ванные комнаты',
    wifi: 'MamaVisit2024',
    wifiPassword: 'Welcome123!',
    keyLocation: 'Под ковриком у входной двери',
    emergencyContact: '510-417-6856',
    checkIn: 'В любое время после 14:00',
    checkOut: 'До 11:00',
    specialInstructions: 'Термостат находится в гостиной. Мусор выносится по вторникам и пятницам.',
  });

  const [carInfo, setCarInfo] = useState({
    make: 'Toyota',
    model: 'Camry',
    year: '2022',
    color: 'Серебристый',
    licensePlate: 'CT-ABC123',
    parkingSpot: 'Подъездная дорожка',
    keyLocation: 'На крючке у входной двери',
    insurance: 'State Farm - полис #SF123456',
    emergencyRoadside: '1-800-STATE-FARM',
    gasStation: 'Shell на Main Street (5 минут от дома)',
    specialNotes: 'Бензин Premium. Сиденья с подогревом - кнопки на центральной консоли.',
  });

  const amenities = [
    { icon: <WifiIcon />, text: 'Бесплатный Wi-Fi', available: true },
    { icon: <KitchenIcon />, text: 'Полностью оборудованная кухня', available: true },
    { icon: <TvIcon />, text: 'Smart TV с Netflix', available: true },
    { icon: <AcIcon />, text: 'Кондиционер и отопление', available: true },
    { icon: <LaundryIcon />, text: 'Стиральная и сушильная машины', available: true },
    { icon: <ParkingIcon />, text: 'Бесплатная парковка', available: true },
  ];

  const handleEdit = (type, data) => {
    setEditDialog({ open: true, type, data: { ...data } });
  };

  const handleSave = () => {
    if (editDialog.type === 'lodging') {
      setLodgingInfo(editDialog.data);
    } else if (editDialog.type === 'car') {
      setCarInfo(editDialog.data);
    }
    setEditDialog({ open: false, type: '', data: {} });
  };

  const handleInputChange = (field, value) => {
    setEditDialog(prev => ({
      ...prev,
      data: { ...prev.data, [field]: value }
    }));
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" sx={{ color: 'primary.main', mb: 1 }}>
          Жильё и транспорт 🏠🚗
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
          Вся информация о доме и машине для комфортного пребывания
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Hotel Information */}
        <Grid item xs={12}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <HotelIcon />
                </Avatar>
                <Typography variant="h5">Marriott Residence Inn Hartford Rocky Hill</Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ color: 'secondary.main', mb: 2 }}>
                      🏨 Информация об отеле
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Название:</strong> Residence Inn Hartford Rocky Hill
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Адрес:</strong> 680 Cromwell Ave, Rocky Hill, CT 06067
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Телефон:</strong> (860) 257-7500
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      <strong>Тип номера:</strong> Studio 1 Queen Sofa Bed
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip label="Одобрено Алиной" color="primary" variant="outlined" />
                      <Chip label="Одобрено Аспеном" color="secondary" variant="outlined" />
                      <Chip label="Одобрено Эхо" color="primary" variant="outlined" />
                    </Box>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ color: 'secondary.main', mb: 2 }}>
                      🛏️ Детали номера
                    </Typography>
                    <List dense>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemText 
                          primary="Спальные места" 
                          secondary="1 Queen кровать + раскладной диван"
                        />
                      </ListItem>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemText 
                          primary="Площадь" 
                          secondary="Студия (~350 кв. футов)"
                        />
                      </ListItem>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemText 
                          primary="Максимальная вместимость" 
                          secondary="4 гостя"
                        />
                      </ListItem>
                    </List>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ color: 'secondary.main', mb: 2 }}>
                      🏠 Удобства номера
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <KitchenIcon sx={{ color: 'success.main', mr: 1 }} />
                          <Typography variant="body2">Полная кухня</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <WifiIcon sx={{ color: 'success.main', mr: 1 }} />
                          <Typography variant="body2">Бесплатный Wi-Fi</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <TvIcon sx={{ color: 'success.main', mr: 1 }} />
                          <Typography variant="body2">Smart TV</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LaundryIcon sx={{ color: 'success.main', mr: 1 }} />
                          <Typography variant="body2">Прачечная</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationIcon sx={{ color: 'success.main', mr: 1 }} />
                          <Typography variant="body2">15 минут езды от дома Алины</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" sx={{ ml: 3 }}>🐱 Проживание с замечательным котом по имени Эхо</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ color: 'secondary.main', mb: 2 }}>
                      🏨 Услуги отеля
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>• Бесплатный завтрак</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>• Фитнес-центр</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>• Бассейн</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>• Место для костра (firepit)</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>• Магазин закусок и напитков</Typography>
                  </Box>

                  <Box>
                    <Typography variant="h6" sx={{ color: 'secondary.main', mb: 2 }}>
                      📸 Фотографии номера
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Box 
                          sx={{ 
                            height: 150, 
                            borderRadius: 2,
                            overflow: 'hidden',
                            position: 'relative'
                          }}
                        >
                          <img
                            src="/images/hotel-general-view.jpg.jpg"
                            alt="Общий вид номера"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                            onError={(e) => {
                              e.target.src = "https://cache.marriott.com/content/dam/marriott-renditions/BDLRR/bdlrr-studio-queen-sofa-bed-0049-hor-clsc.jpg";
                            }}
                          />
                          <Box 
                            sx={{ 
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                              color: 'white',
                              p: 1
                            }}
                          >
                            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                              Общий вид номера
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box 
                          sx={{ 
                            height: 150, 
                            borderRadius: 2,
                            overflow: 'hidden',
                            position: 'relative'
                          }}
                        >
                          <img
                            src="/images/hotel-kitchen.jpg.jpg"
                            alt="Кухонная зона"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                            onError={(e) => {
                              e.target.src = "https://cache.marriott.com/content/dam/marriott-renditions/BDLRR/bdlrr-studio-kitchen-0051-hor-clsc.jpg";
                            }}
                          />
                          <Box 
                            sx={{ 
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                              color: 'white',
                              p: 1
                            }}
                          >
                            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                              Кухонная зона
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box 
                          sx={{ 
                            height: 150, 
                            borderRadius: 2,
                            overflow: 'hidden',
                            position: 'relative'
                          }}
                        >
                          <img
                            src="/images/hotel-sofa-bed.jpg.jpg"
                            alt="Место для проживания"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                            onError={(e) => {
                              e.target.src = "https://cache.marriott.com/content/dam/marriott-renditions/BDLRR/bdlrr-studio-queen-sofa-bed-0049-hor-clsc.jpg";
                            }}
                          />
                          <Box 
                            sx={{ 
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                              color: 'white',
                              p: 1
                            }}
                          >
                            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                              Место для проживания
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box 
                          sx={{ 
                            height: 150, 
                            borderRadius: 2,
                            overflow: 'hidden',
                            position: 'relative'
                          }}
                        >
                          <img
                            src="/images/hotel-bathroom.jpg.jpg"
                            alt="Ванная комната"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                            onError={(e) => {
                              e.target.src = "https://cache.marriott.com/content/dam/marriott-renditions/BDLRR/bdlrr-studio-bathroom-0052-hor-clsc.jpg";
                            }}
                          />
                          <Box 
                            sx={{ 
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                              color: 'white',
                              p: 1
                            }}
                          >
                            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                              Ванная комната
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Home Lodging Information */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <HotelIcon />
                  </Avatar>
                  <Typography variant="h5">Где живем мы</Typography>
                </Box>
                <IconButton onClick={() => handleEdit('lodging', lodgingInfo)} color="primary">
                  <EditIcon />
                </IconButton>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ color: 'secondary.main', mb: 2 }}>
                  📍 Адрес
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Адрес:</strong> {lodgingInfo.address}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Chip label={lodgingInfo.bedrooms} color="primary" variant="outlined" />
                  <Chip label={lodgingInfo.bathrooms} color="primary" variant="outlined" />
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ color: 'secondary.main', mb: 2 }}>
                  🔑 Важная информация
                </Typography>
                <List dense>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon><WifiIcon color="primary" /></ListItemIcon>
                    <ListItemText 
                      primary="Wi-Fi" 
                      secondary={`Сеть: ${lodgingInfo.wifi} | Пароль: ${lodgingInfo.wifiPassword}`}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon><KeyIcon color="primary" /></ListItemIcon>
                    <ListItemText 
                      primary="Ключи от дома" 
                      secondary={lodgingInfo.keyLocation}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon><PhoneIcon color="primary" /></ListItemIcon>
                    <ListItemText 
                      primary="Экстренный контакт" 
                      secondary={lodgingInfo.emergencyContact}
                    />
                  </ListItem>
                </List>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ color: 'secondary.main', mb: 2 }}>
                  ⏰ Время заезда/выезда
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Заезд:</strong> {lodgingInfo.checkIn}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  <strong>Выезд:</strong> {lodgingInfo.checkOut}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                  {lodgingInfo.specialInstructions}
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box>
                <Typography variant="h6" sx={{ color: 'secondary.main', mb: 2 }}>
                  🏠 Удобства
                </Typography>
                <Grid container spacing={1}>
                  {amenities.map((amenity, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ color: amenity.available ? 'success.main' : 'text.disabled', mr: 1 }}>
                          {amenity.icon}
                        </Box>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: amenity.available ? 'text.primary' : 'text.disabled',
                            textDecoration: amenity.available ? 'none' : 'line-through'
                          }}
                        >
                          {amenity.text}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Car Information */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                    <CarIcon />
                  </Avatar>
                  <Typography variant="h5">Информация о машине</Typography>
                </Box>
                <IconButton onClick={() => handleEdit('car', carInfo)} color="primary">
                  <EditIcon />
                </IconButton>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ color: 'secondary.main', mb: 2 }}>
                  🚗 Детали автомобиля
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Марка и модель:</strong> {carInfo.make} {carInfo.model} ({carInfo.year})
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Цвет:</strong> {carInfo.color}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Номерной знак:</strong> {carInfo.licensePlate}
                </Typography>
                <Chip 
                  label={`Парковка: ${carInfo.parkingSpot}`} 
                  color="secondary" 
                  variant="outlined" 
                />
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ color: 'secondary.main', mb: 2 }}>
                  🔑 Ключи и доступ
                </Typography>
                <List dense>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon><KeyIcon color="secondary" /></ListItemIcon>
                    <ListItemText 
                      primary="Ключи от машины" 
                      secondary={carInfo.keyLocation}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon><LocationIcon color="secondary" /></ListItemIcon>
                    <ListItemText 
                      primary="Заправка" 
                      secondary={carInfo.gasStation}
                    />
                  </ListItem>
                </List>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ color: 'secondary.main', mb: 2 }}>
                  📋 Страховка и экстренные службы
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Страховая компания:</strong> {carInfo.insurance}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  <strong>Дорожная помощь:</strong> {carInfo.emergencyRoadside}
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box>
                <Typography variant="h6" sx={{ color: 'secondary.main', mb: 2 }}>
                  💡 Особые заметки
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                  {carInfo.specialNotes}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Edit Dialog */}
      <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, type: '', data: {} })} maxWidth="md" fullWidth>
        <DialogTitle>
          Редактировать {editDialog.type === 'lodging' ? 'информацию о жилье' : 'информацию о машине'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {editDialog.type === 'lodging' && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Адрес"
                    value={editDialog.data.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Wi-Fi сеть"
                    value={editDialog.data.wifi || ''}
                    onChange={(e) => handleInputChange('wifi', e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Пароль Wi-Fi"
                    value={editDialog.data.wifiPassword || ''}
                    onChange={(e) => handleInputChange('wifiPassword', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Местоположение ключей"
                    value={editDialog.data.keyLocation || ''}
                    onChange={(e) => handleInputChange('keyLocation', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Особые инструкции"
                    multiline
                    rows={3}
                    value={editDialog.data.specialInstructions || ''}
                    onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                  />
                </Grid>
              </Grid>
            )}
            
            {editDialog.type === 'car' && (
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Марка"
                    value={editDialog.data.make || ''}
                    onChange={(e) => handleInputChange('make', e.target.value)}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Модель"
                    value={editDialog.data.model || ''}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Год"
                    value={editDialog.data.year || ''}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Цвет"
                    value={editDialog.data.color || ''}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Номерной знак"
                    value={editDialog.data.licensePlate || ''}
                    onChange={(e) => handleInputChange('licensePlate', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Местоположение ключей"
                    value={editDialog.data.keyLocation || ''}
                    onChange={(e) => handleInputChange('keyLocation', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Заправка"
                    value={editDialog.data.gasStation || ''}
                    onChange={(e) => handleInputChange('gasStation', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Особые заметки"
                    multiline
                    rows={3}
                    value={editDialog.data.specialNotes || ''}
                    onChange={(e) => handleInputChange('specialNotes', e.target.value)}
                  />
                </Grid>
              </Grid>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, type: '', data: {} })}>
            Отмена
          </Button>
          <Button onClick={handleSave} variant="contained">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Lodging;
