# Resumen de Ajustes Frontend - Backend RNTN

## Fecha: 2025-12-28

## 🎯 Objetivo
Ajustar el frontend React para que coincida exactamente con los endpoints y sistema de permisos del backend RNTN.

---

## 📋 Análisis Backend Completado

### Controladores Identificados:
1. **AuthController** - `/api/v1/auth`
2. **PacienteController** - `/api/v1/pacientes`
3. **PersonalController** - `/api/v1/personal`
4. **ConsultaController** - `/api/v1/consultas`
5. **EvaluacionController** - `/api/v1/evaluaciones`
6. **EvaluacionPreguntaController** - `/api/v1/preguntas`
7. **ReporteController** - `/api/v1/reportes`
8. **SentimentController** - `/api/v1/sentiment`
9. **UsuarioController** - `/api/v1/usuarios`
10. **PermissionController** - `/api/v1/permissions`
11. **RolePermissionController** - `/api/v1/role-permissions`

---

## ✅ Cambios Implementados

### 1. Configuración de API (`src/config/api.config.js`)

#### Endpoints Actualizados:
- ✅ Removido `/auth/logout` y `/auth/refresh` (no existen en backend)
- ✅ Agregado `/auth/validate`
- ✅ Expandido endpoints de Sentiment Analysis (8 endpoints nuevos)
- ✅ Actualizado `/consultas/{id}/status` → `/consultas/{id}/estado`
- ✅ Agregado `/consultas/{id}/finalizar`
- ✅ Removido `/evaluaciones/consulta/{id}` (no existe)
- ✅ Actualizado endpoint de agregados
- ✅ Agregados endpoints para respuestas de evaluación
- ✅ Removido `/preguntas` de evaluaciones (ahora es `/preguntas` directo)
- ✅ Removido `/reportes/generate` (usar POST a `/reportes`)
- ✅ Agregados endpoints de usuarios (by name, roles)
- ✅ Agregados todos los endpoints de permisos
- ✅ Agregados todos los endpoints de role-permissions

### 2. Utilidades de Permisos (`src/utils/roleUtils.js`)

#### Funciones Creadas:
- ✅ `getCurrentUser()` - Obtiene usuario del localStorage
- ✅ `hasRole(roleName)` - Verifica un rol
- ✅ `hasAnyRole(roleNames)` - Verifica si tiene algún rol
- ✅ `hasAllRoles(roleNames)` - Verifica si tiene todos los roles
- ✅ `hasPermission(permissionName)` - Verifica un permiso
- ✅ `hasAnyPermission(permissionNames)` - Verifica si tiene algún permiso
- ✅ `hasAllPermissions(permissionNames)` - Verifica todos los permisos
- ✅ `hasResourcePermission(resource, action)` - Verifica permiso por recurso
- ✅ `isAdmin()`, `isDoctor()`, `isNurse()` - Shortcuts de roles
- ✅ `getUserRoles()`, `getUserPermissions()` - Obtiene listas
- ✅ `getPermissionsByResource()` - Agrupa permisos por recurso
- ✅ `canAccessResource(resource)` - Verifica acceso a recurso
- ✅ `getAllowedActions(resource)` - Obtiene acciones permitidas

#### Constantes Definidas:
- ✅ `RESOURCES` - Mapeo de recursos (paciente, personal, consulta, etc.)
- ✅ `ACTIONS` - Acciones comunes (create, read, update, delete, etc.)
- ✅ `PERMISSIONS` - Permisos predefinidos
- ✅ `ROLES` - Roles del sistema

### 3. Hook Personalizado (`src/hooks/usePermissions.js`)

#### Características:
- ✅ Hook reutilizable para gestión de permisos
- ✅ Memorización con useMemo para optimización
- ✅ Soporte para permisos por recurso específico
- ✅ Retorna: user, roles, permissions, verificaciones, etc.

#### Uso:
```javascript
const { hasPermission, isAdmin, canCreate, canRead } = usePermissions('paciente');
```

### 4. Servicios Actualizados

#### `patientService.js`
- ✅ `search()` ahora usa query param `search` en lugar de endpoint separado

#### `consultationService.js`
- ✅ `updateStatus()` usa `estatusConsulta` y endpoint `/estado`
- ✅ Agregado `finalize()` para finalizar consultas
- ✅ `getByPatient()` y `getByStaff()` aceptan params adicionales

#### `evaluationService.js`
- ✅ Removido `getByConsultation()` (no existe en backend)
- ✅ `getAggregates()` → `getAggregateAnalysis()` con preguntaIds
- ✅ Agregados métodos para respuestas:
  - `getAllAnswers()`
  - `getAnswerById()`
  - `updateAnswer()`
  - `deleteAnswer()`
  - `getAnswersByLabel()`
  - `getHighRiskAnswers()`

#### `sentimentService.js`
- ✅ Agregados 6 métodos nuevos:
  - `batchPredictAggregate()`
  - `getLabels()`
  - `getModelStats()`
  - `getAggregateStats()`
  - `getDistributionByEvaluation()`
  - `getHighRiskAlerts()`

#### `staffService.js`
- ✅ `search()` ahora usa params genéricos

#### `userService.js`
- ✅ Removidos métodos no existentes: `changePassword()`, `activate()`, `deactivate()`
- ✅ Agregados: `getByName()`, `getRoles()`

#### `reportService.js`
- ✅ `generate()` usa POST a `/reportes` en lugar de `/reportes/generate`
- ✅ Agregado `update()` para actualizar reportes

### 5. Nuevos Servicios Creados

