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
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import PageContainer from '../../components/PageContainer';
import FormDialog from '../../components/FormDialog';

function TabPanel({ children, value, index }) {
  return value === index ? children : null;
}

function Security() {
  const [tabValue, setTabValue] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const [restrictedAreas, setRestrictedAreas] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    level: '',
    status: '',
  });

  const securityLevels = [
    'Baixo',
    'Médio',
    'Alto',
    'Crítico',
  ];

  const alertStatus = [
    'Ativo',
    'Em Investigação',
    'Resolvido',
    'Arquivado',
  ];

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
        name: '',
        description: '',
        level: '',
        status: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = { ...formData, id: editingItem?.id || Date.now() };
    
    if (tabValue === 0) { // Alertas
      if (editingItem) {
        setAlerts(alerts.map((a) => a.id === editingItem.id ? newItem : a));
      } else {
        setAlerts([...alerts, newItem]);
      }
    } else { // Áreas Restritas
      if (editingItem) {
        setRestrictedAreas(restrictedAreas.map((a) => a.id === editingItem.id ? newItem : a));
      } else {
        setRestrictedAreas([...restrictedAreas, newItem]);
      }
    }
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    const confirmMessage = tabValue === 0
      ? 'Tem certeza que deseja excluir este alerta?'
      : 'Tem certeza que deseja excluir esta área restrita?';

    if (window.confirm(confirmMessage)) {
      if (tabValue === 0) {
        setAlerts(alerts.filter((a) => a.id !== id));
      } else {
        setRestrictedAreas(restrictedAreas.filter((a) => a.id !== id));
      }
    }
  };

  const renderCard = (item) => (
    <Grid item xs={12} sm={6} md={4} key={item.id}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {item.name}
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            {item.description}
          </Typography>
          <Typography color="textSecondary">
            Nível: {item.level}
          </Typography>
          <Typography color="textSecondary">
            Status: {item.status}
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
  );

  return (
    <PageContainer title="Segurança">
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Alertas" />
        <Tab label="Áreas Restritas" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <Box mb={3}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            color="error"
          >
            Novo Alerta
          </Button>
        </Box>
        <Grid container spacing={3}>
          {alerts.map(renderCard)}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box mb={3}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Nova Área Restrita
          </Button>
        </Box>
        <Grid container spacing={3}>
          {restrictedAreas.map(renderCard)}
        </Grid>
      </TabPanel>

      <FormDialog
        open={openDialog}
        onClose={handleCloseDialog}
        title={editingItem
          ? `Editar ${tabValue === 0 ? 'Alerta' : 'Área Restrita'}`
          : `Novo ${tabValue === 0 ? 'Alerta' : 'Área Restrita'}`}
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
              name="level"
              label="Nível"
              fullWidth
              select
              value={formData.level}
              onChange={handleChange}
              required
            >
              {securityLevels.map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </TextField>
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
              {alertStatus.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </FormDialog>
    </PageContainer>
  );
}

export default Security; 