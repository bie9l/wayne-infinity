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
import { deviceService } from '../../services/devices';
import SecurityLogger from '../../services/logger';
import PageContainer from '../../components/PageContainer';
import FormDialog from '../../components/FormDialog';

function Devices() {
  const dispatch = useDispatch();
  const { securityDevices: devices, isLoading, error } = useSelector((state) => state.resources);
  const { user } = useSelector((state) => state.auth);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    model: '',
    manufacturer: '',
    serial_number: '',
    status: 'active',
    ip_address: '',
    mac_address: '',
    os: '',
    os_version: '',
    purchase_date: '',
    warranty_expiry: '',
    last_maintenance: '',
    assigned_to: '',
    location: '',
    notes: ''
  });

  const DEVICE_TYPES = [
    { value: 'mobile', label: 'Dispositivo Móvel' },
    { value: 'desktop', label: 'Computador Desktop' },
    { value: 'laptop', label: 'Notebook' },
    { value: 'tablet', label: 'Tablet' },
    { value: 'printer', label: 'Impressora' },
    { value: 'network', label: 'Equipamento de Rede' },
    { value: 'other', label: 'Outro' }
  ];

  const STATUS_OPTIONS = [
    { value: 'active', label: 'Ativo' },
    { value: 'inactive', label: 'Inativo' },
    { value: 'maintenance', label: 'Em Manutenção' },
    { value: 'retired', label: 'Aposentado' }
  ];

  // Verifica as permissões do usuário
  // eslint-disable-next-line no-unused-vars
  const canViewDevices = ['employee', 'manager', 'security_admin', 'admin'].includes(user?.user_type);
  const canManageDevices = ['manager', 'security_admin', 'admin'].includes(user?.user_type);
  // eslint-disable-next-line no-unused-vars
  const canDeleteDevices = ['security_admin', 'admin'].includes(user?.user_type);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        dispatch(fetchStart());
        const data = await deviceService.getAll();
        dispatch(fetchSuccess({ type: 'securityDevices', data }));
      } catch (err) {
        dispatch(fetchFailure(err.message));
      }
    };
    fetchDevices();
  }, [dispatch]);

  const handleOpenDialog = (device = null) => {
    if (device) {
      setEditingDevice(device);
      setFormData(device);
    } else {
      setEditingDevice(null);
      setFormData({
        name: '',
        type: '',
        model: '',
        manufacturer: '',
        serial_number: '',
        status: 'active',
        ip_address: '',
        mac_address: '',
        os: '',
        os_version: '',
        purchase_date: '',
        warranty_expiry: '',
        last_maintenance: '',
        assigned_to: '',
        location: '',
        notes: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingDevice(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Tratamento especial para campos de data e ip_address
    if (name === 'purchase_date' || name === 'warranty_expiry' || name === 'last_maintenance') {
      setFormData(prev => ({
        ...prev,
        [name]: value || null
      }));
    } else if (name === 'ip_address') {
      setFormData(prev => ({
        ...prev,
        [name]: value || null
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

      // Preparar dados para envio, tratando campos de data e ip_address
      const dataToSend = {
        ...formData,
        purchase_date: formData.purchase_date || null,
        warranty_expiry: formData.warranty_expiry || null,
        last_maintenance: formData.last_maintenance || null,
        ip_address: formData.ip_address || null
      };

      console.log('Dados sendo enviados:', dataToSend);

      if (editingDevice) {
        const updatedDevice = await deviceService.update(editingDevice.id, dataToSend);
        dispatch(updateItem({ type: 'securityDevices', item: updatedDevice }));
        
        // Registrar log de atualização
        await SecurityLogger.logDeviceUpdated(
          updatedDevice,
          '127.0.0.1' // TODO: Pegar IP real
        );
      } else {
        const newDevice = await deviceService.create(dataToSend);
        dispatch(addItem({ type: 'securityDevices', item: newDevice }));
        
        // Registrar log de criação
        await SecurityLogger.logDeviceCreated(
          newDevice,
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
    if (window.confirm('Tem certeza que deseja excluir este dispositivo?')) {
      try {
        await deviceService.delete(id);
        dispatch(removeItem({ type: 'securityDevices', id }));
        
        // Registrar log de exclusão
        await SecurityLogger.logDeviceDeleted(
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
    <PageContainer title="Dispositivos de Segurança">
      {canManageDevices && (
        <Box mb={3}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Novo Dispositivo
          </Button>
        </Box>
      )}

      <Grid container spacing={3}>
        {devices.map((device) => (
          <Grid item xs={12} sm={6} md={4} key={device.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {device.name}
                </Typography>
                <Typography color="textSecondary">
                  Tipo: {DEVICE_TYPES.find(t => t.value === device.type)?.label || device.type}
                </Typography>
                <Typography color="textSecondary">
                  Modelo: {device.model}
                </Typography>
                <Typography color="textSecondary">
                  Fabricante: {device.manufacturer}
                </Typography>
                <Typography color="textSecondary">
                  Número de Série: {device.serial_number}
                </Typography>
                <Typography color="textSecondary">
                  Status: {STATUS_OPTIONS.find(s => s.value === device.status)?.label || device.status}
                </Typography>
                <Typography color="textSecondary">
                  Localização: {device.location}
                </Typography>
              </CardContent>
              {canManageDevices && (
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
              )}
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
              select
              name="type"
              label="Tipo"
              fullWidth
              value={formData.type}
              onChange={handleChange}
              required
            >
              {DEVICE_TYPES.map((option) => (
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
              name="ip_address"
              label="Endereço IP"
              fullWidth
              value={formData.ip_address || ''}
              onChange={handleChange}
              placeholder="Ex: 192.168.1.1"
              helperText="Formato: xxx.xxx.xxx.xxx"
              error={formData.ip_address && !/^(\d{1,3}\.){3}\d{1,3}$/.test(formData.ip_address)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="mac_address"
              label="Endereço MAC"
              fullWidth
              value={formData.mac_address}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="os"
              label="Sistema Operacional"
              fullWidth
              value={formData.os}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="os_version"
              label="Versão do SO"
              fullWidth
              value={formData.os_version}
              onChange={handleChange}
            />
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
              name="assigned_to"
              label="Atribuído a"
              fullWidth
              value={formData.assigned_to}
              onChange={handleChange}
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

export default Devices; 