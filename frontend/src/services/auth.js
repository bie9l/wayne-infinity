import api from './api';

export const authService = {
  async login(username, password) {
    const response = await api.post('/auth/login/', { username, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  async logout() {
    await api.post('/auth/logout/');
    localStorage.removeItem('token');
  },

  async getCurrentUser() {
    const response = await api.get('/auth/user/');
    return response.data;
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
}; 