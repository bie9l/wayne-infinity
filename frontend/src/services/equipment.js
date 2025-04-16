import api from './api';

export const equipmentService = {
  async getAll(params) {
    const response = await api.get('/equipment/', { params });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/equipment/${id}/`);
    return response.data;
  },

  async create(data) {
    const response = await api.post('/equipment/', data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/equipment/${id}/`, data);
    return response.data;
  },

  async delete(id) {
    await api.delete(`/equipment/${id}/`);
  }
}; 