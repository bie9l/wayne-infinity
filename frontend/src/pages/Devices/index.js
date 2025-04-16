import React, { useState } from 'react';
import {
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Box,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import PageContainer from '../../components/PageContainer';
import FormDialog from '../../components/FormDialog';

function Devices() {
  const [devices, setDevices] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    location: '',
    status: '',
    isActive: true,
    ipAddress: '',
  });

  const deviceTypes = [
    'Câmera',
    'Sensor de Movimento',
    'Sensor de Presença',
    'Controle de Acesso',
    'Alarme',
    'Outro',
  ];

  const statusOptions = [
    'Online',
    'Offline',
    'Manutenção',
    'Erro',
  ];

  const handleOpenDialog = (device = null) => {
    if (device) {
      setEditingDevice(device);
      setFormData(device);
    } else {
      setEditingDevice(null);
      setFormData({
        name: '',
        type: '',
        location: '',
        status: '',
        isActive: true,
        ipAddress: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingDevice(null);
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingDevice) {
      setDevices(devices.map((d) =>
        d.id === editingDevice.id ? { ...formData, id: d.id } : d
      ));
    } else {
      setDevices([...devices, { ...formData, id: Date.now() }]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este dispositivo?')) {
      setDevices(devices.filter((d) => d.id !== id));
    }
  };

  return (
    <PageContainer title="Dispositivos">
      <Box mb={3}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Novo Dispositivo
        </Button>
      </Box>

      <Grid container spacing={3}>
        {devices.map((device) => (
          <Grid item xs={12} sm={6} md={4} key={device.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {device.name}
                </Typography>
                <Typography color="textSecondary">
                  Tipo: {device.type}
                </Typography>
                <Typography color="textSecondary">
                  Localização: {device.location}
                </Typography>
                <Typography color="textSecondary">
                  Status: {device.status}
                </Typography>
                <Typography color="textSecondary">
                  IP: {device.ipAddress}
                </Typography>
                <Typography color="textSecondary">
                  Estado: {device.isActive ? 'Ativo' : 'Inativo'}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton
                  size="small"
                  onClick={() => handleOpenDialog(device)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDelete(device.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <FormDialog
        open={openDialog}
        onClose={handleCloseDialog}
        title={editingDevice ? "Editar Dispositivo" : "Novo Dispositivo"}
        onSubmit={handleSubmit}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="name"
              label="Nome"
              fullWidth
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="type"
              label="Tipo"
              fullWidth
              select
              value={formData.type}
              onChange={handleChange}
              required
            >
              {deviceTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="location"
              label="Localização"
              fullWidth
              value={formData.location}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="status"
              label="Status"
              fullWidth
              select
              value={formData.status}
              onChange={handleChange}
              required
            >
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="ipAddress"
              label="Endereço IP"
              fullWidth
              value={formData.ipAddress}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={handleChange}
                  name="isActive"
                />
              }
              label="Dispositivo Ativo"
            />
          </Grid>
        </Grid>
      </FormDialog>
    </PageContainer>
  );
}

export default Devices; 