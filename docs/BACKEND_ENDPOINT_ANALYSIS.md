# Backend Endpoint Analysis - RNTN API

## Análisis de Controladores Backend

### 1. AuthController
**Base Path:** `/api/v1/auth`

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| POST | `/login` | Autenticar usuario | Público |
| GET | `/validate` | Validar token JWT | Público |

**Respuesta de Login:**
```json
{
  "token": "eyJ...",
  "type": "Bearer",
  "username": "admin",
  "roles": ["ADMIN", "DOCTOR"],
  "permissions": ["paciente:read", "paciente:create", ...],
  "expiresIn": 3600000
}
```

---

### 2. PacienteController
**Base Path:** `/api/v1/pacientes`

| Método | Endpoint | Descripción | Permiso Requerido |
|--------|----------|-------------|-------------------|
| POST | `/` | Crear paciente | `paciente:create` |
| GET | `/{id}` | Obtener paciente | `paciente:read` |
| GET | `/` | Listar pacientes | `paciente:read` |
| PUT | `/{id}` | Actualizar paciente | `paciente:update` |
| DELETE | `/{id}` | Eliminar paciente | `paciente:delete` |

**Query Params GET:**
- `estatus`: Filtrar por estatus
- `search`: Buscar por nombre o documento
- Paginación: `page`, `size`, `sort`

---

### 3. PersonalController
**Base Path:** `/api/v1/personal`

| Método | Endpoint | Descripción | Permiso Requerido |
|--------|----------|-------------|-------------------|
| POST | `/` | Crear personal | `personal:create` |
| GET | `/{id}` | Obtener personal | `personal:read` |
| GET | `/` | Listar personal | `personal:read` |
| PUT | `/{id}` | Actualizar personal | `personal:update` |
| DELETE | `/{id}` | Eliminar personal | `personal:delete` |

---

### 4. ConsultaController
**Base Path:** `/api/v1/consultas`

| Método | Endpoint | Descripción | Permiso Requerido |
|--------|----------|-------------|-------------------|
| POST | `/` | Crear consulta | `consulta:create` |
| GET | `/{id}` | Obtener consulta | `consulta:read` |
| GET | `/paciente/{idPaciente}` | Listar por paciente | `consulta:read` |
| GET | `/personal/{idPersonal}` | Listar por personal | `consulta:read` |
| PATCH | `/{id}/estado` | Actualizar estado | `consulta:update` |
| POST | `/{id}/finalizar` | Finalizar consulta | `consulta:update` |

**Query Params GET /paciente/{id}:**
- `desde`: Fecha inicio (ISO DateTime)
- `hasta`: Fecha fin (ISO DateTime)
- Paginación: `page`, `size`

---

### 5. EvaluacionController
**Base Path:** `/api/v1/evaluaciones`

| Método | Endpoint | Descripción | Permiso Requerido |
|--------|----------|-------------|-------------------|
| POST | `/` | Crear evaluación | `evaluacion:create` |
| GET | `/{id}` | Obtener evaluación | `evaluacion:read` |
| PUT | `/{id}` | Actualizar evaluación | `evaluacion:update` |
| DELETE | `/{id}` | Eliminar evaluación | `evaluacion:delete` |
| POST | `/respuestas` | **Registrar respuesta con análisis** | `evaluacion_respuesta:create` |
| GET | `/respuestas` | Listar respuestas | `evaluacion_respuesta:read` |
| GET | `/respuestas/{id}` | Obtener respuesta | `evaluacion_respuesta:read` |
| GET | `/respuestas/label/{label}` | Buscar por label | `evaluacion_respuesta:read` |
| GET | `/respuestas/alto-riesgo` | Alto riesgo | `evaluacion_respuesta:read` |
| PUT | `/respuestas/{id}` | Actualizar respuesta | `evaluacion_respuesta:update` |
| DELETE | `/respuestas/{id}` | Eliminar respuesta | `evaluacion_respuesta:delete` |
| GET | `/analisis-agregado` | Análisis agregado | `evaluacion_respuesta:read` |

---

### 6. EvaluacionPreguntaController
**Base Path:** `/api/v1/preguntas`

