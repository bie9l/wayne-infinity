import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
} from '@mui/material';
import { loginSuccess } from '../../store/slices/authSlice';
import { authService } from '../../services/auth';
import SecurityLogger from '../../services/logger';

function Login() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    console.log('Tentando fazer login com:', credentials);
    
    try {
      const response = await authService.login(
        credentials.username,
        credentials.password
      );
      
      console.log('Resposta do servidor:', response);
      
      if (response.token) {
        dispatch(loginSuccess({
          token: response.token,
          user: response.user,
        }));

        try {
          // Registrar log de login
          await SecurityLogger.logLogin('127.0.0.1'); // TODO: Pegar IP real
        } catch (logError) {
          console.error('Erro ao registrar log de login:', logError);
        }

        // Redireciona para a página que tentou acessar ou para home
        navigate(from, { replace: true });
      } else {
        setError('Resposta inválida do servidor. Token não encontrado.');
      }
    } catch (err) {
      console.error('Erro completo:', err);
      console.error('Resposta do servidor:', err.response?.data);
      
      if (err.response?.status === 401) {
        setError('Credenciais inválidas. Verifique seu usuário e senha.');
      } else if (err.response?.status === 405) {
        setError('Método de requisição inválido. Por favor, tente novamente.');
      } else {
        setError(
          err.response?.data?.non_field_errors?.[0] || 
          err.response?.data?.detail ||
          'Erro ao fazer login. Tente novamente mais tarde.'
        );
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" sx={{ mb: 4 }}>
          Wayne Industries
        </Typography>
        <Card sx={{ width: '100%' }}>
          <CardContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Nome de usuário"
                name="username"
                autoComplete="username"
                autoFocus
                value={credentials.username}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Senha"
                type="password"
                id="password"
                autoComplete="current-password"
                value={credentials.password}
                onChange={handleChange}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Entrar
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default Login; 