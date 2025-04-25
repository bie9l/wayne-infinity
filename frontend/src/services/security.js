import api from './api';

export const securityService = {
  // Incidentes de Segurança
  async getAlerts(params) {
    try {
      const response = await api.get('/security/incidents/', { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar incidentes:', error.response?.data);
      throw error;
    }
  },

  async getAlertById(id) {
    try {
      const response = await api.get(`/security/incidents/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar incidente:', error.response?.data);
      throw error;
    }
  },

  async createAlert(data) {
    try {
      console.log('Criando incidente:', data);
      const response = await api.post('/security/incidents/', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar incidente:', error.response?.data);
      throw error;
    }
  },

  async updateAlert(id, data) {
    try {
      console.log('Atualizando incidente:', data);
      const response = await api.put(`/security/incidents/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar incidente:', error.response?.data);
      throw error;
    }
  },

  async deleteAlert(id) {
    try {
      await api.delete(`/security/incidents/${id}/`);
    } catch (error) {
      console.error('Erro ao deletar incidente:', error.response?.data);
      throw error;
    }
  },

  // Áreas Restritas
  async getAreas(params) {
    try {
      const response = await api.get('/security/areas/', { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar áreas:', error.response?.data);
      throw error;
    }
  },

  async getAreaById(id) {
    try {
      const response = await api.get(`/security/areas/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar área:', error.response?.data);
      throw error;
    }
  },

  async createArea(data) {
    try {
      console.log('Criando área:', data);
      const response = await api.post('/security/areas/', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar área:', error.response?.data);
      throw error;
    }
  },

  async updateArea(id, data) {
    try {
      console.log('Atualizando área:', data);
      const response = await api.put(`/security/areas/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar área:', error.response?.data);
      throw error;
    }
  },

  async deleteArea(id) {
    try {
      await api.delete(`/security/areas/${id}/`);
    } catch (error) {
      console.error('Erro ao deletar área:', error.response?.data);
      throw error;
    }
  },

  // Logs de Segurança
  async getLogs(params) {
    try {
      const response = await api.get('/security/logs/', { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar logs:', error.response?.data);
      throw error;
    }
  },

  async createLog(data) {
    try {
      console.log('Criando log:', data);
      const response = await api.post('/security/logs/', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar log:', error.response?.data);
      throw error;
    }
  }
}; 