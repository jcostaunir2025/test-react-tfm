# 📋 Configuración del Menú de Navegación - Sistema de Análisis de Sentimientos

**Fecha:** 2025-12-31  
**Estado:** ✅ COMPLETO Y ACTUALIZADO

---

## 🎯 RESUMEN

El menú lateral (Sidebar) muestra **todas las páginas disponibles** filtradas dinámicamente según el **rol y permisos** del usuario autenticado. El sistema implementa control de acceso basado en roles (RBAC).

---

## 📊 ESTRUCTURA COMPLETA DEL MENÚ

### 1️⃣ Principal

| Opción | Ruta | Roles Permitidos | Descripción |
|--------|------|------------------|-------------|
| **Dashboard** | `/` | ADMIN, DOCTOR, ENFERMERO, ANALISTA, RECEPCIONISTA, AUDITOR | Panel principal con estadísticas y resumen |

### 2️⃣ Gestión Clínica

| Opción | Ruta | Roles Permitidos | Descripción | Badge |
|--------|------|------------------|-------------|-------|
| **Pacientes** | `/patients` | ADMIN, DOCTOR, ENFERMERO, RECEPCIONISTA | Gestión completa de pacientes (CRUD) | - |
| **Consultas** | `/consultations` | ADMIN, DOCTOR, ENFERMERO | Consultas médicas y seguimiento | - |
| **Evaluaciones** | `/evaluations` | ADMIN, DOCTOR, ENFERMERO, ANALISTA | Evaluaciones psicológicas y preguntas | - |
| **Alto Riesgo** | `/high-risk` | ADMIN, DOCTOR, ENFERMERO | Monitoreo de pacientes con riesgo suicida | ⚠️ `!` |

### 3️⃣ Análisis y Reportes

| Opción | Ruta | Roles Permitidos | Descripción | Badge |
|--------|------|------------------|-------------|-------|
| **Análisis de Sentimientos** | `/sentiment` | ADMIN, DOCTOR, ANALISTA | Análisis de sentimientos con modelo RNTN | 🧠 `RNTN` |
| **Reportes** | `/reports` | ADMIN, DOCTOR, ANALISTA, AUDITOR | Reportes y estadísticas del sistema | - |

### 4️⃣ Administración

| Opción | Ruta | Roles Permitidos | Descripción | Badge |
|--------|------|------------------|-------------|-------|
| **Usuarios** | `/users` | ADMIN | Gestión de usuarios y roles (Solo ADMIN) | ⚠️ `Admin` |
| **Configuración** | `/settings` | ADMIN, DOCTOR | Configuración del sistema | - |

---

## 🔐 MATRIZ DE PERMISOS POR ROL

| Página | ADMIN | DOCTOR | ENFERMERO | ANALISTA | RECEPCIONISTA | AUDITOR |
|--------|-------|--------|-----------|----------|---------------|---------|
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Pacientes | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| Consultas | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Evaluaciones | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Alto Riesgo | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Análisis Sentimientos | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Reportes | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ |
| Usuarios | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Configuración | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

**Total de opciones por rol:**
- **ADMIN:** 9/9 (100%) - Acceso total
- **DOCTOR:** 7/9 (78%)
- **ENFERMERO:** 5/9 (56%)
- **ANALISTA:** 4/9 (44%)
- **RECEPCIONISTA:** 2/9 (22%)
- **AUDITOR:** 2/9 (22%)

---

## 🎨 CARACTERÍSTICAS DEL MENÚ

### ✅ Funcionalidades Implementadas:

1. **Filtrado Dinámico por Rol**
   - El menú se genera dinámicamente según el rol del usuario
   - Solo se muestran las opciones permitidas
   - Secciones vacías se ocultan automáticamente

2. **Secciones Colapsables**
   - 4 secciones principales organizadas por función
   - Posibilidad de expandir/colapsar cada sección
   - Estado de expansión persistente durante la sesión

3. **Información de Usuario**
   - Avatar con inicial del nombre
   - Nombre completo del usuario
   - Rol principal destacado
   - Indicador de sesión activa

4. **Badges Informativos**
   - **Danger (Rojo):** Alto Riesgo `!`
   - **Warning (Amarillo):** Solo Admin `Admin`
   - **Info (Azul):** Tecnología especial `RNTN`
   - **Success (Verde):** Disponible para futuras funciones

5. **Indicadores Visuales**
   - Opción activa resaltada con color primario
   - Punto pulsante en la opción activa
   - Iconos que cambian de color al hover
   - Animaciones suaves en transiciones

6. **Tooltips Descriptivos**
   - Descripción completa al pasar el mouse
   - Información sobre permisos requeridos

7. **Navegación Inteligente**
   - NavLink de React Router con estado activo
   - Redirección automática si no hay permisos
   - Highlight en la opción actual

---

## 💻 IMPLEMENTACIÓN TÉCNICA

### Filtrado por Roles:

```javascript
const filteredSections = navigationSections
  .map(section => ({
    ...section,
    items: section.items.filter(item => 
      !item.roles || hasAnyRole(item.roles)
    )
  }))
  .filter(section => section.items.length > 0);
```

**Lógica:**
1. Recorre cada sección del menú
2. Filtra los items según los roles del usuario
3. Elimina secciones sin items visibles
4. Retorna solo lo que el usuario puede ver

### Función `hasAnyRole`:

