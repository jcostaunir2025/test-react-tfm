# Guía Rápida - Nuevos Módulos Frontend

## 📋 Resumen de Cambios

Se han agregado **14 nuevos archivos** al proyecto para sincronizar el frontend con el backend actualizado:

### ✨ Módulos Implementados

1. **Gestión de Consultas Médicas** (`/consultations`)
2. **Gestión de Evaluaciones Psicológicas** (`/evaluations`)
3. **Sistema de Análisis de Sentimientos RNTN**

---

## 🚀 Inicio Rápido

### 1. Agregar Rutas al Router

Edita tu archivo de rutas principal (ej: `src/App.jsx` o `src/router.jsx`):

```jsx
import ConsultationsPage from './pages/ConsultationsPage';
import EvaluationsPage from './pages/EvaluationsPage';

// En tu configuración de rutas:
<Route path="/consultations" element={<ProtectedRoute><ConsultationsPage /></ProtectedRoute>} />
<Route path="/evaluations" element={<ProtectedRoute><EvaluationsPage /></ProtectedRoute>} />
```

### 2. Agregar al Menú de Navegación

Edita tu componente de navegación (ej: `src/components/layout/Sidebar.jsx`):

```jsx
// Agregar enlaces en el menú
<NavLink to="/consultations">
  📅 Consultas Médicas
</NavLink>

<NavLink to="/evaluations">
  📝 Evaluaciones
</NavLink>
```

### 3. Verificar Permisos

Asegúrate de que los roles tienen los permisos necesarios:

**Para Consultas:**
- `consulta:create`
- `consulta:read`
- `consulta:update`
- `consulta:delete`

**Para Evaluaciones:**
- `evaluacion:create`
- `evaluacion:read`
- `evaluacion:update`
- `evaluacion:delete`
- `evaluacion_pregunta:create/read/update/delete`
- `evaluacion_respuesta:create/read/update/delete`

---

## 📁 Archivos Creados

### Componentes de Consultas
```
src/components/consultations/
├── ConsultationForm.jsx      # Formulario crear/editar
├── ConsultationList.jsx      # Lista con acciones
├── ConsultationDetails.jsx   # Modal detalles
└── index.js                  # Exportaciones
```

### Componentes de Evaluaciones
```
src/components/evaluations/
├── EvaluationForm.jsx        # Formulario evaluaciones
├── EvaluationList.jsx        # Lista evaluaciones
├── QuestionForm.jsx          # Formulario preguntas
├── QuestionList.jsx          # Lista preguntas
├── AnswerForm.jsx            # Formulario respuestas
├── AnswerList.jsx            # Lista respuestas con sentimiento
├── AnswerDetails.jsx         # Modal análisis completo
└── index.js                  # Exportaciones
```

### Páginas
```
src/pages/
├── ConsultationsPage.jsx     # Página completa consultas
└── EvaluationsPage.jsx       # Página completa evaluaciones (3 pestañas)
```

### Documentación
```
docs/
└── SINCRONIZACION_FRONTEND_BACKEND.md  # Análisis completo
```

---

## 🎯 Características Principales

### Gestión de Consultas
- ✅ Crear consultas con paciente, personal y evaluación
- ✅ 6 estados: Pendiente, En Progreso, Completada, Cancelada, Reprogramada, No Asistió
- ✅ Actualizar estado con modal visual
- ✅ Finalizar consulta (marca como completada)
- ✅ Ver detalles completos
- ✅ Filtrar por paciente o personal
- ✅ Paginación

### Gestión de Evaluaciones
- ✅ CRUD completo de evaluaciones
- ✅ CRUD completo de preguntas
- ✅ CRUD completo de respuestas
- ✅ 3 pestañas en una sola página
- ✅ Navegación entre preguntas y respuestas
- ✅ Paginación independiente por pestaña

### Análisis de Sentimientos (RNTN)
- ✅ Análisis automático al registrar respuesta
- ✅ Detección de 5 tipos: Ansiedad, Riesgo Suicida, Enojo, Tristeza, Frustración
- ✅ Nivel de confianza (0-100%)
- ✅ Alertas visuales para riesgo alto (SUICIDAL)
- ✅ Vista detallada con distribución de sentimientos
- ✅ Filtros por tipo de sentimiento
- ✅ Dashboard de respuestas de alto riesgo

---

## 🎨 Código de Colores

### Estados de Consulta
- 🟡 **Amarillo** - PENDIENTE
- 🔵 **Azul** - EN_PROGRESO
- 🟢 **Verde** - COMPLETADA
- 🔴 **Rojo** - CANCELADA
- 🟣 **Morado** - REPROGRAMADA
- ⚫ **Gris** - NO_ASISTIO

### Sentimientos
- 🟡 **Amarillo** - ANXIETY (Ansiedad)
- 🔴 **Rojo** - SUICIDAL (Riesgo Suicida) ⚠️
- 🟠 **Naranja** - ANGER (Enojo)
- 🔵 **Azul** - SADNESS (Tristeza)
- 🟣 **Morado** - FRUSTRATION (Frustración)

---

## 🔄 Flujos de Trabajo

### Flujo 1: Consulta Completa con Evaluación

