import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // Inicializar desde localStorage si existe
      initialize: () => {
        const token = localStorage.getItem('jwt_token');
        const userStr = localStorage.getItem('user');

        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            set({
              user,
              token,
              isAuthenticated: true,
            });
            console.log('✅ AuthStore initialized from localStorage');
          } catch (error) {
            console.error('❌ Error parsing stored user:', error);
            // Limpiar datos corruptos
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('user');
          }
        }
      },

      // Verificar si el token sigue siendo válido
      checkAuth: () => {
        const token = localStorage.getItem('jwt_token');
        const currentToken = get().token;

        // Si el token en localStorage fue eliminado pero el estado aún lo tiene
        if (!token && currentToken) {
          console.log('⚠️ Token eliminado, limpiando estado');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
          return false;
        }

        return !!token;
      },

      login: (userData, token) => {
        console.log('🏪 AuthStore - Login called');
        console.log('🏪 AuthStore - User data:', userData);
        console.log('🏪 AuthStore - Roles:', userData?.roles);
        console.log('🏪 AuthStore - Permissions:', userData?.permissions);

        // El backend RNTN ya envía roles limpios (sin ROLE_)
        // Solo aseguramos que sea un array y esté en mayúsculas
        const normalizedUser = {
          ...userData,
          roles: Array.isArray(userData?.roles)
            ? userData.roles.map(r => String(r).toUpperCase())
            : userData?.roles
              ? [String(userData.roles).toUpperCase()]
              : ['ADMIN'], // Default para desarrollo
          permissions: Array.isArray(userData?.permissions)
            ? userData.permissions
            : []
        };

        console.log('🏪 AuthStore - Normalized user:', normalizedUser);

        // Guardar en localStorage (para compatibilidad con roleUtils)
        localStorage.setItem('jwt_token', token);
        localStorage.setItem('user', JSON.stringify(normalizedUser));

        set({
          user: normalizedUser,
          token: token,
          isAuthenticated: true,
        });

        console.log('✅ AuthStore - Login successful');
      },

      logout: () => {
        console.log('🏪 AuthStore - Logout');
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      updateUser: (userData) => {
        console.log('🏪 AuthStore - Update user');
        set({ user: userData });
      },

      hasPermission: (permission) => {
        const { user } = get();
        console.log('🔍 hasPermission check:', { permission, userPermissions: user?.permissions });

        if (!user || !user.permissions) {
          console.log('⚠️ No user or permissions found');
          return false;
        }

        const result = user.permissions.includes(permission);
        console.log('🔍 hasPermission result:', result);
        return result;
      },

      hasRole: (role) => {
        const { user } = get();
        console.log('🔍 hasRole check:', { role, userRoles: user?.roles });

        if (!user || !user.roles) {
          console.log('⚠️ No user or roles found');
          return false;
        }

        // Backend RNTN devuelve roles sin prefijo, solo comparar en mayúsculas
        const normalizedRole = String(role).replace(/^ROLE_/i, '').toUpperCase();
        const result = user.roles.includes(normalizedRole);

        console.log('🔍 hasRole result:', result);
        return result;
      },

      /**
       * Verifica si el usuario tiene alguno de los roles especificados
       * LÓGICA: Retorna true si el usuario tiene AL MENOS UNO de los roles en la lista
       *
       * @param {string[]} roles - Array de roles requeridos
       * @returns {boolean} true si el usuario tiene al menos uno de los roles
       */
      hasAnyRole: (roles) => {
        const { user } = get();
        console.log('🔍 hasAnyRole check:', { requiredRoles: roles, userRoles: user?.roles });

        if (!user || !user.roles) {
          console.log('⚠️ No user or roles found');
          return false;
        }

        // Backend RNTN devuelve roles sin prefijo
        const normalizedRequiredRoles = roles.map(r =>
          String(r).replace(/^ROLE_/i, '').toUpperCase()
        );

        // .some() = retorna true si AL MENOS UNO de los roles del usuario está en la lista requerida
        const result = normalizedRequiredRoles.some(role =>
          user.roles.includes(role)
        );

        console.log('🔍 hasAnyRole result:', result,
          '- User needs at least ONE of:', normalizedRequiredRoles,
          '- User has:', user.roles);
        return result;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

