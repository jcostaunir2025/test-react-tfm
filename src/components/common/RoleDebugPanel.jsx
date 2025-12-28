import { useAuthStore } from '../../store/authStore';
import { getCurrentUser, hasAnyRole } from '../../utils/roleUtils';
import { Shield, CheckCircle, XCircle } from 'lucide-react';

/**
 * Componente de Debug para verificar roles y permisos del usuario
 * Agregar temporalmente al Dashboard para diagnosticar problemas
 */
export const RoleDebugPanel = () => {
  const { user: storeUser } = useAuthStore();
  const localStorageUser = getCurrentUser();

  const testRoles = [
    'ADMIN',
    'DOCTOR',
    'ENFERMERO',
    'ANALISTA',
    'RECEPCIONISTA',
    'TECNICO',
    'AUDITOR'
  ];

  const testRouteRoles = [
    { route: '/patients', roles: ['ADMIN', 'DOCTOR', 'ENFERMERO', 'RECEPCIONISTA'] },
    { route: '/consultations', roles: ['ADMIN', 'DOCTOR', 'ENFERMERO'] },
    { route: '/evaluations', roles: ['ADMIN', 'DOCTOR', 'ENFERMERO', 'ANALISTA'] },
    { route: '/sentiment', roles: ['ADMIN', 'DOCTOR', 'ANALISTA'] },
    { route: '/high-risk', roles: ['ADMIN', 'DOCTOR', 'ENFERMERO'] },
    { route: '/reports', roles: ['ADMIN', 'DOCTOR', 'ANALISTA', 'AUDITOR'] },
    { route: '/users', roles: ['ADMIN'] },
  ];

  return (
    <div className="card bg-yellow-50 border-2 border-yellow-400">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-6 w-6 text-yellow-600" />
        <h3 className="text-lg font-bold text-yellow-900">🔍 Panel de Debug de Roles</h3>
      </div>

      {/* Usuario del Store */}
      <div className="mb-4 p-3 bg-white rounded border border-yellow-300">
        <h4 className="font-semibold text-sm text-gray-700 mb-2">Usuario desde Zustand Store:</h4>
        <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
          {JSON.stringify(storeUser, null, 2)}
        </pre>
      </div>

      {/* Usuario de localStorage */}
      <div className="mb-4 p-3 bg-white rounded border border-yellow-300">
        <h4 className="font-semibold text-sm text-gray-700 mb-2">Usuario desde localStorage:</h4>
        <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
          {JSON.stringify(localStorageUser, null, 2)}
        </pre>
      </div>

      {/* Roles del usuario */}
      <div className="mb-4 p-3 bg-white rounded border border-yellow-300">
        <h4 className="font-semibold text-sm text-gray-700 mb-2">Roles del Usuario:</h4>
        <div className="flex flex-wrap gap-2">
          {storeUser?.roles?.map(role => (
            <span key={role} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded font-semibold">
              {role}
            </span>
          )) || <span className="text-red-600 text-sm">⚠️ Sin roles</span>}
        </div>
      </div>

      {/* Permisos del usuario */}
      <div className="mb-4 p-3 bg-white rounded border border-yellow-300">
        <h4 className="font-semibold text-sm text-gray-700 mb-2">Permisos del Usuario:</h4>
        <div className="flex flex-wrap gap-1">
          {storeUser?.permissions?.slice(0, 10).map(permission => (
            <span key={permission} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
              {permission}
            </span>
          )) || <span className="text-red-600 text-sm">⚠️ Sin permisos</span>}
          {storeUser?.permissions?.length > 10 && (
            <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">
              +{storeUser.permissions.length - 10} más
            </span>
          )}
        </div>
      </div>

      {/* Test de verificación de roles */}
      <div className="mb-4 p-3 bg-white rounded border border-yellow-300">
        <h4 className="font-semibold text-sm text-gray-700 mb-2">Test de Roles Individuales:</h4>
        <div className="grid grid-cols-2 gap-2">
          {testRoles.map(role => {
            const hasRole = storeUser?.roles?.includes(role);
            return (
              <div key={role} className="flex items-center gap-2 text-xs">
                {hasRole ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-400" />
                )}
                <span className={hasRole ? 'text-green-700 font-semibold' : 'text-gray-500'}>
                  {role}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Test de acceso a rutas */}
      <div className="p-3 bg-white rounded border border-yellow-300">
        <h4 className="font-semibold text-sm text-gray-700 mb-2">Test de Acceso a Rutas:</h4>
        <div className="space-y-2">
          {testRouteRoles.map(({ route, roles }) => {
            const hasAccess = hasAnyRole(roles);
            return (
              <div key={route} className="flex items-start gap-2 text-xs p-2 bg-gray-50 rounded">
                {hasAccess ? (
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">{route}</div>
                  <div className="text-gray-500">Requiere: {roles.join(', ')}</div>
                  <div className={hasAccess ? 'text-green-700 font-semibold' : 'text-red-600'}>
                    {hasAccess ? '✅ ACCESO PERMITIDO' : '❌ ACCESO DENEGADO'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Instrucciones */}
      <div className="mt-4 p-3 bg-yellow-100 rounded border border-yellow-400">
        <p className="text-xs text-yellow-900">
          <strong>💡 Cómo usar este panel:</strong><br />
          1. Verifica que tu usuario tenga roles asignados<br />
          2. Comprueba que los roles coincidan con los requeridos por cada ruta<br />
          3. Si ves "⚠️ Sin roles", el problema está en el login o en el backend<br />
          4. Elimina este componente cuando todo funcione correctamente
        </p>
      </div>
    </div>
  );
};

export default RoleDebugPanel;

