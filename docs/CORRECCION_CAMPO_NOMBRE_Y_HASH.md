# Corrección: Campo "Nombre" Eliminado y Hash de Contraseña

**Fecha**: 2025-12-31  
**Módulo**: Gestión de Usuarios  
**Estado**: ✅ COMPLETADO

---

## 🎯 Problema 1: Campo "Nombre Completo" No Existe en DB

### Descripción
El componente `UsersPage` intentaba mostrar y editar un campo `nombre` (nombre completo) que no existe en la tabla de usuarios de la base de datos.

### Síntomas
- Error en el modal de vista detallada: campo "nombre" undefined
- Validación innecesaria del campo "nombre" en el formulario
- Columna "Nombre" vacía en la tabla

### ✅ Solución Implementada

Se eliminaron todas las referencias al campo `nombre`:

#### 1. Estado del Formulario
```javascript
// Antes
const [formData, setFormData] = useState({
  nombreUsuario: '',
  password: '',
  nombre: '',        // ❌ Campo eliminado
  roles: [],
});

// Ahora
const [formData, setFormData] = useState({
  nombreUsuario: '',
  password: '',
  roles: [],
});
```

#### 2. Validación del Formulario
```javascript
// Antes
if (!formData.nombre.trim()) {
  errors.nombre = 'El nombre completo es obligatorio';  // ❌ Validación eliminada
}

// Ahora: Validación removida completamente
```

#### 3. Envío de Datos al Backend
```javascript
// Antes
const userData = {
  nombreUsuario: formData.nombreUsuario.trim(),
  nombre: formData.nombre.trim(),  // ❌ Campo eliminado
  roles: formData.roles,
};

// Ahora
const userData = {
  nombreUsuario: formData.nombreUsuario.trim(),
  roles: formData.roles,
};
```

#### 4. Tabla de Usuarios
```javascript
// Antes: 3 columnas
<th>Usuario</th>
<th>Nombre</th>     // ❌ Columna eliminada
<th>Roles</th>

// Ahora: 2 columnas
<th>Usuario</th>
<th>Roles</th>
```

#### 5. Modal de Vista Detallada
```javascript
// Antes
<div>
  <label>Nombre Completo</label>
  <p>{selectedUser.nombre || 'N/A'}</p>  // ❌ Campo eliminado
</div>

// Ahora: Campo removido completamente
```

#### 6. Formulario de Crear/Editar
```html
<!-- Antes -->
<div>
  <label>Nombre Completo <span>*</span></label>
  <input type="text" value={formData.nombre} ... />  <!-- ❌ Campo eliminado -->
</div>

<!-- Ahora: Campo removido completamente -->
```

#### 7. Búsqueda de Usuarios
```javascript
// Antes: Buscaba en 3 campos
const matchNombreUsuario = user.nombreUsuario?.toLowerCase().includes(searchTerm);
const matchNombre = user.nombre?.toLowerCase().includes(searchTerm);  // ❌ Eliminado
const matchId = user.idUsuario?.toString().includes(searchTerm);

// Ahora: Busca solo en 2 campos
const matchNombreUsuario = user.nombreUsuario?.toLowerCase().includes(searchTerm);
const matchId = user.idUsuario?.toString().includes(searchTerm);
```

---

## 🔐 Problema 2: Contraseña No se Guarda como Hash

### Descripción
Se reportó que la contraseña no se está guardando como hash en la base de datos.

### ✅ Análisis y Solución

#### Responsabilidad del Backend
El **hash de contraseñas debe ser manejado por el backend**, no por el frontend. Esto es una buena práctica de seguridad porque:

1. ✅ El frontend debe enviar la contraseña en **texto plano** al backend
2. ✅ El backend debe **hashear la contraseña** antes de guardarla
3. ✅ El hash nunca debe ser expuesto al cliente

#### Código Frontend (Correcto)
```javascript
// userService.js - create()
const backendData = {
  nombreUsuario: userData.nombreUsuario,
  passUsuario: userData.password,  // ✅ Texto plano, como debe ser
  rolesIds: userData.roles,
};

console.log('📤 [UserService] Creating user with data:', {
  nombreUsuario: backendData.nombreUsuario,
  hasPassword: !!backendData.passUsuario,
  passwordLength: backendData.passUsuario?.length,  // ✅ Muestra solo la longitud
  rolesIds: backendData.rolesIds
});
```

#### Verificación del Backend (Debe Hacer)

El backend Spring Boot debe tener código similar a esto:

```java
// UsuarioService.java o similar
@Service
public class UsuarioService {
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public Usuario createUsuario(UsuarioDTO dto) {
        Usuario usuario = new Usuario();
        usuario.setNombreUsuario(dto.getNombreUsuario());
        
        // ✅ IMPORTANTE: El backend debe hashear la contraseña
        String hashedPassword = passwordEncoder.encode(dto.getPassUsuario());
        usuario.setPassUsuario(hashedPassword);
        
        // Asignar roles...
        
        return usuarioRepository.save(usuario);
    }
}
```

#### Configuración de Spring Security

```java
// SecurityConfig.java
@Configuration
public class SecurityConfig {
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        // ✅ Debe usar BCrypt o similar
        return new BCryptPasswordEncoder();
    }
}
```

### 🔍 Cómo Verificar si el Backend Está Hasheando

#### Opción 1: Verificar en la Base de Datos
```sql
-- Consultar usuarios creados
SELECT id_usuario, nombre_usuario, pass_usuario 
FROM usuario 
ORDER BY id_usuario DESC 
LIMIT 5;

-- Un hash BCrypt se ve así:
-- $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
```

