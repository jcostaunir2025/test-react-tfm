/**
 * Utilidades para gestión de roles y permisos
 * Basado en el sistema de permisos del backend RNTN
 */

/**
 * Obtiene el usuario actual del localStorage
 * Busca primero en 'user', si no encuentra, busca en 'auth-storage' (Zustand persist)
 * @returns {Object|null} Usuario con roles y permisos
 */
export const getCurrentUser = () => {
  try {
    // Intentar obtener desde la clave 'user' (guardada por authStore.login)
    let userStr = localStorage.getItem('user');

    if (userStr) {
      return JSON.parse(userStr);
    }

    // Fallback: Intentar obtener desde 'auth-storage' (Zustand persist)
    const authStorageStr = localStorage.getItem('auth-storage');
    if (authStorageStr) {
      const authStorage = JSON.parse(authStorageStr);
      if (authStorage?.state?.user) {
        return authStorage.state.user;
      }
    }

    return null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
};

/**
 * Verifica si el usuario tiene un rol específico
 * @param {string} roleName - Nombre del rol (ej: 'ADMIN', 'DOCTOR')
 * @returns {boolean}
 */
export const hasRole = (roleName) => {
  const user = getCurrentUser();
  if (!user || !user.roles) return false;

  // Normalizar el nombre del rol
  const normalizedRole = roleName.toUpperCase().trim();

  // Verificar si el rol está en el array de roles
  return user.roles.some(role =>
    role.toUpperCase().trim() === normalizedRole
  );
};

/**
 * Verifica si el usuario tiene alguno de los roles especificados
 *
 * LÓGICA: El usuario debe tener AL MENOS UNO de los roles en la lista
 *
 * @param {string[]} roleNames - Array de nombres de roles
 * @returns {boolean} true si el usuario tiene al menos uno de los roles
 *
 * @example
 * // Usuario con roles: ['DOCTOR', 'ANALISTA']
 * hasAnyRole(['ADMIN', 'DOCTOR', 'ENFERMERO']) // ✅ true (tiene DOCTOR)
 * hasAnyRole(['ADMIN', 'RECEPCIONISTA'])       // ❌ false (no tiene ninguno)
 */
export const hasAnyRole = (roleNames) => {
  if (!Array.isArray(roleNames) || roleNames.length === 0) return false;
  return roleNames.some(role => hasRole(role));
};

/**
 * Verifica si el usuario tiene todos los roles especificados
 *
 * LÓGICA: El usuario debe tener TODOS los roles en la lista
 *
 * @param {string[]} roleNames - Array de nombres de roles
 * @returns {boolean} true si el usuario tiene todos los roles
 *
 * @example
 * // Usuario con roles: ['ADMIN', 'DOCTOR', 'ANALISTA']
 * hasAllRoles(['ADMIN', 'DOCTOR'])      // ✅ true (tiene ambos)
 * hasAllRoles(['ADMIN', 'ENFERMERO'])   // ❌ false (no tiene ENFERMERO)
 */
export const hasAllRoles = (roleNames) => {
  if (!Array.isArray(roleNames) || roleNames.length === 0) return false;
  return roleNames.every(role => hasRole(role));
};

/**
 * Verifica si el usuario tiene un permiso específico
 * @param {string} permissionName - Nombre del permiso (ej: 'paciente:read', 'evaluacion:create')
 * @returns {boolean}
 */
export const hasPermission = (permissionName) => {
  const user = getCurrentUser();
  if (!user || !user.permissions) return false;

  // Normalizar el nombre del permiso
  const normalizedPermission = permissionName.toLowerCase().trim();

  // Verificar si el permiso está en el array de permisos
  return user.permissions.some(permission =>
    permission.toLowerCase().trim() === normalizedPermission
  );
};

/**
 * Verifica si el usuario tiene alguno de los permisos especificados
 * @param {string[]} permissionNames - Array de nombres de permisos
 * @returns {boolean}
 */
export const hasAnyPermission = (permissionNames) => {
  if (!Array.isArray(permissionNames) || permissionNames.length === 0) return false;
  return permissionNames.some(permission => hasPermission(permission));
};

/**
 * Verifica si el usuario tiene todos los permisos especificados
 * @param {string[]} permissionNames - Array de nombres de permisos
 * @returns {boolean}
 */
export const hasAllPermissions = (permissionNames) => {
  if (!Array.isArray(permissionNames) || permissionNames.length === 0) return false;
  return permissionNames.every(permission => hasPermission(permission));
};

/**
 * Verifica si el usuario tiene permiso para un recurso y acción específicos
 * @param {string} resource - Nombre del recurso (ej: 'paciente', 'evaluacion')
 * @param {string} action - Acción (ej: 'read', 'create', 'update', 'delete')
 * @returns {boolean}
 */
export const hasResourcePermission = (resource, action) => {
  const permissionName = `${resource}:${action}`;
  return hasPermission(permissionName);
};

/**
 * Verifica si el usuario es administrador
 * @returns {boolean}
 */
export const isAdmin = () => {
  return hasRole('ADMIN');
};

/**
 * Verifica si el usuario es doctor
 * @returns {boolean}
 */
export const isDoctor = () => {
  return hasRole('DOCTOR');
};

/**
 * Verifica si el usuario es enfermero
 * @returns {boolean}
 */
export const isNurse = () => {
  return hasRole('ENFERMERO');
};

/**
 * Obtiene todos los roles del usuario actual
 * @returns {string[]}
 */
export const getUserRoles = () => {
  const user = getCurrentUser();
  return user?.roles || [];
};

/**
 * Obtiene todos los permisos del usuario actual
 * @returns {string[]}
 */
export const getUserPermissions = () => {
  const user = getCurrentUser();
  return user?.permissions || [];
};

/**
 * Obtiene los permisos agrupados por recurso
 * @returns {Object} - Objeto con recursos como keys y arrays de acciones como values
 */
export const getPermissionsByResource = () => {
  const permissions = getUserPermissions();
  const grouped = {};

  permissions.forEach(permission => {
    const [resource, action] = permission.split(':');
    if (resource && action) {
      if (!grouped[resource]) {
        grouped[resource] = [];
      }
      grouped[resource].push(action);
    }
  });

  return grouped;
};

/**
 * Verifica si el usuario puede acceder a un recurso (cualquier acción)
 * @param {string} resource - Nombre del recurso
 * @returns {boolean}
 */
export const canAccessResource = (resource) => {
  const permissions = getUserPermissions();
  return permissions.some(permission => permission.startsWith(`${resource}:`));
};

/**
 * Obtiene las acciones permitidas para un recurso específico
 * @param {string} resource - Nombre del recurso
 * @returns {string[]} - Array de acciones permitidas
 */
export const getAllowedActions = (resource) => {
  const permissions = getUserPermissions();
  return permissions
    .filter(permission => permission.startsWith(`${resource}:`))
    .map(permission => permission.split(':')[1]);
};

/**
 * Mapeo de permisos por recurso
 */
export const RESOURCES = {
  PACIENTE: 'paciente',
  PERSONAL: 'personal',
  CONSULTA: 'consulta',
  EVALUACION: 'evaluacion',
  EVALUACION_PREGUNTA: 'evaluacion_pregunta',
  EVALUACION_RESPUESTA: 'evaluacion_respuesta',
  REPORTE: 'reporte',
  SENTIMENT: 'sentiment',
  USUARIO: 'usuario',
};

/**
 * Acciones comunes
 */
export const ACTIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  ANALYZE: 'analyze',
  ANALYZE_BATCH: 'analyze_batch',
  AGGREGATE: 'aggregate',
};

