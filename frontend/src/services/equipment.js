import api from './api';

export const equipmentService = {
  async getAll(params) {
    try {
      const response = await api.get('/equipment/', { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar equipamentos:', error.response?.data);
      throw error;
    }
  },

  async getById(id) {
    try {
      const response = await api.get(`/equipment/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar equipamento:', error.response?.data);
      throw error;
    }
  },

  async create(data) {
    try {
      console.log('Criando equipamento:', data);
      const response = await api.post('/equipment/', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar equipamento:', error.response?.data);
      throw error;
    }
  },

  async update(id, data) {
    try {
      console.log('Atualizando equipamento:', data);
      const response = await api.put(`/equipment/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar equipamento:', error.response?.data);
      throw error;
    }
  },

  async delete(id) {
    try {
      const response = await api.delete(`/equipment/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar equipamento:', error.response?.data);
      throw new Error(error.response?.data?.error || 'Erro ao excluir equipamento');
    }
  }
}; 