**Hash BCrypt correcto**:
- Comienza con `$2a$` o `$2b$`
- Tiene ~60 caracteres de longitud
- Contiene solo caracteres alfanuméricos, `.`, `/`

**Hash MD5 (menos seguro)**:
- Tiene 32 caracteres hexadecimales

**Texto plano (PROBLEMA)**:
- Se puede leer la contraseña real

#### Opción 2: Ver Logs del Backend
```
📤 [UserService] Creating user with data: 
  {nombreUsuario: "test123", hasPassword: true, passwordLength: 8}
```

En el backend debería haber logs como:
```
[UsuarioService] Encoding password for user: test123
[UsuarioService] Password encoded successfully (length: 60)
```

#### Opción 3: Intentar Login
Si el hash funciona correctamente:
- ✅ Login con la contraseña original → SUCCESS
- ❌ Login con texto diferente → FAIL

### 📊 Logs de Depuración Agregados

Se agregaron logs al frontend para debugging:

```javascript
// Al crear usuario
console.log('📤 [UserService] Creating user with data:', {
  nombreUsuario: backendData.nombreUsuario,
  hasPassword: !!backendData.passUsuario,
  passwordLength: backendData.passUsuario?.length,
  rolesIds: backendData.rolesIds
});

// Después de crear
console.log('✅ [UserService] User created successfully');
console.log('📊 [UserService] Response data:', {
  idUsuario: response.data.idUsuario,
  nombreUsuario: response.data.nombreUsuario,
  hasPassword: !!response.data.passUsuario,
  roles: response.data.roles
});
```

### ⚠️ IMPORTANTE: No Mostrar Contraseñas en Logs

Los logs **NO muestran la contraseña real**, solo información sobre ella:
- ✅ `hasPassword: true` - Indica si hay contraseña
- ✅ `passwordLength: 8` - Longitud de la contraseña
- ❌ `password: "miPassword123"` - NUNCA hacer esto

---

## 📝 Archivos Modificados

| Archivo | Cambios |
|---------|---------|
| `src/pages/UsersPage.jsx` | ✅ Eliminado campo `nombre` del formulario |
| `src/pages/UsersPage.jsx` | ✅ Eliminada columna "Nombre" de la tabla |
| `src/pages/UsersPage.jsx` | ✅ Eliminado campo del modal de vista |
| `src/pages/UsersPage.jsx` | ✅ Eliminada validación del campo `nombre` |
| `src/services/userService.js` | ✅ Eliminado campo `nombre` de create/update |
| `src/services/userService.js` | ✅ Eliminada búsqueda por campo `nombre` |
| `src/services/userService.js` | ✅ Agregados logs de depuración seguros |

---

## ✅ Resultado Final

### Campo "Nombre"
- ✅ Eliminado de todo el componente
- ✅ No causa más errores
- ✅ Interfaz más limpia y precisa

### Hash de Contraseña
- ✅ Frontend envía contraseña en texto plano (correcto)
- ✅ Agregados logs para debugging (sin exponer contraseñas)
- ⚠️ Verificar que el backend esté hasheando correctamente

---

## 🧪 Pruebas Sugeridas

### 1. Verificar Campo "Nombre" Eliminado
```
1. Abrir /users
2. Ver tabla → NO debe haber columna "Nombre"
3. Crear usuario → NO debe pedir "Nombre Completo"
4. Ver detalles → NO debe mostrar "Nombre Completo"
5. Editar usuario → NO debe mostrar campo "Nombre"
```

### 2. Verificar Hash de Contraseña
```
1. Crear usuario con contraseña "test1234"
2. Ver logs en consola del navegador:
   📤 [UserService] Creating user with data: {hasPassword: true, passwordLength: 8}
3. En la base de datos:
   SELECT pass_usuario FROM usuario WHERE nombre_usuario = 'test_usuario';
   → Debe ser un hash BCrypt ($2a$10$...), NO "test1234"
4. Intentar login con el usuario creado
   → Debe funcionar correctamente
```

---

## 🔍 Si el Hash No Funciona

### Verificar en el Backend

1. **Verificar que existe PasswordEncoder**:
```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
```

2. **Verificar que se usa en el servicio**:
```java
@Autowired
private PasswordEncoder passwordEncoder;

public Usuario createUsuario(UsuarioDTO dto) {
    // ...
    String hashed = passwordEncoder.encode(dto.getPassUsuario());
    usuario.setPassUsuario(hashed);
    // ...
}
```

3. **Verificar en el controller**:
```java
@PostMapping
public ResponseEntity<Usuario> createUsuario(@RequestBody UsuarioDTO dto) {
    // Debe llamar al servicio que hashea
    Usuario created = usuarioService.createUsuario(dto);
    return ResponseEntity.ok(created);
}
```

---

## 📚 Documentación Relacionada

- [RESUMEN_USUARIOS.md](./RESUMEN_USUARIOS.md) - Vista general del módulo
- [SOLUCION_ERROR_ROLES_OBJETOS.md](./SOLUCION_ERROR_ROLES_OBJETOS.md) - Mapeo de campos
- [SOLUCION_BUSQUEDA_USUARIOS.md](./SOLUCION_BUSQUEDA_USUARIOS.md) - Filtrado de usuarios

---

**Estado**: ✅ Campo "Nombre" Eliminado | ⚠️ Hash de Contraseña Requiere Verificación en Backend  
**Fecha**: 2025-12-31  
**Versión**: 1.1.0

