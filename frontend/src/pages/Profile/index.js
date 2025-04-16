import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Avatar, Card, CardContent, Grid } from '@mui/material';
import { Person, Email, AccountBox } from '@mui/icons-material';
import PageContainer from '../../components/PageContainer';
import { authService } from '../../services/api';
import { updateUser } from '../../store/slices/authSlice';

function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await authService.getCurrentUser();
        dispatch(updateUser(userData));
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    };
    fetchUserData();
  }, [dispatch]);

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
                    {user?.username || 'Carregando...'}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    {user?.email || 'Carregando...'}
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
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageContainer>
  );
}

export default Profile; 