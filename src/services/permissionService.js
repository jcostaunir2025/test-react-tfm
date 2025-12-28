import apiClient from './api';
import { API_ENDPOINTS } from '../config/api.config';

/**
 * Permission Service - Gestión de permisos del sistema
 */
export const permissionService = {
  // Get all permissions (Admin only)
  getAll: async () => {
    const response = await apiClient.get(API_ENDPOINTS.PERMISSIONS.BASE);
    return response.data;
  },

  // Get permission by ID (Admin only)
  getById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.PERMISSIONS.BY_ID(id));
    return response.data;
  },

  // Get permissions grouped by resource (Admin only)
  getByResource: async () => {
    const response = await apiClient.get(API_ENDPOINTS.PERMISSIONS.BY_RESOURCE);
    return response.data;
  },

  // Get all resources (Admin only)
  getResources: async () => {
    const response = await apiClient.get(API_ENDPOINTS.PERMISSIONS.RESOURCES);
    return response.data;
  },

  // Get all actions (Admin only)
  getActions: async () => {
    const response = await apiClient.get(API_ENDPOINTS.PERMISSIONS.ACTIONS);
    return response.data;
  },

  // Get current user's permissions
  getMyPermissions: async () => {
    const response = await apiClient.get(API_ENDPOINTS.PERMISSIONS.MY_PERMISSIONS);
    return response.data;
  },

  // Get current user's permissions grouped by resource
  getMyPermissionsByResource: async () => {
    const response = await apiClient.get(API_ENDPOINTS.PERMISSIONS.MY_PERMISSIONS_BY_RESOURCE);
    return response.data;
  },

  // Check if current user has a specific permission
  checkPermission: async (permissionName) => {
    const response = await apiClient.get(API_ENDPOINTS.PERMISSIONS.CHECK(permissionName));
    return response.data;
  },
};

export default permissionService;

