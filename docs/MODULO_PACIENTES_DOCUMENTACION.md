# 📋 Módulo de Gestión de Pacientes - Documentación Completa

## ✅ Implementación Completada

Se ha creado un módulo completo de gestión de pacientes con todas las operaciones CRUD integradas con el backend.

---

## 🎯 Características Implementadas

### 1. **Validación de Permisos**
El módulo verifica automáticamente los permisos del usuario:
- ✅ `paciente:read` - Ver listado de pacientes
- ✅ `paciente:create` - Crear nuevos pacientes
- ✅ `paciente:update` - Editar pacientes existentes
- ✅ `paciente:delete` - Eliminar pacientes (soft delete)

### 2. **Operaciones CRUD Completas**

#### 📖 **Listar Pacientes**
- Paginación automática (10 pacientes por página)
- Tabla responsive con información clave
- Estados visuales (Activo/Inactivo)
- Integrado con `GET /api/v1/pacientes`

#### 🔍 **Búsqueda y Filtrado**
- Búsqueda por nombre, apellido o documento
- Filtro por estado (Activo/Inactivo)
- Botón de limpiar filtros
- Integrado con query params del backend

#### ➕ **Crear Paciente**
- Modal con formulario completo
- Validación de campos requeridos
- Campos implementados:
  - Nombre y Apellido (requeridos)
  - Documento (requerido)
  - Fecha de Nacimiento (requerido)
  - Género (requerido)
  - Dirección
  - Teléfono (requerido)
  - Email
  - Contacto de Emergencia
  - Teléfono de Emergencia
- Integrado con `POST /api/v1/pacientes`

#### 👁️ **Ver Detalles**
- Modal de solo lectura con información completa
- Organizado en secciones:
  - Información Personal
  - Información de Contacto
  - Contacto de Emergencia
  - Estado e ID
- Botón para editar directo desde detalles

#### ✏️ **Editar Paciente**
- Modal con formulario pre-llenado
- Posibilidad de cambiar el estado
- Validación de campos
- Integrado con `PUT /api/v1/pacientes/{id}`

#### 🗑️ **Eliminar Paciente**
- Modal de confirmación
- Mensaje claro con nombre del paciente
- Soft delete (no eliminación definitiva)
- Integrado con `DELETE /api/v1/pacientes/{id}`

### 3. **Interfaz de Usuario**

#### Header
```
┌─────────────────────────────────────────────┐
│ 👥 Gestión de Pacientes    [+ Nuevo]       │
│ Administra la información de los pacientes  │
└─────────────────────────────────────────────┘
```

#### Filtros
```
┌─────────────────────────────────────────────┐
│ Buscar: [________________]  Estado: [Todos] │
│ [🔍 Buscar] [↻ Limpiar]                     │
└─────────────────────────────────────────────┘
```

#### Tabla
```
┌───────────────────────────────────────────────────────────┐
│ Paciente         │ Documento │ Contacto    │ Estado │ ... │
├───────────────────────────────────────────────────────────┤
│ 👤 Juan Pérez   │ 12345678  │ 555-1234   │ ✅     │ 👁️✏️🗑️ │
│    M            │           │ email@...   │ Activo │      │
└───────────────────────────────────────────────────────────┘
```

#### Paginación
```
Mostrando 1 a 10 de 45 resultados
[Anterior] [1] [2] [3] [4] [5] [Siguiente]
```

### 4. **Manejo de Estados**

#### Estados de Carga
- Spinner durante operaciones
- Mensajes en botones ("Guardando...", "Eliminando...")
- Deshabilitación de botones durante procesos

#### Mensajes de Error
- Alertas visuales en la parte superior
- Posibilidad de cerrar alertas
- Mensajes descriptivos del error

#### Estados Vacíos
- Mensaje cuando no hay pacientes
- Sugerencia de crear el primero
- Mensaje diferente cuando no hay resultados de búsqueda

---

## 📊 Estructura del Código

### Componente Principal: `PatientsPage`

```javascript
PatientsPage
├── Estados (useState)
│   ├── Datos: patients, loading, error
│   ├── Filtros: searchTerm, filterStatus
│   ├── Paginación: currentPage, totalPages
│   └── Modales: showCreateModal, showEditModal, etc.
│
├── Efectos (useEffect)
│   └── loadPatients() cuando cambia página o filtros
│
├── Handlers
│   ├── CRUD: handleCreate, handleUpdate, handleDelete
│   ├── Modales: openCreateModal, openEditModal, etc.
│   ├── Formulario: handleInputChange, resetForm
│   └── Búsqueda: handleSearch
│
└── Renderizado
    ├── Header con botón Crear (si tiene permiso)
    ├── Alerta de errores
    ├── Filtros y búsqueda
    ├── Tabla con datos
    └── Modales (Create, Edit, View, Delete)
```

### Componentes Auxiliares

