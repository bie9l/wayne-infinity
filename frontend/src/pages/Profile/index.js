import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Avatar, Card, CardContent, Grid, CircularProgress } from '@mui/material';
import { Person, Email, AccountBox, Badge } from '@mui/icons-material';
import PageContainer from '../../components/PageContainer';
import { authService } from '../../services/auth';
import { updateUser } from '../../store/slices/authSlice';

function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('Iniciando busca de dados do usuário...');
        
        const token = localStorage.getItem('token');
        console.log('Token encontrado:', token ? 'Sim' : 'Não');
        
        const userData = await authService.getCurrentUser();
        console.log('Dados recebidos do servidor:', userData);
        
        if (!userData) {
          throw new Error('Nenhum dado de usuário recebido');
        }
        
        dispatch(updateUser(userData));
        console.log('Estado atualizado com dados:', userData);
        
      } catch (error) {
        console.error('Erro detalhado ao buscar dados do usuário:', error);
        setError(error.message || 'Erro ao carregar dados do perfil');
      } finally {
        setIsLoading(false);
      }
    };

    // Se não temos dados do usuário, buscar do servidor
    if (!user || !user.username) {
      console.log('Dados do usuário não encontrados no estado, buscando do servidor...');
      fetchUserData();
    } else {
      console.log('Dados do usuário já presentes no estado:', user);
      setIsLoading(false);
    }
  }, [dispatch, user]);

  console.log('Estado atual do componente:', { isLoading, error, user });

  if (isLoading) {
    return (
      <PageContainer title="Perfil">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="Perfil">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <Typography color="error">{error}</Typography>
        </Box>
      </PageContainer>
    );
  }

  // Se não temos dados do usuário mesmo após carregar
  if (!user) {
    return (
      <PageContainer title="Perfil">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <Typography color="error">Dados do usuário não encontrados. Por favor, faça login novamente.</Typography>
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Perfil">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={4}>
                <Avatar sx={{ width: 80, height: 80, mr: 2, bgcolor: 'primary.main' }}>
                  <Person sx={{ fontSize: 40 }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" gutterBottom>
                    {user?.username || 'Usuário não encontrado'}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    {user?.email || 'Email não informado'}
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <AccountBox sx={{ mr: 1, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        Nome Completo
                      </Typography>
                      <Typography variant="body1">
                        {user?.first_name && user?.last_name 
                          ? `${user.first_name} ${user.last_name}`
                          : 'Não informado'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Email sx={{ mr: 1, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        Email
                      </Typography>
                      <Typography variant="body1">
                        {user?.email || 'Não informado'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Badge sx={{ mr: 1, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        Tipo de Usuário
                      </Typography>
                      <Typography variant="body1">
                        {user?.user_type || 'Não informado'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageContainer>
  );
}

export default Profile; 