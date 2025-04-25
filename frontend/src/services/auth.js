import api from './api';

export const authService = {
  async login(username, password) {
    console.log('Enviando requisição de login:', { username });
    try {
      const response = await api.post('/auth/login/', { username, password });
      console.log('Resposta do servidor:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
      } else {
        throw new Error('Token não encontrado na resposta');
      }
    } catch (error) {
      console.error('Erro na requisição de login:', error);
      throw error;
    }
  },

  async register(userData) {
    try {
      const response = await api.post('/auth/register/', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      }
      return response.data;
    } catch (error) {
      console.error('Erro na requisição de registro:', error);
      throw error;
    }
  },

  async logout() {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await api.post('/auth/logout/', null, {
          headers: { Authorization: `Token ${token}` }
        });
      }
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Erro na requisição de logout:', error);
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      console.log('Iniciando getCurrentUser...');
      
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token não encontrado no localStorage');
        throw new Error('Token não encontrado');
      }

      console.log('Fazendo requisição para /auth/user/...');
      const response = await api.get('/auth/user/', {
        headers: { 
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Resposta recebida de /auth/user/:', response);
      
      if (!response.data) {
        console.error('Dados não encontrados na resposta');
        throw new Error('Dados do usuário não encontrados');
      }

      // Atualiza o cache local
      localStorage.setItem('user', JSON.stringify(response.data));
      
      return response.data;
    } catch (error) {
      console.error('Erro detalhado ao buscar usuário atual:', {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        throw new Error('Sessão expirada. Por favor, faça login novamente.');
      }
      
      // Tenta recuperar do cache local
      const cachedUser = localStorage.getItem('user');
      if (cachedUser) {
        console.log('Usando dados em cache do usuário');
        return JSON.parse(cachedUser);
      }
      
      throw error;
    }
  },

  isAuthenticated() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }
}; 