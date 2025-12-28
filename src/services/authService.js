import apiClient from './api';
import { API_ENDPOINTS } from '../config/api.config';

/**
 * Normaliza la respuesta del backend RNTN
 *
 * Formato esperado del backend:
 * {
 *   token: "eyJhbGc...",
 *   type: "Bearer",
 *   username: "admin",
 *   roles: ["ADMIN", "DOCTOR"],  // Ya vienen sin prefijo ROLE_
 *   permissions: ["paciente:read", "paciente:create", ...],
 *   expiresIn: 3600000
 * }
 */
const normalizeAuthResponse = (response) => {
  console.log('🔄 Normalizing RNTN auth response:', response);

  // Extraer token
  const token = response.token;

  if (!token) {
    console.error('❌ No token found in response');
    throw new Error('Token no encontrado en la respuesta del servidor');
  }

  // Extraer username (está en la raíz del response)
  const username = response.username;

  // Extraer roles (están en la raíz del response, ya vienen sin prefijo ROLE_)
  let roles = response.roles || [];

  console.log('📋 Raw roles from backend:', roles);
  console.log('📋 Roles type:', typeof roles);
  console.log('📋 Is Array?:', Array.isArray(roles));

  // Asegurar que es un array
  if (!Array.isArray(roles)) {
    roles = roles ? [roles] : [];
  }

  // Convertir a strings y normalizar a mayúsculas
  const normalizedRoles = roles.map(role => String(role).toUpperCase().trim());

  console.log('✨ Normalized roles:', normalizedRoles);

  // Si no hay roles, asignar ADMIN por defecto en desarrollo
  const finalRoles = normalizedRoles.length > 0 ? normalizedRoles : ['ADMIN'];

  // Extraer permisos (también están en la raíz)
  const permissions = response.permissions || [];

  console.log('🔑 Permissions:', permissions);

  // Construir objeto de usuario
  const user = {
    username: username,
    nombre: username, // Usar username como nombre si no hay otro campo
    roles: finalRoles,
    permissions: permissions,
  };

  console.log('✅ Normalized user:', user);

  return {
    token,
    user,
  };
};

export const authService = {
  login: async (username, password) => {
    console.log('🔐 Attempting login with:', { username });
    console.log('📡 Calling:', `${apiClient.defaults.baseURL}${API_ENDPOINTS.AUTH.LOGIN}`);

    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
        username,
        password,
      });

      console.log('✅ Login successful! Raw backend response:', response.data);
      console.log('📊 Backend response structure:', {
        hasToken: !!response.data.token,
        hasUsername: !!response.data.username,
        hasRoles: !!response.data.roles,
        rolesIsArray: Array.isArray(response.data.roles),
        rolesCount: response.data.roles?.length || 0,
        hasPermissions: !!response.data.permissions,
        permissionsCount: response.data.permissions?.length || 0,
      });

      // Normalizar la respuesta
      const normalizedData = normalizeAuthResponse(response.data);

      console.log('✅ Final normalized data:', normalizedData);
      console.log('👤 User object:', normalizedData.user);
      console.log('👥 Final roles:', normalizedData.user.roles);
      console.log('🔑 Final permissions:', normalizedData.user.permissions);

      return normalizedData;
    } catch (error) {
      console.error('❌ Login error:', error);
      if (error.response) {
        console.error('❌ Error response:', error.response.data);
        console.error('❌ Error status:', error.response.status);
      }
      throw error;
    }
  },

  register: async (userData) => {
    console.log('📝 Attempting registration with:', { username: userData.username });
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    console.log('✅ Registration successful!', response.data);
    return response.data;
  },

  logout: async () => {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  },
};

export default authService;

