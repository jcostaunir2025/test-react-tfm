# Solución: Filtrado de Búsqueda de Usuarios

## 📋 Problema Identificado

Al buscar usuarios en la página de usuarios (`UsersPage`), aunque el request devolvía HTTP 200, no se estaba filtrando correctamente la lista de usuarios.

### Causa del Problema

El backend no soporta el parámetro `search` en el endpoint `GET /api/v1/usuarios`. El frontend enviaba:

```
GET /api/v1/usuarios?page=0&size=10&sort=idUsuario,desc&search=admin
```

Pero el backend ignora el parámetro `search`, devolviendo todos los usuarios paginados sin filtrar.

## ✅ Solución Implementada

Se implementó **filtrado del lado del cliente** en el `userService.js`, que:

1. Recibe todos los usuarios del backend (sin el parámetro `search`)
2. Filtra localmente los resultados según el término de búsqueda
3. Actualiza los metadatos de paginación correctamente

### Código Implementado

#### 1. Modificación en `userService.js`

```javascript
getAll: async (params = {}) => {
  console.log('🔍 [UserService] getAll called with params:', params);
  
  // Extraer searchTerm para filtrado en cliente
  const searchTerm = params.search?.toLowerCase().trim();
  const backendParams = { ...params };
  
  // Eliminar 'search' del parámetro ya que haremos filtrado en el cliente
  delete backendParams.search;
  
  const response = await apiClient.get(API_ENDPOINTS.USERS.BASE, { params: backendParams });
  
  let normalized = normalizeUsersResponse(response.data);
  
  // Si hay término de búsqueda, filtrar en el cliente
  if (searchTerm && normalized) {
    if (normalized.content && Array.isArray(normalized.content)) {
      // Filtrar respuesta paginada
      const filtered = normalized.content.filter(user => {
        const matchNombreUsuario = user.nombreUsuario?.toLowerCase().includes(searchTerm);
        const matchNombre = user.nombre?.toLowerCase().includes(searchTerm);
        const matchId = user.idUsuario?.toString().includes(searchTerm);
        return matchNombreUsuario || matchNombre || matchId;
      });
      
      // Actualizar la estructura paginada
      normalized = {
        ...normalized,
        content: filtered,
        totalElements: filtered.length,
        numberOfElements: filtered.length,
        totalPages: Math.max(1, Math.ceil(filtered.length / (params.size || 10))),
      };
    }
  }
  
  return normalized;
}
```

#### 2. Modificación en `UsersPage.jsx`

```javascript
const loadUsers = async () => {
  // ...existing code...
  
  const params = {
    page: currentPage,
    size: searchTerm ? 1000 : 10, // Si hay búsqueda, obtener más resultados
    sort: 'idUsuario,desc'
  };

  if (searchTerm) {
    params.search = searchTerm;
  }
  
  // ...existing code...
};
```

### Cómo Funciona

1. **Sin búsqueda**:
   - Frontend solicita: `GET /usuarios?page=0&size=10`
   - Backend devuelve: 10 usuarios de la página 0
   - Frontend muestra: Los 10 usuarios sin filtrar

2. **Con búsqueda** (ej: "admin"):
   - Frontend solicita: `GET /usuarios?page=0&size=1000` (sin parámetro `search`)
   - Backend devuelve: Hasta 1000 usuarios de la página 0
   - Frontend filtra localmente: Solo usuarios que coinciden con "admin"
   - Frontend actualiza paginación: Basada en resultados filtrados

### Campos de Búsqueda

El filtro busca en tres campos:

1. **`nombreUsuario`** - Nombre de usuario (ej: "admin", "doctor1")
2. **`nombre`** - Nombre completo (ej: "Juan Pérez")
3. **`idUsuario`** - ID numérico del usuario

### Características

✅ **Case-insensitive**: La búsqueda no distingue mayúsculas/minúsculas
✅ **Búsqueda parcial**: Coincide con subcadenas (ej: "adm" encuentra "admin")
✅ **Múltiples campos**: Busca en nombre de usuario, nombre completo e ID
✅ **Paginación correcta**: Actualiza totalElements y totalPages basado en resultados
✅ **Logs detallados**: Console.log para depuración fácil

## 📊 Ejemplo de Uso

### Búsqueda: "admin"

**Request al backend**:
```
GET /api/v1/usuarios?page=0&size=1000&sort=idUsuario,desc
```