```javascript
// src/utils/roleUtils.js
export const hasAnyRole = (requiredRoles) => {
  const user = useAuthStore.getState().user;
  if (!user || !user.roles) return false;
  
  return requiredRoles.some(role => 
    user.roles.includes(role)
  );
};
```

---

## 🔄 SINCRONIZACIÓN CON RUTAS

### App.jsx vs Sidebar.jsx - 100% Sincronizado ✅

Todas las rutas definidas en `App.jsx` tienen su correspondiente entrada en el menú:

| Ruta en App.jsx | Ruta en Sidebar | Match |
|-----------------|-----------------|-------|
| `/` | `/` | ✅ |
| `/patients` | `/patients` | ✅ |
| `/consultations` | `/consultations` | ✅ |
| `/evaluations` | `/evaluations` | ✅ |
| `/sentiment` | `/sentiment` | ✅ |
| `/reports` | `/reports` | ✅ |
| `/high-risk` | `/high-risk` | ✅ |
| `/users` | `/users` | ✅ |
| `/settings` | `/settings` | ✅ |

**Total: 9/9 rutas sincronizadas (100%)**

---

## 🎭 EJEMPLOS POR ROL

### 👨‍⚕️ DOCTOR ve:
```
📊 Principal
  └─ Dashboard

🏥 Gestión Clínica
  ├─ Pacientes
  ├─ Consultas
  ├─ Evaluaciones
  └─ Alto Riesgo

📈 Análisis y Reportes
  ├─ Análisis de Sentimientos [RNTN]
  └─ Reportes

⚙️ Administración
  └─ Configuración
```

### 👨‍⚕️ ENFERMERO ve:
```
📊 Principal
  └─ Dashboard

🏥 Gestión Clínica
  ├─ Pacientes
  ├─ Consultas
  ├─ Evaluaciones
  └─ Alto Riesgo [!]
```

### 📊 ANALISTA ve:
```
📊 Principal
  └─ Dashboard

🏥 Gestión Clínica
  └─ Evaluaciones

📈 Análisis y Reportes
  ├─ Análisis de Sentimientos [RNTN]
  └─ Reportes
```

### 💼 ADMIN ve:
```
📊 Principal
  └─ Dashboard

🏥 Gestión Clínica
  ├─ Pacientes
  ├─ Consultas
  ├─ Evaluaciones
  └─ Alto Riesgo [!]

📈 Análisis y Reportes
  ├─ Análisis de Sentimientos [RNTN]
  └─ Reportes

⚙️ Administración
  ├─ Usuarios [Admin]
  └─ Configuración
```

---

## 🔒 SEGURIDAD

### Niveles de Protección:

1. **Frontend (Sidebar)**
   - Oculta opciones según rol
   - Previene navegación no autorizada visualmente

2. **Frontend (ProtectedRoute)**
   - Verifica permisos antes de renderizar componente
   - Redirige si no tiene acceso

3. **Backend (API)**
   - Validación de permisos en cada endpoint
   - JWT con roles incluidos
   - Control de acceso por recurso

**Nota:** El frontend es solo UX. La seguridad real está en el backend.

---

## 📝 ACTUALIZACIONES RECIENTES

### Cambios Aplicados (2025-12-31):

1. ✅ **Dashboard accesible para TODOS los roles**
   - Antes: Solo ADMIN, DOCTOR, ENFERMERO, ANALISTA
   - Ahora: Incluye RECEPCIONISTA y AUDITOR

2. ✅ **Badges mejorados**
   - `IA` → `RNTN` (más descriptivo)
   - Nuevo badge `Admin` para Usuarios

3. ✅ **Descripciones más detalladas**
   - Cada opción tiene tooltip explicativo
   - Información sobre permisos incluida

4. ✅ **Sincronización 100% con App.jsx**
   - Todas las rutas tienen entrada en el menú
   - Permisos coinciden exactamente

---

## 🚀 PRÓXIMAS MEJORAS (Opcionales)

### Sugerencias para el Futuro:

1. **Contadores Dinámicos**
   ```javascript
   badge: { text: '3', variant: 'danger' } // 3 casos de alto riesgo
   ```

2. **Notificaciones por Opción**
   - Nuevas evaluaciones sin revisar
   - Consultas pendientes
   - Alertas de alto riesgo

3. **Búsqueda en el Menú**
   - Input para filtrar opciones
   - Atajos de teclado

4. **Favoritos**
   - Marcar opciones favoritas
   - Sección de acceso rápido

5. **Modo Compacto**
   - Menú colapsado con solo iconos
   - Expansión al hover

---

## ✅ VERIFICACIÓN FINAL

### Checklist:

- [x] Todas las rutas de App.jsx están en el menú
- [x] Permisos coinciden entre rutas y menú
- [x] Filtrado dinámico por rol funciona
- [x] Secciones colapsables operativas
- [x] Badges informativos agregados
- [x] Tooltips descriptivos configurados
- [x] Indicador de opción activa funciona
- [x] Navegación con React Router correcta
- [x] Sin errores de compilación
- [x] Responsive y accesible

**Estado: ✅ COMPLETO Y FUNCIONANDO**

---

## 📚 ARCHIVOS RELACIONADOS

- `src/components/layout/Sidebar.jsx` - Componente del menú
- `src/App.jsx` - Definición de rutas
- `src/utils/roleUtils.js` - Utilidades de roles
- `src/components/common/ProtectedRoute.jsx` - Protección de rutas
- `src/store/authStore.js` - Estado de autenticación

---

**Última actualización:** 2025-12-31  
**Mantenido por:** Equipo de Desarrollo Frontend

