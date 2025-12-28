import apiClient from './api';
import { API_ENDPOINTS } from '../config/api.config';

/**
 * User Service - Gestión de usuarios (requiere rol ADMIN)
 * Endpoints basados en UsuarioController del backend
 */
export const userService = {
  // Get all users
  getAll: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.USERS.BASE, { params });
    return response.data;
  },

  // Get user by ID
  getById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.USERS.BY_ID(id));
    return response.data;
  },

  // Get user by username
  getByName: async (nombreUsuario) => {
    const response = await apiClient.get(API_ENDPOINTS.USERS.BY_NAME(nombreUsuario));
    return response.data;
  },

  // Get available roles
  getRoles: async () => {
    const response = await apiClient.get(API_ENDPOINTS.USERS.ROLES);
    return response.data;
  },

  // Create user
  create: async (userData) => {
    const response = await apiClient.post(API_ENDPOINTS.USERS.BASE, userData);
    return response.data;
  },

  // Update user
  update: async (id, userData) => {
    const response = await apiClient.put(API_ENDPOINTS.USERS.BY_ID(id), userData);
    return response.data;
  },

  // Delete user
  delete: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.USERS.BY_ID(id));
    return response.data;
  },
};

export default userService;

