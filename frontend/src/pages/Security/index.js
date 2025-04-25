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
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStart, fetchSuccess, fetchFailure } from '../../store/slices/securitySlice';
import { securityService } from '../../services/security';
import SecurityLogger from '../../services/logger';
import PageContainer from '../../components/PageContainer';
import FormDialog from '../../components/FormDialog';

function TabPanel({ children, value, index }) {
  return value === index ? children : null;
}

function Security() {
  const dispatch = useDispatch();
  const { alerts = [], logs = [], isLoading, error } = useSelector((state) => state.security);
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'low',
    status: 'open',
    location: '',
    affected_assets: '',
    notes: ''
  });

  const SECURITY_LEVELS = [
    { value: 'low', label: 'Baixa' },
    { value: 'medium', label: 'Média' },
    { value: 'high', label: 'Alta' },
    { value: 'critical', label: 'Crítica' }
  ];

  const ALERT_STATUS = [
    { value: 'open', label: 'Aberto' },
    { value: 'investigating', label: 'Em Investigação' },
    { value: 'resolved', label: 'Resolvido' },
    { value: 'closed', label: 'Fechado' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(fetchStart());
        const [incidentsData, logsData] = await Promise.all([
          securityService.getAlerts(),
          securityService.getLogs()
        ]);
        dispatch(fetchSuccess({ 
          type: 'alerts', 
          data: incidentsData 
        }));
        dispatch(fetchSuccess({ 
          type: 'logs', 
          data: logsData 
        }));
      } catch (err) {
        dispatch(fetchFailure(err.message));
      }
    };
    fetchData();
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        description: '',
        severity: 'low',
        status: 'open',
        location: '',
        affected_assets: '',
        notes: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Tratamento especial para campos de data
    if (name === 'date') {
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
      if (!formData.title || !formData.description || !formData.severity || !formData.status) {
        dispatch(fetchFailure('Todos os campos obrigatórios devem ser preenchidos'));
        return;
      }

      // Preparar dados para envio
      const dataToSend = {
        ...formData,
        reported_by: 'Sistema', // TODO: Pegar do usuário logado
        reported_at: new Date().toISOString()
      };

      if (editingItem) {
        const updatedAlert = await securityService.updateAlert(editingItem.id, dataToSend);
        dispatch(fetchSuccess({ type: 'alerts', data: alerts.map(a => a.id === editingItem.id ? updatedAlert : a) }));
        
        try {
          // Registrar log de atualização
          await SecurityLogger.logIncidentUpdated(
            updatedAlert,
            '127.0.0.1' // TODO: Pegar IP real
          );
        } catch (logError) {
          console.error('Erro ao registrar log de atualização:', logError);
        }
      } else {
        const newAlert = await securityService.createAlert(dataToSend);
        dispatch(fetchSuccess({ type: 'alerts', data: [newAlert, ...alerts] }));
        
        try {
          // Registrar log de criação
          await SecurityLogger.logIncidentCreated(
            newAlert,
            '127.0.0.1' // TODO: Pegar IP real
          );
        } catch (logError) {
          console.error('Erro ao registrar log de criação:', logError);
        }
      }
      handleCloseDialog();
    } catch (err) {
      console.error('Erro completo:', err);
      dispatch(fetchFailure(err.message));
    }
  };

  const handleDelete = async (id) => {
    const confirmMessage = tabValue === 0
      ? 'Tem certeza que deseja excluir este alerta?'
      : 'Tem certeza que deseja excluir este log?';

    if (window.confirm(confirmMessage)) {
      try {
        if (tabValue === 0) {
          await securityService.deleteAlert(id);
          dispatch(fetchSuccess({ type: 'alerts', data: alerts.filter(a => a.id !== id) }));
          
          // Registrar log de exclusão
          await SecurityLogger.logIncidentDeleted(
            id,
            '127.0.0.1' // TODO: Pegar IP real
          );
        } else {
          await securityService.deleteLog(id);
          dispatch(fetchSuccess({ type: 'logs', data: logs.filter(l => l.id !== id) }));
        }
      } catch (err) {
        dispatch(fetchFailure(err.message));
      }
    }
  };

  const renderCard = (item) => (
    <Grid item xs={12} sm={6} md={4} key={item.id}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {item.title}
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            {item.description}
          </Typography>
          <Typography color="textSecondary">
            Severidade: {SECURITY_LEVELS.find(l => l.value === item.severity)?.label || item.severity}
          </Typography>
          <Typography color="textSecondary">
            Status: {ALERT_STATUS.find(s => s.value === item.status)?.label || item.status}
          </Typography>
          {item.location && (
            <Typography color="textSecondary">
              Local: {item.location}
            </Typography>
          )}
          {item.affected_assets && (
            <Typography color="textSecondary">
              Ativos Afetados: {item.affected_assets}
            </Typography>
          )}
          {item.reported_at && (
            <Typography color="textSecondary">
              Reportado em: {new Date(item.reported_at).toLocaleDateString()}
            </Typography>
          )}
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
  );

  if (isLoading) return <Typography>Carregando...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <PageContainer title="Segurança">
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Incidentes" />
        <Tab label="Logs" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <Box mb={3}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            color="error"
          >
            Novo Incidente
          </Button>
        </Box>
        <Grid container spacing={3}>
          {alerts && alerts.length > 0 ? (
            alerts.map(renderCard)
          ) : (
            <Grid item xs={12}>
              <Typography color="textSecondary" align="center">
                Nenhum incidente registrado
              </Typography>
            </Grid>
          )}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          {logs && logs.length > 0 ? (
            logs.map((log) => (
              <Grid item xs={12} sm={6} md={4} key={log.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {log.event_type}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      {log.description}
                    </Typography>
                    <Typography color="textSecondary">
                      Usuário: {log.user}
                    </Typography>
                    <Typography color="textSecondary">
                      IP: {log.ip_address}
                    </Typography>
                    {log.location && (
                      <Typography color="textSecondary">
                        Local: {log.location}
                      </Typography>
                    )}
                    <Typography color="textSecondary">
                      Data: {new Date(log.created_at).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography color="textSecondary" align="center">
                Nenhum log registrado
              </Typography>
            </Grid>
          )}
        </Grid>
      </TabPanel>

      <FormDialog
        open={openDialog}
        onClose={handleCloseDialog}
        title={editingItem ? "Editar Incidente" : "Novo Incidente"}
        onSubmit={handleSubmit}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="title"
              label="Título"
              fullWidth
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="description"
              label="Descrição"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              name="severity"
              label="Severidade"
              fullWidth
              value={formData.severity}
              onChange={handleChange}
              required
            >
              {SECURITY_LEVELS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
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
              {ALERT_STATUS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="location"
              label="Local"
              fullWidth
              value={formData.location}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="affected_assets"
              label="Ativos Afetados"
              fullWidth
              multiline
              rows={2}
              value={formData.affected_assets}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="notes"
              label="Observações"
              fullWidth
              multiline
              rows={4}
              value={formData.notes}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </FormDialog>
    </PageContainer>
  );
}

export default Security; 