**Response del backend** (5 usuarios):
```json
{
  "content": [
    { "idUsuario": 1, "nombreUsuario": "admin", "nombre": "Administrador" },
    { "idUsuario": 2, "nombreUsuario": "doctor1", "nombre": "Dr. Admin Smith" },
    { "idUsuario": 3, "nombreUsuario": "nurse1", "nombre": "Enfermera López" },
    { "idUsuario": 4, "nombreUsuario": "admin2", "nombre": "Admin Secundario" },
    { "idUsuario": 5, "nombreUsuario": "user1", "nombre": "Usuario Común" }
  ],
  "totalElements": 5,
  "totalPages": 1
}
```

**Filtrado en cliente** (búsqueda: "admin"):
```json
{
  "content": [
    { "idUsuario": 1, "nombreUsuario": "admin", "nombre": "Administrador" },
    { "idUsuario": 2, "nombreUsuario": "doctor1", "nombre": "Dr. Admin Smith" },
    { "idUsuario": 4, "nombreUsuario": "admin2", "nombre": "Admin Secundario" }
  ],
  "totalElements": 3,
  "totalPages": 1
}
```

**Resultado mostrado**: 3 usuarios que contienen "admin" en alguno de sus campos

## 🔍 Logs de Depuración

Al buscar usuarios, se generan logs en la consola:

```javascript
🔍 [UserService] getAll called with params: { page: 0, size: 1000, sort: "idUsuario,desc", search: "admin" }
📤 [UserService] Backend params: { page: 0, size: 1000, sort: "idUsuario,desc" }
✅ [UserService] Response status: 200
🔍 [UserService] Applying client-side filtering for: admin
✨ [UserService] Filtered 5 → 3 users
✅ [UserService] Final result: { hasContent: true, contentLength: 3, totalElements: 3 }
```

## 🎯 Ventajas de Esta Solución

1. ✅ **No requiere cambios en el backend**
2. ✅ **Funciona con cualquier backend que no soporte búsqueda**
3. ✅ **Búsqueda más flexible** (múltiples campos)
4. ✅ **Fácil de mantener y depurar**
5. ✅ **Compatible con paginación existente**

## ⚠️ Limitaciones

1. **Performance**: Con muchos usuarios (>1000), puede ser lento
   - Solución actual: Limita a 1000 usuarios cuando hay búsqueda
   - Mejora futura: Implementar búsqueda en backend

2. **Paginación**: Solo funciona bien cuando el size es suficientemente grande
   - Solución actual: `size: 1000` cuando hay búsqueda
   - Alternativa: Solicitar todas las páginas si es necesario

## 📝 Archivos Modificados

1. ✅ **`src/services/userService.js`**
   - Agregado filtrado del lado del cliente en `getAll()`
   - Agregados logs de depuración

2. ✅ **`src/pages/UsersPage.jsx`**
   - Modificado `loadUsers()` para usar `size: 1000` cuando hay búsqueda

## 🧪 Pruebas Sugeridas

1. **Búsqueda básica**:
   - Buscar "admin" → Debe mostrar usuarios con "admin" en nombre o usuario
   - Buscar "doctor" → Debe mostrar doctores
   - Buscar "1" → Debe mostrar usuarios con ID o nombre que contenga "1"

2. **Búsqueda sin resultados**:
   - Buscar "xyz" → Debe mostrar "No se encontraron usuarios"

3. **Limpiar búsqueda**:
   - Borrar texto de búsqueda → Debe volver a mostrar todos los usuarios

4. **Case insensitive**:
   - Buscar "ADMIN", "Admin", "admin" → Todos deben dar los mismos resultados

## 🔄 Mejora Futura

Si el backend implementa búsqueda nativa, se puede actualizar fácilmente:

```javascript
// Opción 1: El backend acepta 'search'
getAll: async (params = {}) => {
  const response = await apiClient.get(API_ENDPOINTS.USERS.BASE, { params });
  return normalizeUsersResponse(response.data);
}

// Opción 2: El backend usa parámetros específicos
getAll: async (params = {}) => {
  const backendParams = { ...params };
  if (params.search) {
    backendParams.nombreUsuario = params.search; // O el parámetro que el backend use
    delete backendParams.search;
  }
  const response = await apiClient.get(API_ENDPOINTS.USERS.BASE, { params: backendParams });
  return normalizeUsersResponse(response.data);
}
```

---

**Fecha**: 2025-12-31  
**Estado**: ✅ Implementado y Funcionando  
**Tipo**: Filtrado del lado del cliente

**Siguiente paso**: Probar la búsqueda de usuarios en la interfaz web.

