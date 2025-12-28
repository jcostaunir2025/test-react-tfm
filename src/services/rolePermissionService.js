import apiClient from './api';
import { API_ENDPOINTS } from '../config/api.config';

/**
 * Role Permission Service - Gestión de asignación de permisos a roles (Admin only)
 */
export const rolePermissionService = {
  // Get all permissions for a role
  getRolePermissions: async (roleId) => {
    const response = await apiClient.get(API_ENDPOINTS.ROLE_PERMISSIONS.BY_ROLE(roleId));
    return response.data;
  },

  // Assign permissions to role (replaces existing permissions)
  assignPermissions: async (roleId, permissionIds) => {
    const response = await apiClient.put(API_ENDPOINTS.ROLE_PERMISSIONS.ASSIGN, {
      roleId,
      permissionIds,
    });
    return response.data;
  },

  // Add permissions to role (keeps existing permissions)
  addPermissions: async (roleId, permissionIds) => {
    const response = await apiClient.post(API_ENDPOINTS.ROLE_PERMISSIONS.ADD(roleId), permissionIds);
    return response.data;
  },

  // Remove permissions from role
  removePermissions: async (roleId, permissionIds) => {
    const response = await apiClient.delete(API_ENDPOINTS.ROLE_PERMISSIONS.REMOVE(roleId), {
      data: permissionIds,
    });
    return response.data;
  },

  // Get summary of permissions by role
  getSummary: async () => {
    const response = await apiClient.get(API_ENDPOINTS.ROLE_PERMISSIONS.SUMMARY);
    return response.data;
  },

  // Check if role has a specific permission
  roleHasPermission: async (roleId, permissionName) => {
    const response = await apiClient.get(API_ENDPOINTS.ROLE_PERMISSIONS.HAS_PERMISSION(roleId, permissionName));
    return response.data;
  },
};

export default rolePermissionService;

