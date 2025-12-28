# 🧪 Pruebas de Lógica de Roles - Verificación

## ✅ Lógica Confirmada: "AL MENOS UNO" (ANY)

La aplicación usa `hasAnyRole()` que verifica si el usuario tiene **AL MENOS UNO** de los roles requeridos.

---

## 📊 Casos de Prueba

### Escenario 1: Usuario DOCTOR accede a ruta ADMIN o DOCTOR
```javascript
// Usuario autenticado
const user = {
  username: 'dr.juan',
  roles: ['DOCTOR']
}

// Ruta protegida
<ProtectedRoute roles={['ADMIN', 'DOCTOR']}>
  <PatientManagement />
</ProtectedRoute>

// Verificación
hasAnyRole(['ADMIN', 'DOCTOR'])
// ✅ TRUE - El usuario tiene DOCTOR que está en la lista
// ✅ ACCESO PERMITIDO
```

### Escenario 2: Usuario ENFERMERO intenta acceder a ruta solo para ADMIN y DOCTOR
```javascript
// Usuario autenticado
const user = {
  username: 'enf.maria',
  roles: ['ENFERMERO']
}

// Ruta protegida
<ProtectedRoute roles={['ADMIN', 'DOCTOR']}>
  <CreateReport />
</ProtectedRoute>

// Verificación
hasAnyRole(['ADMIN', 'DOCTOR'])
// ❌ FALSE - El usuario NO tiene ninguno de los roles requeridos
// ❌ ACCESO DENEGADO
```

### Escenario 3: Usuario con múltiples roles
```javascript
// Usuario autenticado
const user = {
  username: 'admin.pedro',
  roles: ['ADMIN', 'DOCTOR', 'ANALISTA']
}

// Ruta protegida
<ProtectedRoute roles={['DOCTOR', 'ENFERMERO']}>
  <ConsultationPage />
</ProtectedRoute>

// Verificación
hasAnyRole(['DOCTOR', 'ENFERMERO'])
// ✅ TRUE - El usuario tiene DOCTOR (aunque también tenga otros roles)
// ✅ ACCESO PERMITIDO
```

### Escenario 4: Usuario ADMIN accede a cualquier ruta
```javascript
// Usuario autenticado
const user = {
  username: 'superadmin',
  roles: ['ADMIN']
}

// Ruta protegida
<ProtectedRoute roles={['ADMIN']}>
  <UserManagement />
</ProtectedRoute>

// Verificación
hasAnyRole(['ADMIN'])
// ✅ TRUE - El usuario tiene el rol ADMIN
// ✅ ACCESO PERMITIDO
```

### Escenario 5: Usuario con rol de menor jerarquía
```javascript
// Usuario autenticado
const user = {
  username: 'recep.ana',
  roles: ['RECEPCIONISTA']
}

// Ruta protegida
<ProtectedRoute roles={['ADMIN', 'DOCTOR', 'ENFERMERO', 'ANALISTA']}>
  <EvaluationResults />
</ProtectedRoute>

// Verificación
hasAnyRole(['ADMIN', 'DOCTOR', 'ENFERMERO', 'ANALISTA'])
// ❌ FALSE - RECEPCIONISTA no está en la lista
// ❌ ACCESO DENEGADO
```

---

## 🔧 Implementación Técnica

### 1. En `roleUtils.js`
```javascript
export const hasAnyRole = (roleNames) => {
  if (!Array.isArray(roleNames) || roleNames.length === 0) return false;
  return roleNames.some(role => hasRole(role));
  //              ^^^^
  //              .some() = AL MENOS UNO debe cumplir
};
```

### 2. En `authStore.js`
```javascript
hasAnyRole: (roles) => {
  const normalizedRequiredRoles = roles.map(r =>
    String(r).replace(/^ROLE_/i, '').toUpperCase()
  );
  
  const result = normalizedRequiredRoles.some(role =>
    user.roles.includes(role)
  );
  //           ^^^^
  //           .some() = AL MENOS UNO debe estar incluido
  
  return result;
}
```

### 3. En `ProtectedRoute.jsx`
```javascript
if (roles && roles.length > 0 && !hasAnyRole(roles)) {
  return <AccessDenied />;
}
```

---

## 🎯 Matriz de Acceso