#### `PatientFormModal`
- Formulario reutilizable para Crear y Editar
- Props: isOpen, onClose, onSubmit, formData, etc.
- Validación automática de campos requeridos

#### `PatientDetails`
- Vista de solo lectura con toda la información
- Organizada en secciones con estilos
- Botón para editar si tiene permiso

#### `DeleteConfirmation`
- Confirmación visual con advertencia
- Muestra nombre del paciente
- Botones de confirmar/cancelar

---

## 🔌 Integración con el Backend

### Endpoints Utilizados

| Operación | Método | Endpoint | Permiso Requerido |
|-----------|--------|----------|-------------------|
| Listar | GET | `/api/v1/pacientes` | `paciente:read` |
| Buscar | GET | `/api/v1/pacientes?search=...` | `paciente:read` |
| Filtrar | GET | `/api/v1/pacientes?estatus=1` | `paciente:read` |
| Ver uno | GET | `/api/v1/pacientes/{id}` | `paciente:read` |
| Crear | POST | `/api/v1/pacientes` | `paciente:create` |
| Actualizar | PUT | `/api/v1/pacientes/{id}` | `paciente:update` |
| Eliminar | DELETE | `/api/v1/pacientes/{id}` | `paciente:delete` |

### Formato de Datos

#### Request (Crear/Actualizar)
```json
{
  "nombrePaciente": "Juan",
  "apellidoPaciente": "Pérez",
  "docPaciente": "12345678",
  "fechanacPaciente": "1990-01-15",
  "generoPaciente": "M",
  "direccionPaciente": "Calle Principal 123",
  "telefonoPaciente": "555-1234",
  "emailPaciente": "juan@example.com",
  "contactoemergenciaPaciente": "María Pérez",
  "telefonoemergenciaPaciente": "555-5678",
  "estatusPaciente": 1
}
```

#### Response (Lista)
```json
{
  "content": [
    {
      "idPaciente": 1,
      "nombrePaciente": "Juan",
      "apellidoPaciente": "Pérez",
      "docPaciente": "12345678",
      "fechanacPaciente": "1990-01-15",
      "generoPaciente": "M",
      "direccionPaciente": "Calle Principal 123",
      "telefonoPaciente": "555-1234",
      "emailPaciente": "juan@example.com",
      "contactoemergenciaPaciente": "María Pérez",
      "telefonoemergenciaPaciente": "555-5678",
      "estatusPaciente": 1
    }
  ],
  "totalPages": 5,
  "totalElements": 45,
  "number": 0,
  "size": 10
}
```

---

## 🎨 Estilos y Componentes UI

### Clases CSS Utilizadas
- `btn btn-primary` - Botones principales
- `btn btn-secondary` - Botones secundarios
- `input` - Campos de entrada
- `card` - Contenedores de tarjetas

### Iconos (Lucide React)
- `Users` - Icono principal de pacientes
- `Plus` - Crear nuevo
- `Search` - Búsqueda
- `Edit` - Editar
- `Trash2` - Eliminar
- `Eye` - Ver detalles
- `Filter` - Filtro
- `RefreshCw` - Limpiar filtros

### Colores de Estado
- Verde (`bg-green-100 text-green-800`) - Activo
- Rojo (`bg-red-100 text-red-800`) - Inactivo

---

## 🧪 Flujo de Usuario

### Escenario 1: Crear un Paciente
1. Usuario hace clic en "Nuevo Paciente"
2. Se abre modal con formulario vacío
3. Usuario llena los campos requeridos
4. Hace clic en "Crear Paciente"
5. Se envía POST al backend
6. Modal se cierra automáticamente
7. Lista se recarga con el nuevo paciente

### Escenario 2: Buscar un Paciente
1. Usuario escribe en el campo de búsqueda
2. Hace clic en "Buscar"
3. Se envía GET con query param `search`
4. Tabla se actualiza con resultados
5. Si no hay resultados, se muestra mensaje

### Escenario 3: Editar un Paciente
1. Usuario hace clic en icono de editar (lápiz)
2. Se abre modal con datos pre-llenados
3. Usuario modifica los campos necesarios
4. Hace clic en "Actualizar Paciente"
5. Se envía PUT al backend
6. Modal se cierra
7. Lista se recarga con datos actualizados

### Escenario 4: Ver Detalles
1. Usuario hace clic en icono de ver (ojo)
2. Se abre modal con toda la información
3. Usuario puede ver todos los detalles
4. Opcionalmente puede hacer clic en "Editar"
5. Se cierra modal de vista y abre modal de edición

### Escenario 5: Eliminar un Paciente
1. Usuario hace clic en icono de eliminar (basura)
2. Se abre modal de confirmación
3. Usuario confirma la eliminación
4. Se envía DELETE al backend
5. Modal se cierra
6. Lista se recarga sin el paciente eliminado

---

## 🔒 Seguridad y Permisos

