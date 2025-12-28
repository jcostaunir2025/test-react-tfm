# Guía Rápida - Sistema de Permisos Frontend

## 🎯 Validación de Permisos en Componentes

### 1. Usando el Hook usePermissions

```javascript
import { usePermissions } from '../hooks/usePermissions';

function MyComponent() {
  // Sin recurso específico
  const { isAdmin, hasPermission } = usePermissions();
  
  // Con recurso específico
  const { canRead, canCreate, canUpdate, canDelete } = usePermissions('paciente');
  
  return (
    <div>
      {canCreate && <button>Crear Paciente</button>}
      {canRead && <PatientList />}
      {isAdmin && <AdminPanel />}
    </div>
  );
}
```

### 2. Usando Funciones Directas

```javascript
import { hasPermission, hasRole, isAdmin } from '../utils/roleUtils';

function MyComponent() {
  if (!hasPermission('paciente:read')) {
    return <AccessDenied />;
  }
  
  return (
    <div>
      <PatientList />
      {hasPermission('paciente:create') && <CreateButton />}
      {isAdmin() && <AdminSettings />}
    </div>
  );
}
```

### 3. Protección de Rutas

```javascript
import { ProtectedRoute } from '../components/common/ProtectedRoute';

// Por rol
<ProtectedRoute roles={['ADMIN']}>
  <UserManagementPage />
</ProtectedRoute>

// Por permiso
<ProtectedRoute permissions={['paciente:read']}>
  <PatientsPage />
</ProtectedRoute>

// Por rol Y permiso
<ProtectedRoute 
  roles={['DOCTOR', 'ENFERMERO']} 
  permissions={['consulta:create']}
>
  <CreateConsultationPage />
</ProtectedRoute>

// Requiere TODOS los permisos
<ProtectedRoute 
  permissions={['evaluacion:read', 'evaluacion_respuesta:read']}
  requireAllPermissions={true}
>
  <EvaluationReportPage />
</ProtectedRoute>
```

---

## 📋 Permisos Disponibles

### Pacientes
- `paciente:read` - Ver pacientes
- `paciente:create` - Crear pacientes
- `paciente:update` - Actualizar pacientes
- `paciente:delete` - Eliminar pacientes

### Personal Médico
- `personal:read` - Ver personal
- `personal:create` - Crear personal
- `personal:update` - Actualizar personal
- `personal:delete` - Eliminar personal

### Consultas
- `consulta:read` - Ver consultas
- `consulta:create` - Crear consultas
- `consulta:update` - Actualizar consultas (incluye estado y finalizar)
- `consulta:delete` - Eliminar consultas

### Evaluaciones
- `evaluacion:read` - Ver evaluaciones
- `evaluacion:create` - Crear evaluaciones
- `evaluacion:update` - Actualizar evaluaciones
- `evaluacion:delete` - Eliminar evaluaciones

### Preguntas de Evaluación
- `evaluacion_pregunta:read` - Ver preguntas
- `evaluacion_pregunta:create` - Crear preguntas
- `evaluacion_pregunta:update` - Actualizar preguntas
- `evaluacion_pregunta:delete` - Eliminar preguntas

### Respuestas de Evaluación
- `evaluacion_respuesta:read` - Ver respuestas
- `evaluacion_respuesta:create` - Crear respuestas (incluye análisis automático)
- `evaluacion_respuesta:update` - Actualizar respuestas
- `evaluacion_respuesta:delete` - Eliminar respuestas

### Reportes
- `reporte:read` - Ver reportes
- `reporte:create` - Crear/generar reportes
- `reporte:delete` - Eliminar reportes

### Análisis de Sentimientos
- `sentiment:analyze` - Analizar texto individual
- `sentiment:analyze_batch` - Análisis por lote
- `sentiment:aggregate` - Análisis agregado y alertas

### Usuarios (Solo ADMIN)
- Requiere rol `ADMIN` completo

---

## 🔑 Roles del Sistema

- **ADMIN** - Acceso total, gestión de usuarios
- **DOCTOR** - Gestión clínica completa
- **ENFERMERO** - Apoyo clínico
- **ANALISTA** - Análisis y reportes
- **RECEPCIONISTA** - Gestión de citas y pacientes
- **TECNICO** - Soporte técnico
- **AUDITOR** - Solo lectura para auditoría

---

## 🛠️ Funciones Útiles

### Verificar Múltiples Permisos

```javascript
import { hasAnyPermission, hasAllPermissions } from '../utils/roleUtils';

// Al menos uno
if (hasAnyPermission(['paciente:read', 'paciente:create'])) {
  // Puede ver O crear
}

// Todos requeridos
if (hasAllPermissions(['evaluacion:read', 'evaluacion_respuesta:read'])) {
  // Puede ver evaluaciones Y respuestas
}
```

### Verificar por Recurso

```javascript
import { canAccessResource, getAllowedActions } from '../utils/roleUtils';

if (canAccessResource('paciente')) {
  console.log('Tiene algún permiso sobre pacientes');
}

const actions = getAllowedActions('paciente');
// ['read', 'create'] si tiene esos permisos
```

