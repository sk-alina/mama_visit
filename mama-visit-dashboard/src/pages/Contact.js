import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
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
  Chip,
  Paper,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Warning as EmergencyIcon,
  LocalHospital as HospitalIcon,
  LocalPolice as PoliceIcon,
  LocalFireDepartment as FireIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  ContactPhone as ContactPhoneIcon,
  Home as HomeIcon,
} from '@mui/icons-material';

function Contact() {
  const [editDialog, setEditDialog] = useState({ open: false, type: '', data: {} });
  const [addContactDialog, setAddContactDialog] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relation: '' });

  const [mainContacts, setMainContacts] = useState([
    {
      id: '1',
      name: 'Дочка',
      phone: '510-417-6856',
      relation: 'Дочь',
      primary: true,
    },
    {
      id: '2',
      name: 'Aspen',
      phone: '413-205-7451',
      relation: 'Зять',
      primary: true,
    },
  ]);

  const [additionalContacts, setAdditionalContacts] = useState([
    {
      id: '3',
      name: 'Соседи (Джон и Мэри)',
      phone: '860-555-0123',
      relation: 'Соседи',
      primary: false,
    },
  ]);

  const [addressInfo, setAddressInfo] = useState({
    street: '22 Edgewater Circle',
    city: 'Berlin',
    state: 'CT',
    zipCode: '06037',
    country: 'США',
    directions: 'Дом находится в тихом районе, рядом с парком. Белый дом с синими ставнями.',
  });

  const emergencyServices = [
    {
      name: 'Экстренные службы (Полиция, Пожарная, Скорая)',
      phone: '911',
      icon: <EmergencyIcon />,
      description: 'Звонить в случае любой экстренной ситуации',
    },
    {
      name: 'Местная больница - Hartford Hospital',
      phone: '860-545-5000',
      icon: <HospitalIcon />,
      description: 'Ближайшая больница (15 минут на машине)',
    },
    {
      name: 'Полиция Berlin',
      phone: '860-828-7080',
      icon: <PoliceIcon />,
      description: 'Местное отделение полиции',
    },
    {
      name: 'Пожарная служба Berlin',
      phone: '860-828-7045',
      icon: <FireIcon />,
      description: 'Местная пожарная служба',
    },
  ];

  const handleEditAddress = () => {
    setEditDialog({ open: true, type: 'address', data: { ...addressInfo } });
  };

  const handleEditContact = (contact) => {
    setEditDialog({ open: true, type: 'contact', data: { ...contact } });
  };

  const handleSave = () => {
    if (editDialog.type === 'address') {
      setAddressInfo(editDialog.data);
    } else if (editDialog.type === 'contact') {
      const updatedContact = editDialog.data;
      if (updatedContact.primary) {
        setMainContacts(mainContacts.map(contact =>
          contact.id === updatedContact.id ? updatedContact : contact
        ));
      } else {
        setAdditionalContacts(additionalContacts.map(contact =>
          contact.id === updatedContact.id ? updatedContact : contact
        ));
      }
    }
    setEditDialog({ open: false, type: '', data: {} });
  };

  const handleAddContact = () => {
    const contact = {
      id: Date.now().toString(),
      ...newContact,
      primary: false,
    };
    setAdditionalContacts([...additionalContacts, contact]);
    setNewContact({ name: '', phone: '', relation: '' });
    setAddContactDialog(false);
  };

  const handleDeleteContact = (id) => {
    setAdditionalContacts(additionalContacts.filter(contact => contact.id !== id));
  };

  const handleInputChange = (field, value) => {
    if (editDialog.open) {
      setEditDialog(prev => ({
        ...prev,
        data: { ...prev.data, [field]: value }
      }));
    } else {
      setNewContact(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" sx={{ color: 'primary.main', mb: 1 }}>
          Контактная информация 📞
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
          Важные номера телефонов и адреса для связи
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Main Contacts */}
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <ContactPhoneIcon />
                </Avatar>
                <Typography variant="h5">Основные контакты</Typography>
              </Box>

              <List>
                {mainContacts.map((contact, index) => (
                  <React.Fragment key={contact.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <PhoneIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="h6">{contact.name}</Typography>
                            <Chip label={contact.relation} size="small" color="primary" />
                          </Box>
                        }
                        secondary={
                          <Typography variant="h6" sx={{ color: 'secondary.main', mt: 1 }}>
                            {contact.phone}
                          </Typography>
                        }
                      />
                      <IconButton onClick={() => handleEditContact(contact)} color="primary">
                        <EditIcon />
                      </IconButton>
                    </ListItem>
                    {index < mainContacts.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Additional Contacts */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Дополнительные контакты</Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => setAddContactDialog(true)}
                  variant="outlined"
                  size="small"
                >
                  Добавить
                </Button>
              </Box>

              {additionalContacts.length === 0 ? (
                <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 2 }}>
                  Дополнительных контактов пока нет
                </Typography>
              ) : (
                <List>
                  {additionalContacts.map((contact, index) => (
                    <React.Fragment key={contact.id}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                          <PhoneIcon color="secondary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={contact.name}
                          secondary={
                            <Box>
                              <Typography variant="body2">{contact.phone}</Typography>
                              <Chip label={contact.relation} size="small" variant="outlined" />
                            </Box>
                          }
                        />
                        <IconButton onClick={() => handleEditContact(contact)} color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteContact(contact.id)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </ListItem>
                      {index < additionalContacts.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Address and Emergency */}
        <Grid item xs={12} md={6}>
          {/* Address */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                    <HomeIcon />
                  </Avatar>
                  <Typography variant="h5">Наш адрес</Typography>
                </Box>
                <IconButton onClick={handleEditAddress} color="primary">
                  <EditIcon />
                </IconButton>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ color: 'primary.main', mb: 2 }}>
                  📍 Домашний адрес
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {addressInfo.street}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {addressInfo.city}, {addressInfo.state} {addressInfo.zipCode}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {addressInfo.country}
                </Typography>
                
                <Paper sx={{ p: 2, backgroundColor: 'grey.50' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                    💡 {addressInfo.directions}
                  </Typography>
                </Paper>
              </Box>
            </CardContent>
          </Card>

          {/* Emergency Services */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>
                  <EmergencyIcon />
                </Avatar>
                <Typography variant="h5">Экстренные службы</Typography>
              </Box>

              <List>
                {emergencyServices.map((service, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ px: 0, alignItems: 'flex-start' }}>
                      <ListItemIcon sx={{ mt: 1 }}>
                        {React.cloneElement(service.icon, { color: 'error' })}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {service.name}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography variant="h6" sx={{ color: 'error.main', my: 1 }}>
                              {service.phone}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {service.description}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < emergencyServices.length - 1 && <Divider sx={{ my: 2 }} />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Important Notes */}
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, color: 'secondary.main' }}>
                📝 Важные заметки
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, backgroundColor: 'primary.light', color: 'white' }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                      🏠 Дома
                    </Typography>
                    <Typography variant="body2">
                      Всегда можно обратиться к соседям, если что-то нужно. 
                      Они очень дружелюбные и готовы помочь.
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, backgroundColor: 'secondary.light', color: 'white' }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                      📱 Мобильная связь
                    </Typography>
                    <Typography variant="body2">
                      Если телефон не работает, можно использовать домашний телефон 
                      или попросить помощи у соседей.
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, backgroundColor: 'warning.main', color: 'white' }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                      🚨 В экстренной ситуации
                    </Typography>
                    <Typography variant="body2">
                      Не стесняйтесь звонить 911 в любой экстренной ситуации. 
                      Это бесплатно и работает 24/7.
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Edit Address Dialog */}
      <Dialog open={editDialog.open && editDialog.type === 'address'} onClose={() => setEditDialog({ open: false, type: '', data: {} })} maxWidth="sm" fullWidth>
        <DialogTitle>Редактировать адрес</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Улица"
                  value={editDialog.data.street || ''}
                  onChange={(e) => handleInputChange('street', e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Город"
                  value={editDialog.data.city || ''}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  label="Штат"
                  value={editDialog.data.state || ''}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  label="Индекс"
                  value={editDialog.data.zipCode || ''}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Описание/Направления"
                  multiline
                  rows={3}
                  value={editDialog.data.directions || ''}
                  onChange={(e) => handleInputChange('directions', e.target.value)}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, type: '', data: {} })}>Отмена</Button>
          <Button onClick={handleSave} variant="contained">Сохранить</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Contact Dialog */}
      <Dialog open={editDialog.open && editDialog.type === 'contact'} onClose={() => setEditDialog({ open: false, type: '', data: {} })} maxWidth="sm" fullWidth>
        <DialogTitle>Редактировать контакт</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Имя"
                  value={editDialog.data.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Телефон"
                  value={editDialog.data.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Отношение"
                  value={editDialog.data.relation || ''}
                  onChange={(e) => handleInputChange('relation', e.target.value)}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, type: '', data: {} })}>Отмена</Button>
          <Button onClick={handleSave} variant="contained">Сохранить</Button>
        </DialogActions>
      </Dialog>

      {/* Add Contact Dialog */}
      <Dialog open={addContactDialog} onClose={() => setAddContactDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Добавить контакт</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Имя"
                  value={newContact.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Телефон"
                  value={newContact.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Отношение"
                  value={newContact.relation}
                  onChange={(e) => handleInputChange('relation', e.target.value)}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddContactDialog(false)}>Отмена</Button>
          <Button onClick={handleAddContact} variant="contained">Добавить</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Contact;
