import apiClient from './api';
import { API_ENDPOINTS } from '../config/api.config';

/**
 * Staff Service - Gestión de personal médico
 * Basado en CORS_FRONTEND_GUIDE.md
 */
export const staffService = {
  // Get all staff members with optional filters
  getAll: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.STAFF.BASE, { params });
    return response.data;
  },

  // Get staff member by ID
  getById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.STAFF.BY_ID(id));
    return response.data;
  },

  // Create staff member
  create: async (staffData) => {
    const response = await apiClient.post(API_ENDPOINTS.STAFF.BASE, staffData);
    return response.data;
  },

  // Update staff member
  update: async (id, staffData) => {
    const response = await apiClient.put(API_ENDPOINTS.STAFF.BY_ID(id), staffData);
    return response.data;
  },

  // Delete staff member (soft delete)
  delete: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.STAFF.BY_ID(id));
    return response.data;
  },

  // Search staff members by status or other filters
  search: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.STAFF.BASE, { params });
    return response.data;
  },
};

export default staffService;

