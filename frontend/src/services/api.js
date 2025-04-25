import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Interceptor para adicionar o token de autenticação e CSRF
api.interceptors.request.use(
  async (config) => {
    console.log('Configurando requisição:', {
      method: config.method,
      url: config.url,
      data: config.data,
      headers: config.headers
    });
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }

    // Adiciona o token CSRF para requisições POST, PUT, DELETE
    if (['post', 'put', 'delete'].includes(config.method.toLowerCase())) {
      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];
      
      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
      }
    }

    return config;
  },
  (error) => {
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para log de respostas e tratamento de erros
api.interceptors.response.use(
  (response) => {
    console.log('Resposta recebida:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  (error) => {
    console.error('Erro na resposta:', {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
      config: {
        method: error.config?.method,
        url: error.config?.url,
        data: error.config?.data,
        headers: error.config?.headers
      }
    });

    // Tratamento específico para erros de CSRF
    if (error.response?.status === 403 && error.response?.data?.detail?.includes('CSRF')) {
      console.error('Erro de CSRF detectado. Tentando obter novo token...');
      // Aqui você pode implementar uma lógica para obter um novo token CSRF
      // Por exemplo, fazer uma requisição GET para obter o token
      return api.get('/auth/csrf/')
        .then(() => {
          // Repete a requisição original
          return api(error.config);
        });
    }

    return Promise.reject(error);
  }
);

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
  createLog: (data) => api.post('/security/logs/', data),

  // Alertas
  getAlerts: () => api.get('/security/incidents/'),
  getAlertById: (id) => api.get(`/security/incidents/${id}/`),
  createAlert: (data) => api.post('/security/incidents/', data),
  updateAlert: (id, data) => api.put(`/security/incidents/${id}/`, data),
  resolveAlert: (id, data) => api.post(`/security/incidents/${id}/resolve/`, data),

  // Áreas Restritas
  getAreas: () => api.get('/security/areas/'),
  getAreaById: (id) => api.get(`/security/areas/${id}/`),
  createArea: (data) => api.post('/security/areas/', data),
  updateArea: (id, data) => api.put(`/security/areas/${id}/`, data),
  deleteArea: (id) => api.delete(`/security/areas/${id}/`),
  checkAccess: (areaId) => api.post('/security/areas/check-access/', { area_id: areaId }),
};

export default api; 