### Obtener Permisos Agrupados

```javascript
import { getPermissionsByResource } from '../utils/roleUtils';

const permissions = getPermissionsByResource();
// {
//   paciente: ['read', 'create'],
//   consulta: ['read', 'update'],
//   ...
// }
```

---

## 📞 Llamadas a API con Permisos

### Ejemplo Completo

```javascript
import { usePermissions } from '../hooks/usePermissions';
import { patientService } from '../services';
import { useState, useEffect } from 'react';

function PatientList() {
  const { canRead, canCreate, canUpdate, canDelete } = usePermissions('paciente');
  const [patients, setPatients] = useState([]);
  
  useEffect(() => {
    if (canRead) {
      loadPatients();
    }
  }, [canRead]);
  
  const loadPatients = async () => {
    try {
      const data = await patientService.getAll();
      setPatients(data.content || data);
    } catch (error) {
      console.error('Error loading patients:', error);
    }
  };
  
  const handleCreate = async (patientData) => {
    if (!canCreate) return;
    try {
      await patientService.create(patientData);
      loadPatients();
    } catch (error) {
      console.error('Error creating patient:', error);
    }
  };
  
  const handleUpdate = async (id, patientData) => {
    if (!canUpdate) return;
    try {
      await patientService.update(id, patientData);
      loadPatients();
    } catch (error) {
      console.error('Error updating patient:', error);
    }
  };
  
  const handleDelete = async (id) => {
    if (!canDelete) return;
    if (confirm('¿Eliminar paciente?')) {
      try {
        await patientService.delete(id);
        loadPatients();
      } catch (error) {
        console.error('Error deleting patient:', error);
      }
    }
  };
  
  if (!canRead) {
    return <div>No tiene permisos para ver pacientes</div>;
  }
  
  return (
    <div>
      {canCreate && <button onClick={handleCreate}>Crear Paciente</button>}
      
      <table>
        {patients.map(patient => (
          <tr key={patient.id}>
            <td>{patient.nombre}</td>
            <td>
              {canUpdate && <button onClick={() => handleUpdate(patient.id)}>Editar</button>}
              {canDelete && <button onClick={() => handleDelete(patient.id)}>Eliminar</button>}
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
}
```

---

## ⚠️ Errores Comunes

### 1. Permiso no encontrado
```javascript
// ❌ Incorrecto
hasPermission('pacientes:read') // 's' extra

// ✅ Correcto
hasPermission('paciente:read')
```

### 2. Rol vs Permiso
```javascript
// ❌ Incorrecto
hasPermission('ADMIN') // ADMIN es un rol, no un permiso

// ✅ Correcto
hasRole('ADMIN')
isAdmin()
```

### 3. Formato de recurso:acción
```javascript
// ❌ Incorrecto
hasPermission('read_paciente')
hasPermission('paciente-read')

// ✅ Correcto
hasPermission('paciente:read')
```

### 4. No verificar permisos antes de llamar API
```javascript
// ❌ Incorrecto
const data = await patientService.getAll(); // Puede fallar con 403

// ✅ Correcto
if (hasPermission('paciente:read')) {
  const data = await patientService.getAll();
}
```

---

## 🎨 Componentes Condicionales

### Botón con Permiso
```javascript
function ActionButton({ permission, onClick, children }) {
  const { hasPermission } = usePermissions();
  
  if (!hasPermission(permission)) return null;
  
  return <button onClick={onClick}>{children}</button>;
}

// Uso
<ActionButton permission="paciente:create" onClick={handleCreate}>
  Crear Paciente
</ActionButton>
```

### Sección con Rol
```javascript
function AdminSection({ children }) {
  const { isAdmin } = usePermissions();
  
  if (!isAdmin) return null;
  
  return <div className="admin-section">{children}</div>;
}
```

### Menú Dinámico
```javascript
const menuItems = [
  { label: 'Pacientes', path: '/patients', permission: 'paciente:read' },
  { label: 'Consultas', path: '/consultations', permission: 'consulta:read' },
  { label: 'Evaluaciones', path: '/evaluations', permission: 'evaluacion:read' },
  { label: 'Usuarios', path: '/users', role: 'ADMIN' },
];

function Menu() {
  const { hasPermission, hasRole } = usePermissions();
  
  const visibleItems = menuItems.filter(item => {
    if (item.permission) return hasPermission(item.permission);
    if (item.role) return hasRole(item.role);
    return true;
  });
  
  return (
    <nav>
      {visibleItems.map(item => (
        <Link key={item.path} to={item.path}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
```

---

## 📖 Referencias

- **roleUtils.js** - Funciones de validación
- **usePermissions.js** - Hook personalizado
- **ProtectedRoute.jsx** - Componente de protección
- **BACKEND_ENDPOINT_ANALYSIS.md** - Análisis completo del backend
- **FRONTEND_BACKEND_SYNC.md** - Resumen de cambios