/**
 * Permisos predefinidos comunes
 */
export const PERMISSIONS = {
  // Pacientes
  PACIENTE_READ: 'paciente:read',
  PACIENTE_CREATE: 'paciente:create',
  PACIENTE_UPDATE: 'paciente:update',
  PACIENTE_DELETE: 'paciente:delete',

  // Personal
  PERSONAL_READ: 'personal:read',
  PERSONAL_CREATE: 'personal:create',
  PERSONAL_UPDATE: 'personal:update',
  PERSONAL_DELETE: 'personal:delete',

  // Consultas
  CONSULTA_READ: 'consulta:read',
  CONSULTA_CREATE: 'consulta:create',
  CONSULTA_UPDATE: 'consulta:update',
  CONSULTA_DELETE: 'consulta:delete',

  // Evaluaciones
  EVALUACION_READ: 'evaluacion:read',
  EVALUACION_CREATE: 'evaluacion:create',
  EVALUACION_UPDATE: 'evaluacion:update',
  EVALUACION_DELETE: 'evaluacion:delete',

  // Respuestas de evaluación
  EVALUACION_RESPUESTA_READ: 'evaluacion_respuesta:read',
  EVALUACION_RESPUESTA_CREATE: 'evaluacion_respuesta:create',
  EVALUACION_RESPUESTA_UPDATE: 'evaluacion_respuesta:update',
  EVALUACION_RESPUESTA_DELETE: 'evaluacion_respuesta:delete',

  // Preguntas de evaluación
  EVALUACION_PREGUNTA_READ: 'evaluacion_pregunta:read',
  EVALUACION_PREGUNTA_CREATE: 'evaluacion_pregunta:create',
  EVALUACION_PREGUNTA_UPDATE: 'evaluacion_pregunta:update',
  EVALUACION_PREGUNTA_DELETE: 'evaluacion_pregunta:delete',

  // Reportes
  REPORTE_READ: 'reporte:read',
  REPORTE_CREATE: 'reporte:create',
  REPORTE_DELETE: 'reporte:delete',

  // Sentimientos
  SENTIMENT_ANALYZE: 'sentiment:analyze',
  SENTIMENT_ANALYZE_BATCH: 'sentiment:analyze_batch',
  SENTIMENT_AGGREGATE: 'sentiment:aggregate',
};

/**
 * Roles del sistema
 */
export const ROLES = {
  ADMIN: 'ADMIN',
  DOCTOR: 'DOCTOR',
  ENFERMERO: 'ENFERMERO',
  ANALISTA: 'ANALISTA',
  RECEPCIONISTA: 'RECEPCIONISTA',
  TECNICO: 'TECNICO',
  AUDITOR: 'AUDITOR',
};

export default {
  getCurrentUser,
  hasRole,
  hasAnyRole,
  hasAllRoles,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  hasResourcePermission,
  isAdmin,
  isDoctor,
  isNurse,
  getUserRoles,
  getUserPermissions,
  getPermissionsByResource,
  canAccessResource,
  getAllowedActions,
  RESOURCES,
  ACTIONS,
  PERMISSIONS,
  ROLES,
};