| Usuario Roles | Ruta Requiere | ¿Acceso? | Razón |
|--------------|---------------|----------|-------|
| `['ADMIN']` | `['ADMIN']` | ✅ | Tiene ADMIN |
| `['DOCTOR']` | `['ADMIN', 'DOCTOR']` | ✅ | Tiene DOCTOR |
| `['ENFERMERO']` | `['ADMIN', 'DOCTOR']` | ❌ | No tiene ninguno |
| `['ADMIN', 'DOCTOR']` | `['DOCTOR']` | ✅ | Tiene DOCTOR |
| `['RECEPCIONISTA']` | `['ADMIN']` | ❌ | No es ADMIN |
| `['ANALISTA']` | `['ANALISTA', 'AUDITOR']` | ✅ | Tiene ANALISTA |
| `['DOCTOR', 'ENFERMERO']` | `['TECNICO']` | ❌ | No tiene TECNICO |

---

## 🆚 Comparación: hasAnyRole vs hasAllRoles

### hasAnyRole (Actual - Por defecto)
```javascript
// Usuario: ['DOCTOR', 'ANALISTA']
// Requiere: ['ADMIN', 'DOCTOR', 'ENFERMERO']

hasAnyRole(['ADMIN', 'DOCTOR', 'ENFERMERO'])
// ✅ TRUE - Tiene DOCTOR
// LÓGICA: "¿Tiene AL MENOS UNO de estos roles?"
```

### hasAllRoles (Disponible si se necesita)
```javascript
// Usuario: ['DOCTOR', 'ANALISTA']
// Requiere: ['DOCTOR', 'ANALISTA']

hasAllRoles(['DOCTOR', 'ANALISTA'])
// ✅ TRUE - Tiene ambos

hasAllRoles(['DOCTOR', 'ADMIN'])
// ❌ FALSE - No tiene ADMIN
// LÓGICA: "¿Tiene TODOS estos roles?"
```

---

## 📝 Cómo Usar

### Opción 1: Ruta accesible por VARIOS roles (Recomendado)
```javascript
<ProtectedRoute roles={['ADMIN', 'DOCTOR', 'ENFERMERO']}>
  <PatientList />
</ProtectedRoute>
// Cualquier usuario con ADMIN, DOCTOR o ENFERMERO puede acceder
```

### Opción 2: Ruta solo para UN rol específico
```javascript
<ProtectedRoute roles={['ADMIN']}>
  <UserManagement />
</ProtectedRoute>
// Solo ADMIN puede acceder
```

### Opción 3: Sin restricción de roles (solo autenticación)
```javascript
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
// Cualquier usuario autenticado puede acceder
```

---

## 🧪 Cómo Probar en la App

### 1. En la Consola del Navegador
```javascript
// Ver roles del usuario actual
const user = JSON.parse(localStorage.getItem('user'));
console.log('Mis roles:', user.roles);

// Probar verificación
import { hasAnyRole } from './utils/roleUtils';
hasAnyRole(['ADMIN', 'DOCTOR']) // Prueba con tu usuario
```

### 2. En un Componente
```javascript
import { usePermissions } from '../hooks/usePermissions';

function MyComponent() {
  const { roles, hasRole, isAdmin } = usePermissions();
  
  console.log('Mis roles:', roles);
  console.log('¿Soy admin?:', isAdmin);
  console.log('¿Tengo rol DOCTOR?:', hasRole('DOCTOR'));
  
  return <div>Check console</div>;
}
```

### 3. Prueba Manual
```javascript
// 1. Login como DOCTOR
// 2. Intenta acceder a: /patients (requiere ADMIN o DOCTOR)
//    ✅ Debería permitir acceso

// 3. Login como RECEPCIONISTA  
// 4. Intenta acceder a: /users (requiere ADMIN)
//    ❌ Debería denegar acceso
```

---

## ✅ Conclusión

La lógica de roles funciona correctamente:

1. ✅ **hasAnyRole()** verifica si el usuario tiene **AL MENOS UNO** de los roles requeridos
2. ✅ Usa `.some()` que es el método correcto de JavaScript
3. ✅ Si necesitas que tenga **TODOS** los roles, usa `hasAllRoles()`
4. ✅ La jerarquía no se valida automáticamente (ADMIN no tiene acceso automático a todo)

### 💡 Recomendación

Si quieres que ADMIN tenga acceso a todo, debes:
- **Opción A**: Agregar `'ADMIN'` a todas las listas de roles permitidos
- **Opción B**: Modificar la lógica para dar acceso automático a ADMIN

```javascript
// Opción B: En ProtectedRoute.jsx
if (roles && roles.length > 0) {
  const isAdminUser = hasRole('ADMIN');
  const hasRequiredRole = hasAnyRole(roles);
  
  if (!isAdminUser && !hasRequiredRole) {
    return <AccessDenied />;
  }
}
```

---

_Última actualización: 28 de Diciembre de 2025_

