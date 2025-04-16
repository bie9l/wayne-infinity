import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Knox ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Serviço de autenticação
export const authService = {
  async login(credentials) {
    const response = await api.post('/auth/login/', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/auth/register/', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  async logout() {
    const token = localStorage.getItem('token');
    if (token) {
      await api.post('/auth/logout/', null, {
        headers: { Authorization: `Knox ${token}` }
      });
    }
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

// Serviços de recursos
export const resourcesService = {
  // Dashboard
  getDashboard: () => api.get('/dashboard/'),

  // Equipamentos
  getEquipment: () => api.get('/equipment/'),
  getEquipmentById: (id) => api.get(`/equipment/${id}/`),
  createEquipment: (data) => api.post('/equipment/', data),
  updateEquipment: (id, data) => api.put(`/equipment/${id}/`, data),
  deleteEquipment: (id) => api.delete(`/equipment/${id}/`),

  // Veículos
  getVehicles: () => api.get('/vehicles/'),
  getVehicleById: (id) => api.get(`/vehicles/${id}/`),
  createVehicle: (data) => api.post('/vehicles/', data),
  updateVehicle: (id, data) => api.put(`/vehicles/${id}/`, data),
  deleteVehicle: (id) => api.delete(`/vehicles/${id}/`),

  // Dispositivos de Segurança
  getDevices: () => api.get('/devices/'),
  getDeviceById: (id) => api.get(`/devices/${id}/`),
  createDevice: (data) => api.post('/devices/', data),
  updateDevice: (id, data) => api.put(`/devices/${id}/`, data),
  deleteDevice: (id) => api.delete(`/devices/${id}/`),
};

// Serviços de segurança
export const securityService = {
  // Logs de Acesso
  getLogs: () => api.get('/security/logs/'),
  createLog: (data) => api.post('/security/logs/create/', data),

  // Alertas
  getAlerts: () => api.get('/security/alerts/'),
  getAlertById: (id) => api.get(`/security/alerts/${id}/`),
  createAlert: (data) => api.post('/security/alerts/', data),
  updateAlert: (id, data) => api.put(`/security/alerts/${id}/`, data),
  resolveAlert: (id, data) => api.post(`/security/alerts/${id}/resolve/`, data),

  // Áreas Restritas
  getAreas: () => api.get('/security/areas/'),
  getAreaById: (id) => api.get(`/security/areas/${id}/`),
  createArea: (data) => api.post('/security/areas/', data),
  updateArea: (id, data) => api.put(`/security/areas/${id}/`, data),
  deleteArea: (id) => api.delete(`/security/areas/${id}/`),
  checkAccess: (areaId) => api.post('/security/areas/check-access/', { area_id: areaId }),
};

export default api; 