| Método | Endpoint | Descripción | Permiso Requerido |
|--------|----------|-------------|-------------------|
| POST | `/` | Crear pregunta | `evaluacion_pregunta:create` |
| GET | `/{id}` | Obtener pregunta | `evaluacion_pregunta:read` |
| GET | `/` | Listar preguntas | `evaluacion_pregunta:read` |
| PUT | `/{id}` | Actualizar pregunta | `evaluacion_pregunta:update` |
| DELETE | `/{id}` | Eliminar pregunta | `evaluacion_pregunta:delete` |
| GET | `/{idPregunta}/respuestas` | Listar respuestas | `evaluacion_pregunta:read` |

---

### 7. ReporteController
**Base Path:** `/api/v1/reportes`

| Método | Endpoint | Descripción | Permiso Requerido |
|--------|----------|-------------|-------------------|
| POST | `/` | Generar reporte | `reporte:create` |
| GET | `/{id}` | Obtener reporte | `reporte:read` |
| GET | `/` | Listar reportes | `reporte:read` |
| GET | `/usuario/{idUsuario}` | Por usuario | `reporte:read` |
| GET | `/evaluacion/{idEvaluacion}` | Por evaluación | `reporte:read` |
| PUT | `/{id}` | Actualizar reporte | `reporte:create` |
| DELETE | `/{id}` | Eliminar reporte | `reporte:delete` |

---

### 8. SentimentController
**Base Path:** `/api/v1/sentiment`

| Método | Endpoint | Descripción | Permiso Requerido |
|--------|----------|-------------|-------------------|
| POST | `/predict` | Predecir sentimiento | `sentiment:analyze` |
| POST | `/predict/batch` | Predicción por lote | `sentiment:analyze_batch` |
| POST | `/predict/batch/aggregate` | Batch con agregados | `sentiment:aggregate` |
| GET | `/labels` | Obtener labels | `sentiment:analyze` |
| GET | `/model/stats` | Estadísticas modelo | `sentiment:analyze` |
| POST | `/aggregate/stats` | Stats desde BD | `sentiment:aggregate` |
| GET | `/aggregate/evaluation/{id}` | Distribución | `sentiment:aggregate` |
| GET | `/alerts/high-risk` | Alertas riesgo | `sentiment:aggregate` |

---

### 9. UsuarioController
**Base Path:** `/api/v1/usuarios`

| Método | Endpoint | Descripción | Permiso Requerido |
|--------|----------|-------------|-------------------|
| POST | `/` | Crear usuario | `ROLE:ADMIN` |
| GET | `/{id}` | Obtener usuario | `ROLE:ADMIN` |
| GET | `/nombre/{nombreUsuario}` | Por nombre | `ROLE:ADMIN` |
| GET | `/` | Listar usuarios | `ROLE:ADMIN` |
| PUT | `/{id}` | Actualizar usuario | `ROLE:ADMIN` |
| DELETE | `/{id}` | Eliminar usuario | `ROLE:ADMIN` |
| GET | `/roles` | Listar roles | `ROLE:ADMIN` |

---

### 10. PermissionController
**Base Path:** `/api/v1/permissions`

| Método | Endpoint | Descripción | Permiso Requerido |
|--------|----------|-------------|-------------------|
| GET | `/` | Listar permisos | `ROLE:ADMIN` |
| GET | `/{id}` | Obtener permiso | `ROLE:ADMIN` |
| GET | `/by-resource` | Por recurso | `ROLE:ADMIN` |
| GET | `/resources` | Listar recursos | `ROLE:ADMIN` |
| GET | `/actions` | Listar acciones | `ROLE:ADMIN` |
| GET | `/my-permissions` | Mis permisos | Autenticado |
| GET | `/my-permissions/by-resource` | Mis permisos agrupados | Autenticado |
| GET | `/check/{permissionName}` | Verificar permiso | Autenticado |

---

### 11. RolePermissionController
**Base Path:** `/api/v1/role-permissions`

