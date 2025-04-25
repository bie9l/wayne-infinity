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
import { equipmentService } from '../../services/equipment';
import PageContainer from '../../components/PageContainer';
import FormDialog from '../../components/FormDialog';
import SecurityLogger from '../../services/logger';

function Equipment() {
  const dispatch = useDispatch();
  const { equipment, isLoading, error } = useSelector((state) => state.resources);
  const { user } = useSelector((state) => state.auth);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    model: '',
    manufacturer: '',
    serial_number: '',
    status: 'available',
    purchase_date: '',
    warranty_expiry: '',
    last_maintenance: '',
    next_maintenance: '',
    location: '',
    notes: ''
  });

  const EQUIPMENT_TYPES = [
    { value: 'tool', label: 'Ferramenta' },
    { value: 'machine', label: 'Máquina' },
    { value: 'safety', label: 'Equipamento de Segurança' },
    { value: 'electronic', label: 'Equipamento Eletrônico' },
    { value: 'other', label: 'Outro' }
  ];

  const STATUS_OPTIONS = [
    { value: 'available', label: 'Disponível' },
    { value: 'in_use', label: 'Em Uso' },
    { value: 'maintenance', label: 'Em Manutenção' },
    { value: 'retired', label: 'Aposentado' }
  ];

  // Verifica as permissões do usuário
  // eslint-disable-next-line no-unused-vars
  const canViewEquipment = ['employee', 'manager', 'security_admin', 'admin'].includes(user?.user_type);
  const canManageEquipment = ['manager', 'security_admin', 'admin'].includes(user?.user_type);
  const canDeleteEquipment = ['security_admin', 'admin'].includes(user?.user_type);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        dispatch(fetchStart());
        const data = await equipmentService.getAll();
        dispatch(fetchSuccess({ type: 'equipment', data }));
      } catch (err) {
        dispatch(fetchFailure(err.message));
      }
    };
    fetchEquipment();
  }, [dispatch]);

  const handleOpenDialog = (equipment = null) => {
    if (equipment) {
      setEditingEquipment(equipment);
      setFormData(equipment);
    } else {
      setEditingEquipment(null);
      setFormData({
        name: '',
        type: '',
        model: '',
        manufacturer: '',
        serial_number: '',
        status: 'available',
        purchase_date: '',
        warranty_expiry: '',
        last_maintenance: '',
        next_maintenance: '',
        location: '',
        notes: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingEquipment(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Tratamento especial para campos de data
    if (name === 'purchase_date' || name === 'warranty_expiry' || 
        name === 'last_maintenance' || name === 'next_maintenance') {
      setFormData(prev => ({
        ...prev,
        [name]: value || null // Se o valor estiver vazio, define como null
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validação dos campos obrigatórios
      if (!formData.name || !formData.type || !formData.model || !formData.manufacturer || 
          !formData.serial_number || !formData.status || !formData.location) {
        dispatch(fetchFailure('Todos os campos obrigatórios devem ser preenchidos'));
        return;
      }

      // Preparar dados para envio, tratando campos de data
      const dataToSend = {
        ...formData,
        purchase_date: formData.purchase_date || null,
        warranty_expiry: formData.warranty_expiry || null,
        last_maintenance: formData.last_maintenance || null,
        next_maintenance: formData.next_maintenance || null
      };

      if (editingEquipment) {
        const updatedEquipment = await equipmentService.update(editingEquipment.id, dataToSend);
        dispatch(updateItem({ type: 'equipment', item: updatedEquipment }));
        
        // Registrar log de atualização
        await SecurityLogger.logEquipmentUpdated(
          updatedEquipment,
          '127.0.0.1' // TODO: Pegar IP real
        );
      } else {
        const newEquipment = await equipmentService.create(dataToSend);
        dispatch(addItem({ type: 'equipment', item: newEquipment }));
        
        // Registrar log de criação
        await SecurityLogger.logEquipmentCreated(
          newEquipment,
          '127.0.0.1' // TODO: Pegar IP real
        );
      }
      handleCloseDialog();
    } catch (err) {
      console.error('Erro completo:', err);
      dispatch(fetchFailure(err.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este equipamento?')) {
      try {
        await equipmentService.delete(id);
        dispatch(removeItem({ type: 'equipment', id }));
        
        // Registrar log de exclusão
        await SecurityLogger.logEquipmentDeleted(
          id,
          '127.0.0.1' // TODO: Pegar IP real
        );
      } catch (err) {
        dispatch(fetchFailure(err.message));
      }
    }
  };

  if (isLoading) return <Typography>Carregando...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <PageContainer title="Equipamentos">
      {canManageEquipment && (
        <Box mb={3}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Novo Equipamento
          </Button>
        </Box>
      )}

      <Grid container spacing={3}>
        {equipment.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {item.name}
                </Typography>
                <Typography color="textSecondary">
                  Tipo: {EQUIPMENT_TYPES.find(t => t.value === item.type)?.label || item.type}
                </Typography>
                <Typography color="textSecondary">
                  Modelo: {item.model}
                </Typography>
                <Typography color="textSecondary">
                  Fabricante: {item.manufacturer}
                </Typography>
                <Typography color="textSecondary">
                  Número de Série: {item.serial_number}
                </Typography>
                <Typography color="textSecondary">
                  Status: {STATUS_OPTIONS.find(s => s.value === item.status)?.label || item.status}
                </Typography>
                <Typography color="textSecondary">
                  Localização: {item.location}
                </Typography>
              </CardContent>
              {canManageEquipment && (
                <CardActions>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(item)}
                  >
                    <EditIcon />
                  </IconButton>
                  {canDeleteEquipment && (
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(item.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </CardActions>
              )}
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
              select
              name="type"
              label="Tipo"
              fullWidth
              value={formData.type}
              onChange={handleChange}
              required
            >
              {EQUIPMENT_TYPES.map((option) => (
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
              name="serial_number"
              label="Número de Série"
              fullWidth
              value={formData.serial_number}
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
              name="purchase_date"
              label="Data de Compra"
              type="date"
              fullWidth
              value={formData.purchase_date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="warranty_expiry"
              label="Fim da Garantia"
              type="date"
              fullWidth
              value={formData.warranty_expiry}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
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
              name="notes"
              label="Observações"
              multiline
              rows={4}
              fullWidth
              value={formData.notes}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </FormDialog>
    </PageContainer>
  );
}

export default Equipment; 