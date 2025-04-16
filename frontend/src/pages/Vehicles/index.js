import React, { useState, useEffect } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { fetchStart, fetchSuccess, fetchFailure, addItem, updateItem, removeItem } from '../../store/slices/resourcesSlice';
import { vehicleService } from '../../services/vehicles';
import PageContainer from '../../components/PageContainer';
import FormDialog from '../../components/FormDialog';

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Ativo' },
  { value: 'MAINTENANCE', label: 'Em Manutenção' },
  { value: 'INACTIVE', label: 'Inativo' }
];

const FUEL_OPTIONS = [
  { value: 'GASOLINE', label: 'Gasolina' },
  { value: 'ETHANOL', label: 'Etanol' },
  { value: 'DIESEL', label: 'Diesel' },
  { value: 'FLEX', label: 'Flex' },
  { value: 'ELECTRIC', label: 'Elétrico' },
  { value: 'HYBRID', label: 'Híbrido' }
];

const TYPE_OPTIONS = [
  { value: 'car', label: 'Carro' },
  { value: 'motorcycle', label: 'Motocicleta' },
  { value: 'truck', label: 'Caminhão' },
  { value: 'van', label: 'Van' },
  { value: 'other', label: 'Outro' }
];

function Vehicles() {
  const dispatch = useDispatch();
  const { vehicles, isLoading, error } = useSelector((state) => state.resources);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    model: '',
    manufacturer: '',
    year: '',
    license_plate: '',
    vin: '',
    status: '',
    mileage: '',
    fuel_type: '',
    last_maintenance: '',
    next_maintenance: '',
    notes: '',
    color: ''
  });

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        dispatch(fetchStart());
        const data = await vehicleService.getAll();
        dispatch(fetchSuccess({ type: 'vehicles', data }));
      } catch (err) {
        dispatch(fetchFailure(err.message));
      }
    };
    fetchVehicles();
  }, [dispatch]);

  const handleOpenDialog = (vehicle = null) => {
    if (vehicle) {
      setEditingVehicle(vehicle);
      setFormData(vehicle);
    } else {
      setEditingVehicle(null);
      setFormData({
        name: '',
        type: '',
        model: '',
        manufacturer: '',
        year: '',
        license_plate: '',
        vin: '',
        status: '',
        mileage: '',
        fuel_type: '',
        last_maintenance: '',
        next_maintenance: '',
        notes: '',
        color: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingVehicle(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingVehicle) {
        const updatedVehicle = await vehicleService.update(editingVehicle.id, formData);
        dispatch(updateItem({ type: 'vehicles', item: updatedVehicle }));
      } else {
        const newVehicle = await vehicleService.create(formData);
        dispatch(addItem({ type: 'vehicles', item: newVehicle }));
      }
      handleCloseDialog();
    } catch (err) {
      dispatch(fetchFailure(err.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este veículo?')) {
      try {
        await vehicleService.delete(id);
        dispatch(removeItem({ type: 'vehicles', id }));
      } catch (err) {
        dispatch(fetchFailure(err.message));
      }
    }
  };

  if (isLoading) return <Typography>Carregando...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <PageContainer title="Veículos">
      <Box mb={3}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Novo Veículo
        </Button>
      </Box>

      <Grid container spacing={3}>
        {vehicles.map((vehicle) => (
          <Grid item xs={12} sm={6} md={4} key={vehicle.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {vehicle.name}
                </Typography>
                <Typography color="textSecondary">
                  Tipo: {TYPE_OPTIONS.find(t => t.value === vehicle.type)?.label || vehicle.type}
                </Typography>
                <Typography color="textSecondary">
                  Modelo: {vehicle.model}
                </Typography>
                <Typography color="textSecondary">
                  Fabricante: {vehicle.manufacturer}
                </Typography>
                <Typography color="textSecondary">
                  Placa: {vehicle.license_plate}
                </Typography>
                <Typography color="textSecondary">
                  Status: {STATUS_OPTIONS.find(s => s.value === vehicle.status)?.label || vehicle.status}
                </Typography>
                <Typography color="textSecondary">
                  Combustível: {FUEL_OPTIONS.find(f => f.value === vehicle.fuel_type)?.label || vehicle.fuel_type}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton
                  size="small"
                  onClick={() => handleOpenDialog(vehicle)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDelete(vehicle.id)}
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
        title={editingVehicle ? "Editar Veículo" : "Novo Veículo"}
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
              select
              name="type"
              label="Tipo"
              fullWidth
              value={formData.type}
              onChange={handleChange}
              required
            >
              {TYPE_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="model"
              label="Modelo"
              fullWidth
              value={formData.model}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="manufacturer"
              label="Fabricante"
              fullWidth
              value={formData.manufacturer}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="year"
              label="Ano"
              type="number"
              fullWidth
              value={formData.year}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="license_plate"
              label="Placa"
              fullWidth
              value={formData.license_plate}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="vin"
              label="Número do Chassi"
              fullWidth
              value={formData.vin}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              name="status"
              label="Status"
              fullWidth
              value={formData.status}
              onChange={handleChange}
              required
            >
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="mileage"
              label="Quilometragem"
              type="number"
              fullWidth
              value={formData.mileage}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              name="fuel_type"
              label="Tipo de Combustível"
              fullWidth
              value={formData.fuel_type}
              onChange={handleChange}
              required
            >
              {FUEL_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="last_maintenance"
              label="Última Manutenção"
              type="date"
              fullWidth
              value={formData.last_maintenance}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="next_maintenance"
              label="Próxima Manutenção"
              type="date"
              fullWidth
              value={formData.next_maintenance}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="notes"
              label="Observações"
              multiline
              rows={4}
              fullWidth
              value={formData.notes}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="color"
              label="Cor"
              fullWidth
              value={formData.color}
              onChange={handleChange}
              required
            />
          </Grid>
        </Grid>
      </FormDialog>
    </PageContainer>
  );
}

export default Vehicles; 