| Método | Endpoint | Descripción | Permiso Requerido |
|--------|----------|-------------|-------------------|
| GET | `/role/{roleId}` | Permisos de rol | `ROLE:ADMIN` |
| PUT | `/assign` | Asignar permisos | `ROLE:ADMIN` |
| POST | `/role/{roleId}/add` | Agregar permisos | `ROLE:ADMIN` |
| DELETE | `/role/{roleId}/remove` | Remover permisos | `ROLE:ADMIN` |
| GET | `/summary` | Resumen permisos | `ROLE:ADMIN` |
| GET | `/role/{roleId}/has/{permissionName}` | Verificar permiso | `ROLE:ADMIN` |

---

## Permisos por Recurso

### Formato de Permisos
`{recurso}:{acción}`

### Recursos Identificados
1. **paciente** - Gestión de pacientes
2. **personal** - Gestión de personal médico
3. **consulta** - Gestión de consultas
4. **evaluacion** - Gestión de evaluaciones
5. **evaluacion_pregunta** - Gestión de preguntas
6. **evaluacion_respuesta** - Gestión de respuestas
7. **reporte** - Gestión de reportes
8. **sentiment** - Análisis de sentimientos
9. **usuario** - Gestión de usuarios (solo ADMIN)

### Acciones Comunes
- `create` - Crear
- `read` - Leer/Consultar
- `update` - Actualizar
- `delete` - Eliminar
- `analyze` - Analizar (sentimientos)
- `analyze_batch` - Análisis por lote
- `aggregate` - Análisis agregado

---

## Cambios Requeridos en Frontend

### 1. Endpoints que NO existen en el backend
- `/pacientes/search` → Usar `/pacientes?search={term}`
- `/personal/search` → Usar `/personal?search={term}` (si existe)
- `/consultas/{id}/status` → Usar `/consultas/{id}/estado`
- `/evaluaciones/consulta/{id}` → NO EXISTE
- `/evaluaciones/{id}/aggregates` → Usar `/evaluaciones/analisis-agregado?preguntaIds=...`
- `/evaluaciones/high-risk` → Usar `/evaluaciones/respuestas/alto-riesgo`
- `/usuarios/{id}/password` → NO EXISTE
- `/usuarios/{id}/activate` → NO EXISTE
- `/usuarios/{id}/deactivate` → NO EXISTE
- `/reportes/generate` → Usar `/reportes` (POST)

### 2. Nuevos Endpoints Disponibles
- `/evaluaciones/respuestas/label/{label}` - Filtrar por sentimiento
- `/sentiment/predict/batch/aggregate` - Análisis batch agregado
- `/sentiment/aggregate/evaluation/{id}` - Distribución por evaluación
- `/sentiment/alerts/high-risk` - Alertas de alto riesgo
- `/permissions/my-permissions` - Permisos del usuario
- `/permissions/check/{permissionName}` - Verificar permiso
- `/usuarios/nombre/{nombreUsuario}` - Buscar usuario por nombre
- `/usuarios/roles` - Lista de roles disponibles
- `/consultas/{id}/finalizar` - Finalizar consulta
- `/preguntas/{id}/respuestas` - Respuestas por pregunta

### 3. Validación de Permisos
El frontend debe verificar permisos usando el formato:
```javascript
// Verificar si el usuario tiene permiso
const hasPermission = (permissionName) => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.permissions?.includes(permissionName);
};

// Verificar si tiene un rol específico
const hasRole = (roleName) => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.roles?.includes(roleName);
};
```

### 4. Componentes que Necesitan Ajuste
- **PatientsPage** - Ajustar búsqueda y verificar `paciente:read`
- **SentimentAnalysisPage** - Ajustar endpoints y verificar `sentiment:analyze`
- **HighRiskMonitoringPage** - Usar `/evaluaciones/respuestas/alto-riesgo`
- **UserManagement** - Verificar `ROLE:ADMIN` y ajustar endpoints

---

## Resumen de Acciones

✅ **Actualizar** `api.config.js` con endpoints correctos
✅ **Actualizar** servicios para usar endpoints correctos
✅ **Crear** `roleUtils.js` con funciones de validación de permisos
✅ **Actualizar** componentes para verificar permisos antes de renderizar
✅ **Ajustar** `ProtectedRoute.jsx` para validar permisos granulares
✅ **Crear** hook `usePermissions` para facilitar validación

