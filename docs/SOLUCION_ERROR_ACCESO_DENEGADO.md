# 🔧 Solución: Error "Acceso Denegado" al hacer clic en menú

## ❌ Problema Reportado
```
Acceso Denegado
No tiene los roles necesarios para acceder a esta página.
Roles requeridos: ADMIN, DOCTOR, ENFERMERO, RECEPCIONISTA
```

---

## ✅ Solución Aplicada

### 1. **Corrección en QuickAccessMenu.jsx**
Se cambió el import de `hasAnyRole` para usar la función correcta de `roleUtils`:

**Antes:**
```javascript
import { useAuthStore } from '../../store/authStore';
const { hasAnyRole } = useAuthStore();
```

**Después:**
```javascript
import { hasAnyRole } from '../../utils/roleUtils';
// Ya no se obtiene hasAnyRole del store
```

### 2. **Corrección en Sidebar.jsx**
Se aplicó el mismo cambio:

**Antes:**
```javascript
const { hasAnyRole, user } = useAuthStore();
```

**Después:**
```javascript
import { hasAnyRole } from '../../utils/roleUtils';
const { user } = useAuthStore();
```

---

## 🔍 Panel de Diagnóstico Agregado

Se creó **RoleDebugPanel.jsx** y se agregó temporalmente al Dashboard para diagnosticar el problema.

### Cómo usarlo:

1. **Ejecuta la aplicación:**
   ```bash
   npm run dev
   ```

2. **Haz login con tus credenciales**

3. **Ve al Dashboard** - Verás un panel amarillo con información de debug

4. **Revisa la información:**
   - ✅ **Usuario desde Store** - Debe mostrar tu usuario con roles
   - ✅ **Roles del Usuario** - Debe mostrar badges verdes con tus roles
   - ✅ **Test de Acceso a Rutas** - Debe mostrar qué rutas puedes acceder

---

## 🎯 Posibles Causas del Problema

### Causa 1: Usuario sin roles (Más probable)
**Síntoma:** En el panel de debug ves "⚠️ Sin roles"

**Solución:**
- El backend no está enviando roles en la respuesta de login
- Verifica que el backend retorne:
  ```json
  {
    "token": "...",
    "username": "admin",
    "roles": ["ADMIN", "DOCTOR"],
    "permissions": ["paciente:read", ...],
    "expiresIn": 3600000
  }
  ```

### Causa 2: Roles con formato incorrecto
**Síntoma:** En el panel de debug ves roles pero aún así no funciona

**Solución:**
- Verifica que los roles vengan sin prefijo "ROLE_"
- El sistema espera: `["ADMIN", "DOCTOR"]`
- NO: `["ROLE_ADMIN", "ROLE_DOCTOR"]`

### Causa 3: Token expirado o inválido
**Síntoma:** El usuario aparece pero sin roles/permisos

**Solución:**
- Cierra sesión y vuelve a hacer login
- Limpia localStorage: `localStorage.clear()` en la consola

### Causa 4: Usuario de prueba sin roles asignados
**Síntoma:** Login exitoso pero sin roles

**Solución:**
- Verifica en el backend que el usuario tenga roles asignados
- Ejecuta en el backend (si es necesario):
  ```sql
  SELECT * FROM usuario_roles WHERE id_usuario = X;
  ```

---

## 🧪 Pasos para Diagnosticar

### Paso 1: Verifica el Panel de Debug en el Dashboard
```
✅ Debe mostrar:
   - Usuario con nombre
   - Lista de roles (badges verdes)
   - Lista de permisos (badges azules)
   - Tests de acceso con checkmarks verdes
```

### Paso 2: Verifica la Consola del Navegador (F12)
```javascript
// Ejecuta esto en la consola:
const user = JSON.parse(localStorage.getItem('user'));
console.log('Usuario:', user);
console.log('Roles:', user.roles);
console.log('Permisos:', user.permissions);
```

### Paso 3: Verifica el Network Tab
1. Abre DevTools (F12)
2. Ve a la pestaña Network
3. Filtra por "auth/login"
4. Verifica la respuesta del servidor
5. Debe incluir `roles` y `permissions`

### Paso 4: Prueba Manual
```javascript
// En la consola del navegador:
import { hasAnyRole } from './utils/roleUtils';

// Prueba con tus roles
hasAnyRole(['ADMIN', 'DOCTOR']) // Debe retornar true o false
```

---

## 📋 Checklist de Verificación

- [ ] El backend retorna roles en la respuesta de login
- [ ] Los roles vienen sin prefijo "ROLE_"
- [ ] Los roles se almacenan en localStorage
- [ ] El panel de debug muestra los roles correctamente
- [ ] hasAnyRole retorna true para roles que tienes
- [ ] Las rutas en App.jsx tienen los roles correctos
- [ ] QuickAccessMenu usa hasAnyRole de roleUtils
- [ ] Sidebar usa hasAnyRole de roleUtils

---

## 🔨 Archivos Modificados

1. ✅ `src/components/common/QuickAccessMenu.jsx` - Corregido import
2. ✅ `src/components/layout/Sidebar.jsx` - Corregido import
3. ✅ `src/components/common/RoleDebugPanel.jsx` - Creado (temporal)
4. ✅ `src/pages/DashboardPage.jsx` - Agregado panel de debug

---

## 🚀 Próximos Pasos

### Una vez que el problema esté resuelto:

1. **Remover el Panel de Debug:**
   ```javascript
   // En DashboardPage.jsx, elimina estas líneas:
   import { RoleDebugPanel } from '../components/common/RoleDebugPanel';
   <RoleDebugPanel />
   ```

2. **Verificar todas las rutas funcionan:**
   - [ ] /patients
   - [ ] /consultations
   - [ ] /evaluations
   - [ ] /sentiment
   - [ ] /high-risk
   - [ ] /reports
   - [ ] /users (solo ADMIN)

3. **Probar con diferentes usuarios/roles**

---

## 💡 Ejemplo de Usuario Correcto

```json
{
  "username": "admin",
  "nombre": "Administrador",
  "roles": ["ADMIN"],
  "permissions": [
    "paciente:read",
    "paciente:create",
    "paciente:update",
    "paciente:delete",
    "personal:read",
    "consulta:read",
    "evaluacion:read",
    "reporte:read"
  ]
}
```

---

## 📞 Si el Problema Persiste

1. **Verifica el backend:**
   - ¿Está corriendo?
   - ¿El endpoint `/api/v1/auth/login` funciona?
   - ¿Retorna la estructura correcta?

2. **Limpia el caché:**
   ```bash
   # En la consola del navegador:
   localStorage.clear()
   sessionStorage.clear()
   # Luego recarga la página
   ```

3. **Verifica el token JWT:**
   - Ve a jwt.io
   - Pega tu token
   - Verifica el payload incluye roles

---

## ✅ Confirmación de Solución

Una vez que funcione, deberías ver:
- ✅ Todos los botones del menú visibles según tus roles
- ✅ Al hacer clic, navegas correctamente sin error
- ✅ El panel de debug muestra checkmarks verdes en todas las rutas permitidas

---

_Última actualización: 28 de Diciembre de 2025_

