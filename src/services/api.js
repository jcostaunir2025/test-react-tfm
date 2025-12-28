import axios from 'axios';
import { API_CONFIG } from '../config/api.config';

// Create axios instance for all API calls (with /api/v1 prefix)
const apiClient = axios.create({
  baseURL: `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}`,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('📡 API Request:', {
      method: config.method?.toUpperCase(),
      url: `${config.baseURL}${config.url}`,
    });
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error);

    if (error.response) {
      // Server responded with error status
      console.error('Response error:', {
        status: error.response.status,
        url: error.config?.url,
        data: error.response.data,
      });

      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }

      // Handle other errors
      const errorMessage = error.response.data?.message ||
                          error.response.data?.error ||
                          `Server error: ${error.response.status}`;

      return Promise.reject({
        status: error.response.status,
        message: errorMessage,
        data: error.response.data,
      });
    }

    if (error.request) {
      // Request was made but no response received
      console.error('No response received:', {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        method: error.config?.method,
      });

      return Promise.reject({
        status: 0,
        message: `Cannot connect to server at ${error.config?.baseURL || API_CONFIG.BASE_URL}. Please ensure the backend is running.`,
      });
    }

    // Something else happened
    console.error('Request setup error:', error.message);
    return Promise.reject({
      status: 0,
      message: error.message || 'Network error. Please check your connection.',
    });
  }
);

export default apiClient;

