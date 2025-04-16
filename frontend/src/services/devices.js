import api from './api';

export const deviceService = {
  async getAll(params) {
    const response = await api.get('/devices/', { params });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/devices/${id}/`);
    return response.data;
  },

  async create(data) {
    const response = await api.post('/devices/', data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/devices/${id}/`, data);
    return response.data;
  },

  async delete(id) {
    await api.delete(`/devices/${id}/`);
  }
}; 