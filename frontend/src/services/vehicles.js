import api from './api';

export const vehicleService = {
  async getAll(params) {
    const response = await api.get('/vehicles/', { params });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/vehicles/${id}/`);
    return response.data;
  },

  async create(data) {
    const response = await api.post('/vehicles/', data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/vehicles/${id}/`, data);
    return response.data;
  },

  async delete(id) {
    await api.delete(`/vehicles/${id}/`);
  }
}; 