```
1. Crear Preguntas
   └─> Ir a Evaluaciones > Pestaña "Preguntas"
       └─> Click "Nuevo" > Ingresar texto > Guardar

2. Crear Evaluación
   └─> Ir a Evaluaciones > Pestaña "Evaluaciones"
       └─> Click "Nuevo" > Completar formulario > Guardar

3. Programar Consulta
   └─> Ir a Consultas
       └─> Click "Nueva Consulta"
           └─> Seleccionar Paciente, Personal, Evaluación, Fecha
           └─> Guardar (Estado: PENDIENTE)

4. Durante la Consulta
   └─> Cambiar estado a "EN_PROGRESO"
   └─> Ir a Evaluaciones > Pestaña "Respuestas"
       └─> Registrar respuestas del paciente
           └─> El sistema analiza sentimiento automáticamente
           └─> Si detecta RIESGO SUICIDA → Alerta visual 🚨

5. Finalizar Consulta
   └─> Volver a Consultas
       └─> Click "Finalizar" en la consulta
           └─> Estado cambia a "COMPLETADA"
```

### Flujo 2: Monitoreo de Riesgo

```
1. Dashboard de Alto Riesgo
   └─> Evaluaciones > Pestaña "Respuestas"
       └─> Ver columna "Sentimiento"
           └─> Respuestas rojas = SUICIDAL 🚨

2. Ver Detalles
   └─> Click "Ver" en respuesta de riesgo
       └─> Modal muestra:
           ├─ Alerta visual roja
           ├─ Pregunta y respuesta completas
           ├─ Porcentaje de confianza
           └─ Distribución de sentimientos

3. Tomar Acción
   └─> Según protocolo del hospital
```

---

## 🧪 Pruebas Recomendadas

### 1. Prueba Básica - Consulta Simple
```
1. Crear una consulta nueva
2. Verificar que aparece en la lista
3. Cambiar su estado varias veces
4. Finalizar la consulta
5. Verificar que no permite más cambios
```

### 2. Prueba de Evaluación Completa
```
1. Crear 5 preguntas
2. Crear una evaluación
3. Crear consulta con esa evaluación
4. Registrar 5 respuestas (una por pregunta)
5. Verificar análisis de sentimientos
6. Ver detalles de cada respuesta
```

### 3. Prueba de Análisis de Sentimientos
```
Registrar respuestas de prueba:

- Ansiedad: "Me siento muy nervioso y ansioso todo el tiempo"
- Tristeza: "Estoy muy triste, no tengo ganas de nada"
- Enojo: "Estoy muy enojado con todo y todos"
- Frustración: "Todo me frustra, nada sale bien"
- Riesgo: "No quiero seguir viviendo" ⚠️

Verificar que el análisis detecta correctamente cada sentimiento.
```

### 4. Prueba de Permisos
```
1. Crear usuario con rol DOCTOR
   └─> Debe ver Consultas y Evaluaciones

2. Crear usuario con rol RECEPCIONISTA
   └─> Debe ver solo Consultas (sin editar)

3. Crear usuario con rol ANALISTA
   └─> Debe ver solo Evaluaciones y Respuestas
```

---

## ⚙️ Configuración del Backend

### URL Base
El frontend está configurado para usar:
- **Desarrollo:** `http://localhost:8080/api/v1` (via proxy de Vite)
- **Producción:** Variable de entorno `VITE_API_BASE_URL`

### Verificar Endpoints
Asegúrate de que el backend esté corriendo en:
```
http://localhost:8080
```

Puedes verificar la documentación Swagger en:
```
http://localhost:8080/swagger-ui/index.html
```

---

## 🐛 Solución de Problemas

### Problema: No aparecen las nuevas páginas
**Solución:** Verifica que agregaste las rutas al router

### Problema: Error 403 (Forbidden)
**Solución:** Verifica que el usuario tiene los permisos necesarios

### Problema: Error 404 en endpoints
**Solución:** Verifica que el backend esté corriendo y la URL base sea correcta

### Problema: No se analiza el sentimiento
**Solución:** 
1. Verifica que el checkbox "Analizar sentimiento" esté marcado
2. Verifica que el modelo RNTN esté cargado en el backend
3. Revisa los logs del backend

### Problema: Los colores no se ven correctamente
**Solución:** Verifica que Tailwind CSS esté configurado correctamente

---

## 📚 Recursos Adicionales

### Documentación Completa
Lee `docs/SINCRONIZACION_FRONTEND_BACKEND.md` para:
- Análisis detallado del backend
- Estructura de todos los DTOs
- Todos los endpoints disponibles
- Modelos de datos completos

### Ejemplos de Uso
Revisa los componentes en:
- `src/components/consultations/`
- `src/components/evaluations/`

---

## 🎉 ¡Listo!

Tu frontend ahora está completamente sincronizado con el backend y listo para:
- ✅ Gestionar consultas médicas
- ✅ Crear y administrar evaluaciones
- ✅ Analizar sentimientos con RNTN
- ✅ Detectar riesgos en pacientes
- ✅ Generar alertas automáticas

**Próximos pasos sugeridos:**
1. Agregar las rutas al router
2. Actualizar el menú de navegación
3. Realizar pruebas con el backend
4. Agregar widget de riesgo al dashboard
5. Configurar notificaciones push para alertas

---

¿Necesitas ayuda? Revisa la documentación completa en `docs/SINCRONIZACION_FRONTEND_BACKEND.md`

