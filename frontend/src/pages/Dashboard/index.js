import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, useTheme } from '@mui/material';
import { resourcesService } from '../../services/api';
import PageContainer from '../../components/PageContainer';

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
  }, []);

  if (isLoading) return <Typography>Carregando...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  const cardStyle = {
    background: theme.palette.background.paper,
    borderRadius: 2,
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
    },
  };

  const headerStyle = {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
    mb: 3,
  };

  return (
    <PageContainer title="Dashboard">
      {/* Sumário */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Typography variant="h4" sx={headerStyle}>
            Resumo Geral
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={cardStyle}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="textSecondary">
                Total de Veículos
              </Typography>
              <Typography variant="h3" color="primary">
                {data.summary.total_vehicles}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={cardStyle}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="textSecondary">
                Total de Equipamentos
              </Typography>
              <Typography variant="h3" color="primary">
                {data.summary.total_equipment}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={cardStyle}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="textSecondary">
                Total de Dispositivos
              </Typography>
              <Typography variant="h3" color="primary">
                {data.summary.total_devices}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Veículos */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Typography variant="h4" sx={headerStyle}>
            Veículos por Status
          </Typography>
        </Grid>
        {Object.entries(data.vehicles.by_status).map(([status, count]) => (
          <Grid item xs={12} sm={4} key={status}>
            <Card sx={cardStyle}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="textSecondary">
                  {status}
                </Typography>
                <Typography variant="h3" color="primary">
                  {count}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Equipamentos */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Typography variant="h4" sx={headerStyle}>
            Equipamentos por Tipo
          </Typography>
        </Grid>
        {Object.entries(data.equipment.by_type).map(([type, count]) => (
          <Grid item xs={12} sm={4} key={type}>
            <Card sx={cardStyle}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="textSecondary">
                  {type}
                </Typography>
                <Typography variant="h3" color="primary">
                  {count}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dispositivos */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" sx={headerStyle}>
            Dispositivos por Status
          </Typography>
        </Grid>
        {Object.entries(data.devices.by_status).map(([status, count]) => (
          <Grid item xs={12} sm={4} key={status}>
            <Card sx={cardStyle}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="textSecondary">
                  {status}
                </Typography>
                <Typography variant="h3" color="primary">
                  {count}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </PageContainer>
  );
}

export default Dashboard; 