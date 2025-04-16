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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import PageContainer from '../../components/PageContainer';
import FormDialog from '../../components/FormDialog';

function Equipment() {
  const [equipment, setEquipment] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    serialNumber: '',
    status: '',
    location: '',
  });

  const equipmentTypes = [
    'Armamento',
    'Proteção',
    'Comunicação',
    'Investigação',
    'Transporte',
    'Outro',
  ];

  const statusOptions = [
    'Disponível',
    'Em Uso',
    'Em Manutenção',
    'Danificado',
    'Inativo',
  ];

  const handleOpenDialog = (equipment = null) => {
    if (equipment) {
      setEditingEquipment(equipment);
      setFormData(equipment);
    } else {
      setEditingEquipment(null);
      setFormData({
        name: '',
        type: '',
        serialNumber: '',
        status: '',
        location: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingEquipment(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingEquipment) {
      setEquipment(equipment.map((eq) =>
        eq.id === editingEquipment.id ? { ...formData, id: eq.id } : eq
      ));
    } else {
      setEquipment([...equipment, { ...formData, id: Date.now() }]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este equipamento?')) {
      setEquipment(equipment.filter((eq) => eq.id !== id));
    }
  };

  return (
    <PageContainer title="Equipamentos">
      <Box mb={3}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Novo Equipamento
        </Button>
      </Box>

      <Grid container spacing={3}>
        {equipment.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {item.name}
                </Typography>
                <Typography color="textSecondary">
                  Tipo: {item.type}
                </Typography>
                <Typography color="textSecondary">
                  Número de Série: {item.serialNumber}
                </Typography>
                <Typography color="textSecondary">
                  Status: {item.status}
                </Typography>
                <Typography color="textSecondary">
                  Localização: {item.location}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton
                  size="small"
                  onClick={() => handleOpenDialog(item)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDelete(item.id)}
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
        title={editingEquipment ? "Editar Equipamento" : "Novo Equipamento"}
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
              {equipmentTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="serialNumber"
              label="Número de Série"
              fullWidth
              value={formData.serialNumber}
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
              name="location"
              label="Localização"
              fullWidth
              value={formData.location}
              onChange={handleChange}
              required
            />
          </Grid>
        </Grid>
      </FormDialog>
    </PageContainer>
  );
}

export default Equipment; 