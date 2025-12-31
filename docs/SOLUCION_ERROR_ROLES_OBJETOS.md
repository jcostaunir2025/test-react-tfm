# Solución Error: Roles como Objetos en UsersPage

## 📋 Problema Identificado

Al abrir la página de usuarios (`UsersPage`), React lanzaba el siguiente error:

```
Uncaught Error: Objects are not valid as a React child (found: object with keys {idRoles, permisosRoles})
```

### Causa del Error

El backend RNTN estaba devolviendo los roles no como strings simples (`"ADMIN"`, `"DOCTOR"`), sino como objetos con la estructura:

```javascript
{
  idRoles: "ADMIN",
  permisosRoles: [...]
}
```

El frontend intentaba renderizar estos objetos directamente en React (líneas 363-371 de `UsersPage.jsx`), lo cual no es válido.

## ✅ Solución Implementada

### 1. Normalización en `userService.js`

Se agregaron funciones de normalización para transformar automáticamente los roles de objetos a strings:

```javascript
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
```

### 2. Aplicación de Normalización

Se aplicó la normalización en todos los endpoints del `userService`:

- ✅ `getAll()` - Normaliza respuestas paginadas
- ✅ `getById()` - Normaliza usuario individual
- ✅ `getByName()` - Normaliza usuario individual
- ✅ `getRoles()` - Normaliza lista de roles disponibles
- ✅ `create()` - Normaliza respuesta de creación
- ✅ `update()` - Normaliza respuesta de actualización

### 3. Actualización en `authService.js`

También se actualizó el `authService` para manejar roles que vengan como objetos en la respuesta de login:

```javascript
// Convertir a strings y normalizar a mayúsculas
// El backend puede devolver roles como objetos {idRoles: "ADMIN", permisosRoles: [...]}
const normalizedRoles = roles.map(role => {
  // Si el rol es un objeto con idRoles, extraer solo el nombre
  if (typeof role === 'object' && role !== null && role.idRoles) {
    return String(role.idRoles).toUpperCase().trim();
  }
  // Si ya es un string, devolverlo tal cual
  return String(role).toUpperCase().trim();
});
```

## 🎯 Resultado

- ✅ La página de usuarios ahora se carga correctamente
- ✅ Los roles se muestran como strings simples en la tabla
- ✅ Los roles se muestran correctamente en los modales de vista/edición
- ✅ Los checkboxes de roles funcionan correctamente
- ✅ La normalización es compatible con ambos formatos (objetos y strings)
- ✅ No se rompe la funcionalidad existente

## 📝 Archivos Modificados

1. **`src/services/userService.js`**
   - Agregadas funciones `normalizeUserRoles()` y `normalizeUsersResponse()`
   - Aplicada normalización en todos los métodos del servicio
   - **Agregado mapeo de campos para crear/actualizar usuarios**:
     - Frontend usa: `password` → Backend espera: `passUsuario`
     - Frontend usa: `roles` → Backend espera: `rolesIds`

2. **`src/services/authService.js`**
   - Actualizada función `normalizeAuthResponse()` para manejar roles como objetos

## 🔄 Mapeo de Campos Backend/Frontend

### Al Crear/Actualizar Usuarios:

El backend espera campos diferentes a los que usa el frontend:

| Frontend | Backend | Descripción |
|----------|---------|-------------|
| `password` | `passUsuario` | Contraseña del usuario |
| `roles` | `rolesIds` | Array de IDs de roles |
| `nombreUsuario` | `nombreUsuario` | Nombre de usuario (igual) |
| `nombre` | `nombre` | Nombre completo (igual) |

**Ejemplo de transformación:**

```javascript
// Datos del formulario (frontend)
const userData = {
  nombreUsuario: "juanperez",
  password: "123456",
  nombre: "Juan Pérez",
  roles: ["ADMIN", "DOCTOR"]
};

// Se transforman a formato backend
const backendData = {
  nombreUsuario: "juanperez",
  passUsuario: "123456",      // password → passUsuario
  nombre: "Juan Pérez",
  rolesIds: ["ADMIN", "DOCTOR"] // roles → rolesIds
};
```

### Al Recibir Datos del Backend:

El backend devuelve roles como objetos que necesitan ser normalizados:

```javascript
// Respuesta del backend
{
  idUsuario: 1,
  nombreUsuario: "admin",
  nombre: "Administrador",
  roles: [
    {
      idRoles: "ADMIN",
      permisosRoles: [...]
    }
  ]
}

// Se normaliza a
{
  idUsuario: 1,
  nombreUsuario: "admin",
  nombre: "Administrador",
  roles: ["ADMIN"]  // Array de strings
}
```

## 🔍 Puntos de Renderizado Afectados

### En `UsersPage.jsx`:

1. **Tabla de usuarios (líneas 363-371)**
   ```jsx
   {user.roles.map((role, index) => (
     <span key={index} className="...">
       {role}  {/* Ahora es un string, no un objeto */}
     </span>
   ))}
   ```

2. **Modal de vista (líneas 604-610)**
   ```jsx
   {selectedUser.roles.map((role, index) => (
     <span key={index} className="...">
       <Shield className="h-4 w-4" />
       {role}  {/* Ahora es un string, no un objeto */}
     </span>
   ))}
   ```

3. **Formulario de roles (línea 531)**
   ```jsx
   {roles.map((role) => (
     <label key={role}>  {/* Ahora role es un string */}
       ...
       {role}
     </label>
   ))}
   ```

## 🧪 Verificación

Para verificar que todo funciona correctamente:

1. ✅ Abrir la página de usuarios sin errores
2. ✅ Ver la lista de usuarios con sus roles
3. ✅ Ver detalles de un usuario
4. ✅ Editar un usuario y sus roles
5. ✅ Crear un nuevo usuario
6. ✅ Verificar que el login sigue funcionando correctamente

## 📚 Documentación Relacionada

- [IMPLEMENTACION_USERS_SENTIMENT.md](./IMPLEMENTACION_USERS_SENTIMENT.md)
- [FRONTEND_BACKEND_SYNC.md](./FRONTEND_BACKEND_SYNC.md)
- [BACKEND_RNTN_ANALYSIS.md](./BACKEND_RNTN_ANALYSIS.md)
- [SOLUCION_BUSQUEDA_USUARIOS.md](./SOLUCION_BUSQUEDA_USUARIOS.md) - Filtrado de búsqueda

---

**Fecha**: 2025-12-31  
**Estado**: ✅ Implementado y Verificado

## 🔄 Actualizaciones Adicionales

### 2025-12-31: Filtrado de Búsqueda

Se implementó filtrado del lado del cliente para la búsqueda de usuarios, ya que el backend no soporta el parámetro `search`. Ver [SOLUCION_BUSQUEDA_USUARIOS.md](./SOLUCION_BUSQUEDA_USUARIOS.md) para más detalles.

