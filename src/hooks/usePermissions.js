import { useMemo } from 'react';
import {
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
  getCurrentUser,
} from '../utils/roleUtils';

/**
 * Hook personalizado para gestión de permisos y roles
 * Proporciona funciones y datos del usuario actual
 *
 * @example
 * const { hasPermission, isAdmin, canCreate } = usePermissions('paciente');
 *
 * if (canCreate) {
 *   // Mostrar botón crear
 * }
 */
export const usePermissions = (resource = null) => {
  // Obtener usuario actual
  const user = useMemo(() => getCurrentUser(), []);

  // Roles del usuario
  const roles = useMemo(() => getUserRoles(), []);

  // Permisos del usuario
  const permissions = useMemo(() => getUserPermissions(), []);

  // Permisos agrupados por recurso
  const permissionsByResource = useMemo(() => getPermissionsByResource(), []);

  // Si se especifica un recurso, obtener sus permisos
  const resourcePermissions = useMemo(() => {
    if (!resource) return null;
    return {
      canRead: hasResourcePermission(resource, 'read'),
      canCreate: hasResourcePermission(resource, 'create'),
      canUpdate: hasResourcePermission(resource, 'update'),
      canDelete: hasResourcePermission(resource, 'delete'),
      allowedActions: getAllowedActions(resource),
    };
  }, [resource]);

  return {
    // Usuario
    user,
    isAuthenticated: !!user,
    username: user?.username,

    // Roles
    roles,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isAdmin: isAdmin(),
    isDoctor: isDoctor(),
    isNurse: isNurse(),

    // Permisos
    permissions,
    permissionsByResource,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasResourcePermission,
    canAccessResource,
    getAllowedActions,

    // Permisos del recurso específico (si se proporcionó)
    ...(resourcePermissions || {}),
  };
};

export default usePermissions;

