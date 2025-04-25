import api from './api';

export const deviceService = {
  async getAll(params) {
    try {
      const response = await api.get('/devices/', { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dispositivos:', error.response?.data);
      throw error;
    }
  },

  async getById(id) {
    try {
      const response = await api.get(`/devices/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dispositivo:', error.response?.data);
      throw error;
    }
  },

  async create(data) {
    try {
      console.log('Criando dispositivo:', data);
      const response = await api.post('/devices/', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar dispositivo:', error.response?.data);
      throw error;
    }
  },

  async update(id, data) {
    try {
      console.log('Atualizando dispositivo:', data);
      const response = await api.put(`/devices/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar dispositivo:', error.response?.data);
      throw error;
    }
  },

  async delete(id) {
    try {
      await api.delete(`/devices/${id}/`);
    } catch (error) {
      console.error('Erro ao deletar dispositivo:', error.response?.data);
      throw error;
    }
  }
}; 