import apiClient from './api';
import { API_ENDPOINTS } from '../config/api.config';

/**
 * Normaliza los roles de un usuario
 * El backend puede devolver roles como objetos {idRoles: "ADMIN", permisosRoles: [...]}
 * o como strings simples "ADMIN"
 */
const normalizeUserRoles = (user) => {
  if (!user) return user;

  return {
    ...user,
    roles: Array.isArray(user.roles)
      ? user.roles.map(role => {
          // Si el rol es un objeto con idRoles, extraer solo el nombre
          if (typeof role === 'object' && role !== null && role.idRoles) {
            return role.idRoles;
          }
          // Si ya es un string, devolverlo tal cual
          return String(role);
        })
      : []
  };
};

/**
 * Normaliza una respuesta paginada de usuarios
 */
const normalizeUsersResponse = (response) => {
  if (!response) return response;

  // Si es una respuesta paginada (tiene content)
  if (response.content && Array.isArray(response.content)) {
    return {
      ...response,
      content: response.content.map(normalizeUserRoles)
    };
  }

  // Si es un array directo
  if (Array.isArray(response)) {
    return response.map(normalizeUserRoles);
  }

  // Si es un único usuario
  return normalizeUserRoles(response);
};

/**
 * User Service - Gestión de usuarios (requiere rol ADMIN)
 * Endpoints basados en UsuarioController del backend
 */
export const userService = {
  // Get all users
  getAll: async (params = {}) => {
    console.log('🔍 [UserService] getAll called with params:', params);

    // Extraer searchTerm para filtrado en cliente
    const searchTerm = params.search?.toLowerCase().trim();
    const backendParams = { ...params };

    // Eliminar 'search' del parámetro ya que haremos filtrado en el cliente
    delete backendParams.search;

    console.log('📤 [UserService] Backend params:', backendParams);

    const response = await apiClient.get(API_ENDPOINTS.USERS.BASE, { params: backendParams });

    console.log('✅ [UserService] Response status:', response.status);

    let normalized = normalizeUsersResponse(response.data);

    // Si hay término de búsqueda, filtrar en el cliente
    if (searchTerm && normalized) {
      console.log('🔍 [UserService] Applying client-side filtering for:', searchTerm);

      if (normalized.content && Array.isArray(normalized.content)) {
        // Filtrar respuesta paginada
        const originalLength = normalized.content.length;
        const filtered = normalized.content.filter(user => {
          const matchNombreUsuario = user.nombreUsuario?.toLowerCase().includes(searchTerm);
          const matchId = user.idUsuario?.toString().includes(searchTerm);
          return matchNombreUsuario || matchId;
        });

        console.log(`✨ [UserService] Filtered ${originalLength} → ${filtered.length} users`);

        // Actualizar la estructura paginada
        normalized = {
          ...normalized,
          content: filtered,
          totalElements: filtered.length,
          numberOfElements: filtered.length,
          totalPages: Math.max(1, Math.ceil(filtered.length / (params.size || 10))),
          size: params.size || 10,
          number: params.page || 0
        };
      } else if (Array.isArray(normalized)) {
        // Filtrar array directo
        const originalLength = normalized.length;
        const filtered = normalized.filter(user => {
          const matchNombreUsuario = user.nombreUsuario?.toLowerCase().includes(searchTerm);
          const matchId = user.idUsuario?.toString().includes(searchTerm);
          return matchNombreUsuario || matchId;
        });

        console.log(`✨ [UserService] Filtered ${originalLength} → ${filtered.length} users`);
        normalized = filtered;
      }
    }

    console.log('✅ [UserService] Final result:', {
      hasContent: !!normalized?.content,
      contentLength: normalized?.content?.length || normalized?.length || 0,
      totalElements: normalized?.totalElements
    });

    return normalized;
  },

  // Get user by ID
  getById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.USERS.BY_ID(id));
    return normalizeUserRoles(response.data);
  },

  // Get user by username
  getByName: async (nombreUsuario) => {
    const response = await apiClient.get(API_ENDPOINTS.USERS.BY_NAME(nombreUsuario));
    return normalizeUserRoles(response.data);
  },

  // Get available roles
  getRoles: async () => {
    const response = await apiClient.get(API_ENDPOINTS.USERS.ROLES);
    const roles = response.data;

    // Normalizar roles: pueden venir como objetos o strings
    if (Array.isArray(roles)) {
      return roles.map(role => {
        if (typeof role === 'object' && role !== null && role.idRoles) {
          return role.idRoles;
        }
        return String(role);
      });
    }

    return roles;
  },

  // Create user
  create: async (userData) => {
    // Mapear datos del frontend al formato del backend
    const backendData = {
      nombreUsuario: userData.nombreUsuario,
      passUsuario: userData.password, // Backend espera "passUsuario"
      rolesIds: userData.roles, // Backend espera "rolesIds"
    };

    console.log('📤 [UserService] Creating user with data:', {
      nombreUsuario: backendData.nombreUsuario,
      hasPassword: !!backendData.passUsuario,
      passwordLength: backendData.passUsuario?.length,
      rolesIds: backendData.rolesIds
    });

    const response = await apiClient.post(API_ENDPOINTS.USERS.BASE, backendData);

    console.log('✅ [UserService] User created successfully');
    console.log('📊 [UserService] Response data:', {
      idUsuario: response.data.idUsuario,
      nombreUsuario: response.data.nombreUsuario,
      hasPassword: !!response.data.passUsuario,
      roles: response.data.roles
    });

    return normalizeUserRoles(response.data);
  },

  // Update user
  update: async (id, userData) => {
    // Mapear datos del frontend al formato del backend
    const backendData = {
      nombreUsuario: userData.nombreUsuario,
      rolesIds: userData.roles, // Backend espera "rolesIds"
    };

    // Solo incluir password si se proporcionó
    if (userData.password) {
      backendData.passUsuario = userData.password; // Backend espera "passUsuario"
    }

    console.log('📤 [UserService] Updating user with data:', backendData);

    const response = await apiClient.put(API_ENDPOINTS.USERS.BY_ID(id), backendData);

    console.log('✅ [UserService] User updated:', response.data);

    return normalizeUserRoles(response.data);
  },

  // Delete user
  delete: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.USERS.BY_ID(id));
    return response.data;
  },
};

export default userService;