### Verificación por Operación

```javascript
// Verificación al cargar
if (!canRead) {
  return <AccessDenied />;
}

// Botón Crear
{canCreate && <button>Nuevo Paciente</button>}

// Botón Editar en tabla
{canUpdate && <button>Editar</button>}

// Botón Eliminar en tabla
{canDelete && <button>Eliminar</button>}
```

### Matriz de Acceso

| Rol | Read | Create | Update | Delete |
|-----|------|--------|--------|--------|
| ADMIN | ✅ | ✅ | ✅ | ✅ |
| DOCTOR | ✅ | ✅ | ✅ | ❌ |
| ENFERMERO | ✅ | ✅ | ✅ | ❌ |
| RECEPCIONISTA | ✅ | ✅ | ✅ | ❌ |
| ANALISTA | ❌ | ❌ | ❌ | ❌ |

---

## 📱 Responsive Design

### Desktop (> 768px)
- Tabla completa con todas las columnas
- Paginación con números de página
- Formularios en 2 columnas

### Mobile (< 768px)
- Tabla con scroll horizontal
- Paginación simplificada (Solo Anterior/Siguiente)
- Formularios en 1 columna (automático con Tailwind)

---

## ⚡ Optimizaciones

### Performance
- ✅ useEffect con dependencias correctas
- ✅ Prevención de renderizados innecesarios
- ✅ Componentes auxiliares separados
- ✅ Carga condicional basada en permisos

### UX
- ✅ Loading states durante operaciones
- ✅ Mensajes de error descriptivos
- ✅ Confirmación antes de eliminar
- ✅ Formularios con validación HTML5
- ✅ Botones deshabilitados durante carga
- ✅ Auto-recarga después de operaciones

---

## 🐛 Manejo de Errores

### Try-Catch en Operaciones
```javascript
try {
  await patientService.create(formData);
  // Éxito
} catch (err) {
  console.error('Error:', err);
  setError(err.message || 'Error al crear paciente');
} finally {
  setLoading(false);
}
```

### Tipos de Errores Manejados
- ✅ Errores de red
- ✅ Errores 401 (No autorizado)
- ✅ Errores 403 (Forbidden)
- ✅ Errores 404 (No encontrado)
- ✅ Errores 500 (Server error)
- ✅ Errores de validación

---

## 🚀 Próximas Mejoras Sugeridas

### Funcionalidades
- [ ] Exportar lista a Excel/PDF
- [ ] Importar pacientes desde archivo
- [ ] Historial de cambios
- [ ] Foto de perfil del paciente
- [ ] Adjuntar documentos
- [ ] Vista de calendario de citas

### UI/UX
- [ ] Ordenamiento por columnas
- [ ] Más filtros (edad, género, etc.)
- [ ] Vista de tarjetas (alternativa a tabla)
- [ ] Drag & drop para documentos
- [ ] Búsqueda en tiempo real (debounced)

### Integraciones
- [ ] Ver consultas del paciente
- [ ] Ver evaluaciones del paciente
- [ ] Crear cita directamente
- [ ] Enviar notificaciones por email/SMS

---

## 📖 Cómo Usar

### Para Desarrolladores

1. **Importar el componente:**
   ```javascript
   import { PatientsPage } from './pages/PatientsPage';
   ```

2. **Agregarlo a las rutas:**
   ```javascript
   <Route
     path="patients"
     element={
       <ProtectedRoute permissions={['paciente:read']}>
         <PatientsPage />
       </ProtectedRoute>
     }
   />
   ```

3. **Personalizar estilos:**
   - Modificar clases Tailwind en el componente
   - Ajustar colores en `tailwind.config.js`

### Para Usuarios

1. **Acceder al módulo:**
   - Menú → Pacientes

2. **Crear un paciente:**
   - Clic en "Nuevo Paciente"
   - Llenar formulario
   - Guardar

3. **Buscar un paciente:**
   - Escribir en el buscador
   - Clic en "Buscar"

4. **Ver/Editar/Eliminar:**
   - Usar iconos en la tabla

---

## ✅ Checklist de Implementación

- ✅ Componente PatientsPage creado
- ✅ Integración con patientService
- ✅ Validación de permisos con usePermissions
- ✅ Operaciones CRUD completas
- ✅ Modales para cada operación
- ✅ Búsqueda y filtrado
- ✅ Paginación
- ✅ Manejo de errores
- ✅ Estados de carga
- ✅ Responsive design
- ✅ Build exitoso

---

## 🎉 Resultado

Un módulo completo, profesional y totalmente funcional de gestión de pacientes con:
- ✅ Todas las operaciones CRUD
- ✅ Validación de permisos
- ✅ Interfaz intuitiva
- ✅ Integración completa con backend
- ✅ Manejo de errores robusto
- ✅ Responsive design

**El módulo está listo para usar en producción** 🚀

