import React, { useEffect, useState } from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  useTheme,
  Box,
  IconButton,
  Tooltip,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Info as InfoIcon
} from '@mui/icons-material';
import { resourcesService } from '../../services/api';
import PageContainer from '../../components/PageContainer';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

function Dashboard() {
  const theme = useTheme();
  const [data, setData] = useState({
    summary: {
      total_vehicles: 0,
      total_equipment: 0,
      total_devices: 0
    },
    vehicles: {
      total: 0,
      by_status: {}
    },
    equipment: {
      total: 0,
      by_type: {}
    },
    devices: {
      total: 0,
      by_status: {}
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('day');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await resourcesService.getDashboard();
        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedTimeRange]);

  const cardStyle = {
    background: theme.palette.background.paper,
    borderRadius: 8,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  };

  const headerStyle = {
    color: '#1a237e',
    fontWeight: 'bold',
    fontSize: '1.5rem',
    mb: 3,
  };

  const prepareChartData = (data, type) => {
    return Object.entries(data).map(([name, value]) => ({
      name,
      value,
      type
    }));
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
          <Typography variant="subtitle2">{label}</Typography>
          <Typography variant="body2" color="primary">
            {payload[0].value} {payload[0].payload.type}
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  const getStatusInfo = (status, count, total) => {
    const percentage = ((count / total) * 100).toFixed(1);
    return `Status: ${status}\nQuantidade: ${count}\nPercentual: ${percentage}%`;
  };

  const getTypeInfo = (type, count, total) => {
    const percentage = ((count / total) * 100).toFixed(1);
    return `Tipo: ${type}\nQuantidade: ${count}\nPercentual: ${percentage}%`;
  };

  if (isLoading) return <Typography>Carregando...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <PageContainer>
      <Box sx={{ p: 3 }}>
        {/* Tabs de Período */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs value={selectedTimeRange} onChange={(e, v) => setSelectedTimeRange(v)}>
            <Tab label="DIÁRIO" value="day" />
            <Tab label="SEMANAL" value="week" />
            <Tab label="MENSAL" value="month" />
          </Tabs>
        </Box>

        {/* Resumo Geral */}
        <Typography variant="h4" sx={headerStyle}>
          Resumo Geral
        </Typography>

        <Grid container spacing={4}>
          {/* Cards à esquerda */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Card sx={cardStyle}>
                  <CardContent>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle1" color="textSecondary">
                          Total de Veículos
                        </Typography>
                        <Tooltip title="Número total de veículos cadastrados">
                          <IconButton size="small">
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                    <Typography variant="h3" color="primary">
                      {data.summary.total_vehicles}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Card sx={cardStyle}>
                  <CardContent>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle1" color="textSecondary">
                          Total de Equipamentos
                        </Typography>
                        <Tooltip title="Número total de equipamentos cadastrados">
                          <IconButton size="small">
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                    <Typography variant="h3" color="primary">
                      {data.summary.total_equipment}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Card sx={cardStyle}>
                  <CardContent>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle1" color="textSecondary">
                          Total de Dispositivos
                        </Typography>
                        <Tooltip title="Número total de dispositivos cadastrados">
                          <IconButton size="small">
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                    <Typography variant="h3" color="primary">
                      {data.summary.total_devices}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          {/* Gráfico à direita */}
          <Grid item xs={12} md={4}>
            <Card sx={cardStyle}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle1">
                    Distribuição de Recursos
                  </Typography>
                  <Tooltip title="Este gráfico mostra a distribuição total de recursos no sistema">
                    <IconButton size="small">
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box sx={{ height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: 'Veículos', value: data.summary.total_vehicles },
                      { name: 'Equipamentos', value: data.summary.total_equipment },
                      { name: 'Dispositivos', value: data.summary.total_devices }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" fill="#1a237e" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Veículos */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" sx={headerStyle}>
            Veículos por Status
          </Typography>

          <Grid container spacing={3}>
            {/* Cards de Status */}
            {Object.entries(data.vehicles.by_status).map(([status, count]) => (
              <Grid item xs={12} sm={6} md={3} key={status}>
                <Card sx={cardStyle}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" gutterBottom color="textSecondary">
                        {status}
                      </Typography>
                      <Tooltip title={getStatusInfo(status, count, data.vehicles.total)}>
                        <IconButton size="small">
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Typography variant="h3" color="primary" sx={{ mt: 2 }}>
                      {count}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            {/* Gráfico de Pizza */}
            <Grid item xs={12} sx={{ mt: 4 }}>
              <Card sx={cardStyle}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6">Distribuição por Status</Typography>
                    <Tooltip title="Este gráfico mostra a distribuição percentual dos veículos por status">
                      <IconButton size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box sx={{ height: 300, mt: 2 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={prepareChartData(data.vehicles.by_status, 'veículos')}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {prepareChartData(data.vehicles.by_status, 'veículos').map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Equipamentos */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" sx={headerStyle}>
            Equipamentos por Tipo
          </Typography>

          <Grid container spacing={3}>
            {/* Cards de Tipo */}
            {Object.entries(data.equipment.by_type).map(([type, count]) => (
              <Grid item xs={12} sm={6} md={3} key={type}>
                <Card sx={cardStyle}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" gutterBottom color="textSecondary">
                        {type}
                      </Typography>
                      <Tooltip title={getTypeInfo(type, count, data.equipment.total)}>
                        <IconButton size="small">
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Typography variant="h3" color="primary" sx={{ mt: 2 }}>
                      {count}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            {/* Gráfico de Pizza */}
            <Grid item xs={12} sx={{ mt: 4 }}>
              <Card sx={cardStyle}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6">Distribuição por Tipo</Typography>
                    <Tooltip title="Este gráfico mostra a distribuição percentual dos equipamentos por tipo">
                      <IconButton size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box sx={{ height: 300, mt: 2 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={prepareChartData(data.equipment.by_type, 'equipamentos')}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {prepareChartData(data.equipment.by_type, 'equipamentos').map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Dispositivos */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={headerStyle}>
            Dispositivos por Status
          </Typography>

          <Grid container spacing={3}>
            {/* Cards de Status */}
            {Object.entries(data.devices.by_status).map(([status, count]) => (
              <Grid item xs={12} sm={6} md={3} key={status}>
                <Card sx={cardStyle}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" gutterBottom color="textSecondary">
                        {status}
                      </Typography>
                      <Tooltip title={getStatusInfo(status, count, data.devices.total)}>
                        <IconButton size="small">
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Typography variant="h3" color="primary" sx={{ mt: 2 }}>
                      {count}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            {/* Gráfico de Pizza */}
            <Grid item xs={12} sx={{ mt: 4 }}>
              <Card sx={cardStyle}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6">Distribuição por Status</Typography>
                    <Tooltip title="Este gráfico mostra a distribuição percentual dos dispositivos por status">
                      <IconButton size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box sx={{ height: 300, mt: 2 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={prepareChartData(data.devices.by_status, 'dispositivos')}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {prepareChartData(data.devices.by_status, 'dispositivos').map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </PageContainer>
  );
}

export default Dashboard; 