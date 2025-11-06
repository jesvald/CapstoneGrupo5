import axios from 'axios';

// Configuración base de axios
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a las peticiones
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('dashboardToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de error
      if (error.response.status === 401) {
        // Token expirado o inválido
        localStorage.removeItem('dashboardToken');
        window.location.href = '/login';
      }
      throw new Error(error.response.data.message || 'Error en la petición');
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      throw new Error('No se pudo conectar con el servidor');
    } else {
      // Algo más causó el error
      throw new Error(error.message || 'Error desconocido');
    }
  }
);

/**
 * Establecer el token de autenticación
 */
export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

// ==========================================
// AUTENTICACIÓN
// ==========================================

/**
 * Iniciar sesión
 */
export const login = async (email, password) => {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data;
};

/**
 * Registrar nuevo usuario
 */
export const register = async (userData) => {
  const response = await apiClient.post('/auth/register', userData);
  return response.data;
};

/**
 * Obtener usuario actual
 */
export const getCurrentUser = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};

// ==========================================
// MÉTRICAS
// ==========================================

/**
 * Obtener KPIs principales
 */
export const getKPIs = async (startDate, endDate) => {
  const params = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  
  const response = await apiClient.get('/metrics/kpis', { params });
  return response.data;
};

/**
 * Obtener métricas de desempeño
 */
export const getPerformanceMetrics = async (startDate, endDate) => {
  const params = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  
  const response = await apiClient.get('/metrics/performance', { params });
  return response.data;
};

/**
 * Obtener análisis de sentimiento
 */
export const getSentimentAnalysis = async (startDate, endDate) => {
  const params = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  
  const response = await apiClient.get('/metrics/sentiment', { params });
  return response.data;
};

/**
 * Obtener rendimiento histórico
 */
export const getHistoricalPerformance = async (startDate, endDate, groupBy = 'day') => {
  const params = { groupBy };
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  
  const response = await apiClient.get('/metrics/historical', { params });
  return response.data;
};

/**
 * Obtener top proveedores
 */
export const getTopProviders = async (startDate, endDate, limit = 10) => {
  const params = { limit };
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  
  const response = await apiClient.get('/metrics/providers', { params });
  return response.data;
};

/**
 * Obtener alertas del sistema
 */
export const getSystemAlerts = async (startDate, endDate) => {
  const params = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  
  const response = await apiClient.get('/metrics/alerts', { params });
  return response.data;
};

/**
 * Limpiar caché
 */
export const clearCache = async () => {
  const response = await apiClient.delete('/metrics/cache');
  return response.data;
};

export default apiClient;

