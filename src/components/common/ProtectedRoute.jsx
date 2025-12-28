import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { hasAnyRole, hasAnyPermission } from '../../utils/roleUtils';

/**
 * ProtectedRoute Component
 * Protege rutas basándose en autenticación, roles y/o permisos
 *
 * LÓGICA DE ROLES:
 * - El usuario necesita tener AL MENOS UNO de los roles en la lista de roles requeridos
 * - Si usuario tiene roles: ['DOCTOR', 'ANALISTA']
 * - Y la ruta requiere: ['ADMIN', 'DOCTOR', 'ENFERMERO']
 * - Resultado: ✅ ACCESO PERMITIDO (porque tiene DOCTOR)
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes hijos a proteger
 * @param {string[]} props.roles - Roles requeridos (el usuario debe tener AL MENOS UNO de estos)
 * @param {string[]} props.permissions - Permisos requeridos (el usuario debe tener al menos uno)
 * @param {boolean} props.requireAllPermissions - Si true, requiere TODOS los permisos; si false, AL MENOS UNO
 *
 * @example
 * // Usuario con rol DOCTOR puede acceder
 * <ProtectedRoute roles={['ADMIN', 'DOCTOR']}>
 *   <PatientManagement />
 * </ProtectedRoute>
 */
export const ProtectedRoute = ({
  children,
  roles = null,
  permissions = null,
  requireAllPermissions = false
}) => {
  const { isAuthenticated } = useAuthStore();

  // Check authentication
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check roles if specified
  if (roles && roles.length > 0 && !hasAnyRole(roles)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="card max-w-md">
          <h2 className="text-2xl font-bold text-danger-600 mb-4">Acceso Denegado</h2>
          <p className="text-gray-600 mb-2">
            No tiene los roles necesarios para acceder a esta página.
          </p>
          <p className="text-sm text-gray-500">
            Roles requeridos: {roles.join(', ')}
          </p>
          <button
            onClick={() => window.history.back()}
            className="btn btn-primary mt-4"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  // Check permissions if specified
  if (permissions && permissions.length > 0) {
    const hasAccess = requireAllPermissions
      ? permissions.every(p => hasAnyPermission([p]))
      : hasAnyPermission(permissions);

    if (!hasAccess) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="card max-w-md">
            <h2 className="text-2xl font-bold text-danger-600 mb-4">Acceso Denegado</h2>
            <p className="text-gray-600 mb-2">
              No tiene los permisos necesarios para acceder a esta página.
            </p>
            <p className="text-sm text-gray-500">
              Permisos requeridos: {permissions.join(', ')}
            </p>
            <button
              onClick={() => window.history.back()}
              className="btn btn-primary mt-4"
            >
              Volver
            </button>
          </div>
        </div>
      );
    }
  }

  return children;
};