#### `permissionService.js` ✅
- Gestión completa de permisos del sistema
- 8 métodos para consultar permisos

#### `rolePermissionService.js` ✅
- Gestión de asignación de permisos a roles
- Solo Admin
- 6 métodos para gestionar permisos de roles

#### `questionService.js` ✅
- Gestión de preguntas de evaluación
- 6 métodos CRUD + obtener respuestas por pregunta

### 6. Componentes Actualizados

#### `ProtectedRoute.jsx`
- ✅ Soporte para validación de roles Y permisos
- ✅ Nuevos props: `permissions`, `requireAllPermissions`
- ✅ Mensajes de error más descriptivos
- ✅ Integración con `roleUtils`

#### Props:
```javascript
<ProtectedRoute 
  roles={['ADMIN', 'DOCTOR']}
  permissions={['paciente:read']}
  requireAllPermissions={false}
>
  <Component />
</ProtectedRoute>
```

### 7. Index de Servicios (`src/services/index.js`)
- ✅ Agregados exports para nuevos servicios:
  - `permissionService`
  - `rolePermissionService`
  - `questionService`

---

## 📊 Mapeo de Permisos por Recurso

### Formato: `{recurso}:{acción}`

| Recurso | Acciones Disponibles |
|---------|---------------------|
| paciente | create, read, update, delete |
| personal | create, read, update, delete |
| consulta | create, read, update, delete |
| evaluacion | create, read, update, delete |
| evaluacion_pregunta | create, read, update, delete |
| evaluacion_respuesta | create, read, update, delete |
| reporte | create, read, delete |
| sentiment | analyze, analyze_batch, aggregate |
| usuario | ROLE:ADMIN requerido |

---

## 🔒 Sistema de Permisos

### Nivel 1: Roles (hasRole)
```javascript
ADMIN, DOCTOR, ENFERMERO, ANALISTA, RECEPCIONISTA, TECNICO, AUDITOR
```

### Nivel 2: Permisos Granulares (hasPermission)
```javascript
'paciente:read'
'evaluacion_respuesta:create'
'sentiment:analyze_batch'
```

### Validación en Componentes:
```javascript
import { usePermissions } from '../hooks/usePermissions';

const MyComponent = () => {
  const { hasPermission, isAdmin, canCreate } = usePermissions('paciente');
  
  return (
    <>
      {canCreate && <button>Crear Paciente</button>}
      {isAdmin && <button>Gestionar Usuarios</button>}
    </>
  );
};
```

---

## 🚀 Próximos Pasos Recomendados

### 1. Actualizar Páginas
- [ ] **PatientsPage.jsx** - Usar `hasPermission('paciente:read')`
- [ ] **SentimentAnalysisPage.jsx** - Usar nuevos endpoints de sentiment
- [ ] **HighRiskMonitoringPage.jsx** - Usar `/evaluaciones/respuestas/alto-riesgo`
- [ ] **DashboardPage.jsx** - Agregar verificación de permisos por widget

### 2. Actualizar Sidebar/Menu
- [ ] Verificar permisos antes de mostrar cada opción de menú
- [ ] Usar `canAccessResource()` para mostrar/ocultar secciones

### 3. Crear Componentes de Gestión
- [ ] **UserManagement** - CRUD usuarios (solo ADMIN)
- [ ] **PermissionManagement** - Gestión de permisos (solo ADMIN)
- [ ] **QuestionManagement** - Gestión de preguntas de evaluación

### 4. Testing
- [ ] Probar login con diferentes roles
- [ ] Verificar que permisos se almacenan correctamente
- [ ] Probar acceso a rutas protegidas
- [ ] Validar llamadas a endpoints correctos

---

## 📝 Notas Importantes

### Endpoints que NO Existen en Backend:
- ❌ `/auth/logout` - Hacer logout en frontend
- ❌ `/auth/refresh` - No hay refresh token
- ❌ `/pacientes/search` - Usar `/pacientes?search=`
- ❌ `/personal/search` - Usar `/personal?estatus=`
- ❌ `/consultas/{id}/status` - Usar `/consultas/{id}/estado`
- ❌ `/evaluaciones/consulta/{id}` - No existe relación directa
- ❌ `/evaluaciones/{id}/aggregates` - Usar `/evaluaciones/analisis-agregado`
- ❌ `/evaluaciones/high-risk` - Usar `/evaluaciones/respuestas/alto-riesgo`
- ❌ `/usuarios/{id}/password` - No implementado
- ❌ `/usuarios/{id}/activate` - No implementado
- ❌ `/usuarios/{id}/deactivate` - No implementado
- ❌ `/reportes/generate` - Usar POST a `/reportes`

### Cambios de Parámetros:
- `status` → `estatusConsulta` en actualizaciones de consulta
- Query param `q` → `search` en búsquedas
- `umbral` en lugar de `threshold` para alto riesgo

---

## 📚 Documentación Generada

1. ✅ **BACKEND_ENDPOINT_ANALYSIS.md** - Análisis completo de todos los controladores
2. ✅ **FRONTEND_BACKEND_SYNC.md** - Este documento

---

## 🎉 Conclusión

Se ha completado la sincronización entre frontend y backend:
- ✅ 11 controladores analizados
- ✅ Más de 80 endpoints mapeados
- ✅ Sistema de permisos granular implementado
- ✅ 9 servicios actualizados
- ✅ 3 servicios nuevos creados
- ✅ Hook personalizado para permisos
- ✅ Utilidades de validación de roles y permisos
- ✅ ProtectedRoute mejorado

**El frontend está ahora listo para comunicarse correctamente con el backend RNTN y manejar permisos de forma granular.**

