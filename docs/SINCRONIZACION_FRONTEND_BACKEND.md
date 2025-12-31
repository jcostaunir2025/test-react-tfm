# Sincronización Frontend-Backend - Análisis Completo

## Fecha: 2025-12-31

## Resumen Ejecutivo

Se ha realizado un análisis exhaustivo del backend ubicado en:
`C:\Users\Javier Costa\Documents\UNIR\CLASES\DWFS\codigo\backend\rntn08122025`

Y se han sincronizado/creado los componentes necesarios en el frontend para mantener coherencia con la API del backend.

---

## 1. ESTRUCTURA DEL BACKEND ANALIZADA

### Controladores Principales

#### 1.1 ConsultaController (`/api/v1/consultas`)
**Endpoints disponibles:**
- `POST /api/v1/consultas` - Crear consulta
- `GET /api/v1/consultas/{id}` - Obtener por ID
- `GET /api/v1/consultas/paciente/{idPaciente}` - Listar por paciente (con filtros de fecha opcionales)
- `GET /api/v1/consultas/personal/{idPersonal}` - Listar por personal
- `PATCH /api/v1/consultas/{id}/estado` - Actualizar estado
- `POST /api/v1/consultas/{id}/finalizar` - Finalizar consulta

**Estados de Consulta:**
1. PENDIENTE
2. EN_PROGRESO
3. COMPLETADA
4. CANCELADA
5. REPROGRAMADA
6. NO_ASISTIO

**Modelo de datos (ConsultaRequest):**
```java
- idPaciente: Integer (requerido)
- idPersonal: Integer (requerido)
- idEvaluacion: Integer (opcional)
- fechahoraConsulta: LocalDateTime (requerido, futuro o presente)
- estatusConsulta: Integer (default: 1 - PENDIENTE)
```

**Modelo de respuesta (ConsultaResponse):**
```java
- idConsulta: Integer
- paciente: PacienteBasicInfo (idPaciente, nombrePaciente, docPaciente)
- personal: PersonalBasicInfo (idPersonal, nombrePersonal, docPersonal)
- idEvaluacion: Integer
- evaluacion: EvaluacionBasicInfo (idEvaluacion, nombreEvaluacion, tituloEvaluacion)
- fechahoraConsulta: LocalDateTime
- fechafinConsulta: LocalDateTime
- estatusConsulta: Integer
- estatusConsultaNombre: String
- createdAt: LocalDateTime
- updatedAt: LocalDateTime
```

#### 1.2 PersonalController (`/api/v1/personal`)
**Endpoints disponibles:**
- `POST /api/v1/personal` - Crear personal
- `GET /api/v1/personal/{id}` - Obtener por ID
- `GET /api/v1/personal` - Listar con filtros
- `PUT /api/v1/personal/{id}` - Actualizar
- `DELETE /api/v1/personal/{id}` - Eliminar

**Modelo de datos (PersonalRequest):**
```java
- docPersonal: String (requerido, max 20)
- nombrePersonal: String (requerido, max 100)
- emailPersonal: String (email válido, max 100)
- telefonoPersonal: String (max 20)
- idUsuario: Integer (relación 1:1 con Usuario)
- estatusPersonal: String (ACTIVO/INACTIVO, default: ACTIVO)
```

#### 1.3 EvaluacionController (`/api/v1/evaluaciones`)
**Endpoints disponibles:**
- `POST /api/v1/evaluaciones` - Crear evaluación
- `GET /api/v1/evaluaciones/{id}` - Obtener por ID
- `PUT /api/v1/evaluaciones/{id}` - Actualizar
- `DELETE /api/v1/evaluaciones/{id}` - Eliminar

**Modelo de datos (EvaluacionRequest):**
```java
- nombreEvaluacion: String (requerido, max 100)
- tituloEvaluacion: String (opcional, max 100)
- areaEvaluacion: String (opcional, max 100)
```

**Cambio importante:** La relación Consulta-Evaluación es ahora N:1 (muchas consultas pueden usar una evaluación).

#### 1.4 EvaluacionPreguntaController (`/api/v1/preguntas`)
**Endpoints disponibles:**
- `POST /api/v1/preguntas` - Crear pregunta
- `GET /api/v1/preguntas/{id}` - Obtener por ID
- `GET /api/v1/preguntas` - Listar todas
- `PUT /api/v1/preguntas/{id}` - Actualizar
- `DELETE /api/v1/preguntas/{id}` - Eliminar
- `GET /api/v1/preguntas/{idPregunta}/respuestas` - Listar respuestas de una pregunta

**Modelo de datos (EvaluacionPreguntaRequest):**
```java
- textoEvaluacionPregunta: String (requerido, min 5, max 1000)
```

**Modelo de respuesta (EvaluacionPreguntaResponse):**
```java
- idEvaluacionPregunta: Integer
- textoEvaluacionPregunta: String
- cantidadRespuestas: Integer
- createdAt: LocalDateTime
```

#### 1.5 EvaluacionRespuestaController (`/api/v1/evaluaciones/respuestas`)
**ENDPOINT PRINCIPAL - Integración RNTN + MySQL**

**Endpoints disponibles:**
- `POST /api/v1/evaluaciones/respuestas` - Registrar respuesta con análisis de sentimiento
- `GET /api/v1/evaluaciones/respuestas` - Listar todas con paginación
- `GET /api/v1/evaluaciones/respuestas/{id}` - Obtener por ID
- `GET /api/v1/evaluaciones/respuestas/label/{label}` - Buscar por label
- `GET /api/v1/evaluaciones/respuestas/alto-riesgo` - Respuestas de alto riesgo
- `PUT /api/v1/evaluaciones/respuestas/{id}` - Actualizar (recalcula análisis)
- `DELETE /api/v1/evaluaciones/respuestas/{id}` - Eliminar
- `GET /api/v1/evaluaciones/respuestas/analisis-agregado` - Análisis agregado por preguntas

**Modelo de datos (EvaluacionRespuestaRequest):**
```java
- idEvaluacionPregunta: Integer (requerido)
- textoEvaluacionRespuesta: String (requerido, min 1, max 5000)
- analizarSentimiento: boolean (default: true)
```

**Modelo de respuesta (EvaluacionRespuestaResponse):**
```java
- idEvaluacionRespuesta: Integer
- idEvaluacionPregunta: Integer
- textoPregunta: String
- textoEvaluacionRespuesta: String
- textoSetEvaluacionRespuesta: String (normalizado)
- labelEvaluacionRespuesta: String (ANXIETY, SUICIDAL, ANGER, SADNESS, FRUSTRATION)
- confidenceScore: Double
- sentimentAnalysis: AnalisisSentimientoResponse (análisis detallado)
- createdAt: LocalDateTime
```

**Análisis de Sentimiento:**
- El backend usa el modelo RNTN para analizar automáticamente el sentimiento
- Detecta: ANXIETY, SUICIDAL, ANGER, SADNESS, FRUSTRATION
- Si detecta SUICIDAL con alta confianza, genera alerta automática
- Incluye scores de confianza y distribución de sentimientos

---

## 2. COMPONENTES FRONTEND CREADOS

### 2.1 Componentes de Consultas (`src/components/consultations/`)

#### ConsultationForm.jsx
- Formulario para crear/editar consultas
- Carga dinámica de pacientes, personal y evaluaciones
- Validación de campos requeridos
- Soporte para selección de estado (solo en edición)
- Manejo de fechas en formato ISO

#### ConsultationList.jsx
- Lista de consultas con tabla interactiva
- Badges de estado con colores según tipo
- Acciones: Ver, Editar, Cambiar Estado, Finalizar, Eliminar
- Modal para actualizar estado
- Restricciones según estado (ej: no editar completadas)

#### ConsultationDetails.jsx
- Modal con información completa de la consulta
- Muestra paciente, personal y evaluación asociada
- Fechas de inicio, fin, creación y actualización
- Estado visual con colores

### 2.2 Componentes de Evaluaciones (`src/components/evaluations/`)

#### EvaluationForm.jsx
- Formulario para crear/editar evaluaciones
- Campos: nombre (requerido), título, área
- Selector de área con opciones predefinidas
- Validación de longitud de campos

#### EvaluationList.jsx
- Lista de evaluaciones con tabla
- Muestra nombre, título, área y fechas
- Acciones básicas CRUD

#### QuestionForm.jsx
- Formulario para preguntas de evaluación
- Campo de texto largo con contador de caracteres
- Validación: mínimo 5, máximo 1000 caracteres

#### QuestionList.jsx
- Lista de preguntas con contador de respuestas
- Acción especial: "Ver respuestas" de una pregunta

#### AnswerForm.jsx
- Formulario para registrar respuestas
- Carga dinámica de preguntas (si no se proporciona ID)
- Área de texto para respuesta (hasta 5000 caracteres)
- Checkbox para activar/desactivar análisis de sentimiento
- Alert informativo sobre el análisis RNTN

#### AnswerList.jsx
- Lista de respuestas con análisis de sentimiento
- Badges de sentimiento con colores:
  - ANXIETY: amarillo
  - SUICIDAL: rojo (alerta)
  - ANGER: naranja
  - SADNESS: azul
  - FRUSTRATION: morado
- Muestra porcentaje de confianza
- Resumen de riesgo alto al final

#### AnswerDetails.jsx
- Modal detallado con análisis completo
- Alerta especial para riesgo SUICIDAL
- Muestra pregunta y respuesta
- Texto normalizado
- Análisis de sentimiento con:
  - Label principal y confianza
  - Distribución de sentimientos (barras de progreso)
  - Nivel de riesgo
  - Fecha del análisis

### 2.3 Páginas Completas

#### ConsultationsPage.jsx
- Página completa de gestión de consultas
- Integra todos los componentes de consultas
- Sistema de permisos integrado
- Paginación
- Alertas de éxito/error
- CRUD completo con modales

#### EvaluationsPage.jsx
- Página con 3 pestañas: Evaluaciones, Preguntas, Respuestas
- Gestión completa de todo el flujo de evaluaciones
- Sistema de permisos por pestaña
- Paginación independiente por pestaña
- Navegación entre preguntas y sus respuestas

---

## 3. SERVICIOS FRONTEND (YA EXISTENTES - VERIFICADOS)

### consultationService.js ✅
- Todos los endpoints sincronizados con backend
- Usa `/estado` en lugar de `/status` ✅
- Método `finalize()` implementado ✅

### evaluationService.js ✅
- CRUD de evaluaciones ✅
- CRUD de respuestas (`answers`) ✅
- Métodos especiales:
  - `getAnswersByLabel()` ✅
  - `getHighRiskAnswers()` ✅
  - `getAggregateAnalysis()` ✅

### questionService.js ✅
- CRUD de preguntas ✅
- `getAnswersByQuestion()` para listar respuestas ✅

### staffService.js (existente)
- Verificado: endpoints de personal correctos

---

## 4. CONFIGURACIÓN API (api.config.js)

### Endpoints verificados y actualizados:
```javascript
CONSULTATIONS: {
  BASE: '/consultas',
  BY_ID: (id) => `/consultas/${id}`,
  BY_PATIENT: (patientId) => `/consultas/paciente/${patientId}`,
  BY_STAFF: (staffId) => `/consultas/personal/${staffId}`,
  UPDATE_STATUS: (id) => `/consultas/${id}/estado`, // ✅ Correcto
  FINALIZE: (id) => `/consultas/${id}/finalizar`, // ✅ Correcto
}

EVALUATIONS: {
  BASE: '/evaluaciones',
  BY_ID: (id) => `/evaluaciones/${id}`,
  ANSWERS: '/evaluaciones/respuestas', // ✅ Correcto
  ANSWER_BY_ID: (id) => `/evaluaciones/respuestas/${id}`,
  ANSWERS_BY_LABEL: (label) => `/evaluaciones/respuestas/label/${label}`,
  HIGH_RISK_ANSWERS: '/evaluaciones/respuestas/alto-riesgo',
}

QUESTIONS: {
  BASE: '/preguntas',
  BY_ID: (id) => `/preguntas/${id}`,
  ANSWERS_BY_QUESTION: (idPregunta) => `/preguntas/${idPregunta}/respuestas`,
}

STAFF: {
  BASE: '/personal',
  BY_ID: (id) => `/personal/${id}`,
}
```

---

## 5. CAMBIOS IMPORTANTES DETECTADOS EN BACKEND

### 5.1 Relación Consulta-Evaluación
**ANTES:** 1:1 (evaluación tenía idConsulta)
**AHORA:** N:1 (consulta tiene idEvaluacion opcional)

**Impacto en Frontend:**
- ✅ ConsultationForm permite seleccionar evaluación (opcional)
- ✅ ConsultaRequest incluye `idEvaluacion` como campo opcional
- ✅ Evaluaciones pueden reutilizarse en múltiples consultas

### 5.2 Estados de Consulta
**IDs numéricos en lugar de strings:**
- 1 = PENDIENTE
- 2 = EN_PROGRESO
- 3 = COMPLETADA
- 4 = CANCELADA
- 5 = REPROGRAMADA
- 6 = NO_ASISTIO

**Implementado en Frontend:**
- ✅ ConsultationForm maneja IDs numéricos
- ✅ ConsultationList muestra nombres traducidos
- ✅ Modal de actualización de estado

### 5.3 Personal con relación Usuario (1:1)
**Campo nuevo:**
- `idUsuario`: Integer - Relación 1:1 con tabla Usuario

**Nota:** Ya estaba contemplado en el servicio existente.

### 5.4 Análisis de Sentimientos Integrado
**Automático al registrar respuesta:**
- El backend analiza automáticamente con RNTN
- Genera alertas si detecta riesgo suicida
- Almacena label, confidence score y análisis detallado

**Implementado en Frontend:**
- ✅ AnswerForm con checkbox para activar análisis
- ✅ AnswerList muestra sentimiento y confianza visualmente
- ✅ AnswerDetails muestra análisis completo con gráficos
- ✅ Alertas visuales para riesgo SUICIDAL

---

## 6. SISTEMA DE PERMISOS

### Permisos necesarios por módulo:

**Consultas:**
- `consulta:create` - Crear consultas
- `consulta:read` - Ver consultas
- `consulta:update` - Editar/cambiar estado/finalizar
- `consulta:delete` - Eliminar consultas

**Evaluaciones:**
- `evaluacion:create`
- `evaluacion:read`
- `evaluacion:update`
- `evaluacion:delete`

**Preguntas:**
- `evaluacion_pregunta:create`
- `evaluacion_pregunta:read`
- `evaluacion_pregunta:update`
- `evaluacion_pregunta:delete`

**Respuestas:**
- `evaluacion_respuesta:create`
- `evaluacion_respuesta:read`
- `evaluacion_respuesta:update`
- `evaluacion_respuesta:delete`

**Personal:**
- `personal:create`
- `personal:read`
- `personal:update`
- `personal:delete`

✅ Todos implementados en las páginas usando `usePermissions()` hook

---

## 7. FLUJO DE TRABAJO TÍPICO

### Flujo 1: Crear Consulta con Evaluación
1. Crear preguntas de evaluación (`/preguntas`)
2. Crear evaluación (`/evaluaciones`)
3. Crear consulta y asociar evaluación (`/consultas`)
4. Durante la consulta: registrar respuestas con análisis (`/evaluaciones/respuestas`)
5. El sistema analiza automáticamente y alerta si hay riesgo
6. Finalizar consulta (`/consultas/{id}/finalizar`)

### Flujo 2: Monitoreo de Riesgo
1. Ver respuestas de alto riesgo (`/evaluaciones/respuestas/alto-riesgo`)
2. Filtrar por tipo de sentimiento (`/evaluaciones/respuestas/label/SUICIDAL`)
3. Ver detalles completos con análisis
4. Tomar acción según protocolo

---

## 8. ARCHIVOS CREADOS

### Componentes:
1. ✅ `src/components/consultations/ConsultationForm.jsx`
2. ✅ `src/components/consultations/ConsultationList.jsx`
3. ✅ `src/components/consultations/ConsultationDetails.jsx`
4. ✅ `src/components/consultations/index.js`
5. ✅ `src/components/evaluations/EvaluationForm.jsx`
6. ✅ `src/components/evaluations/EvaluationList.jsx`
7. ✅ `src/components/evaluations/QuestionForm.jsx`
8. ✅ `src/components/evaluations/QuestionList.jsx`
9. ✅ `src/components/evaluations/AnswerForm.jsx`
10. ✅ `src/components/evaluations/AnswerList.jsx`
11. ✅ `src/components/evaluations/AnswerDetails.jsx`
12. ✅ `src/components/evaluations/index.js`

### Páginas:
13. ✅ `src/pages/ConsultationsPage.jsx`
14. ✅ `src/pages/EvaluationsPage.jsx`

### Documentación:
15. ✅ `docs/SINCRONIZACION_FRONTEND_BACKEND.md` (este archivo)

---

## 9. PRÓXIMOS PASOS RECOMENDADOS

### 9.1 Integración con Rutas
Agregar las nuevas páginas al router de la aplicación:
```javascript
import ConsultationsPage from './pages/ConsultationsPage';
import EvaluationsPage from './pages/EvaluationsPage';

// En el router:
<Route path="/consultations" element={<ConsultationsPage />} />
<Route path="/evaluations" element={<EvaluationsPage />} />
```

### 9.2 Menú de Navegación
Agregar enlaces en el menú principal:
- "Consultas" → `/consultations`
- "Evaluaciones" → `/evaluations`

### 9.3 Dashboard de Riesgo
Crear un widget en el dashboard que muestre:
- Respuestas de alto riesgo recientes
- Alertas de riesgo suicida
- Estadísticas de sentimientos

### 9.4 Notificaciones
Implementar sistema de notificaciones push cuando:
- Se detecta riesgo SUICIDAL
- Se completa una consulta
- Hay respuestas pendientes de revisar

### 9.5 Exportación de Datos
Agregar funcionalidad para:
- Exportar consultas a PDF/Excel
- Exportar análisis de sentimientos
- Generar reportes agregados

---

## 10. COMPATIBILIDAD Y VALIDACIÓN

### ✅ Validado:
- Todos los endpoints del backend tienen su correspondiente en el frontend
- Los modelos de datos coinciden con los DTOs del backend
- Los servicios usan los métodos HTTP correctos
- La paginación está implementada correctamente
- El sistema de permisos está integrado
- Los formularios validan según las restricciones del backend

### ⚠️ Por validar en pruebas:
- Funcionamiento end-to-end con backend real
- Manejo de errores de red
- Experiencia de usuario en análisis de sentimientos
- Performance con grandes volúmenes de datos
- Alertas en tiempo real para riesgo alto

---

## 11. NOTAS TÉCNICAS

### Formatos de Fecha
- Backend usa: `LocalDateTime` en formato ISO-8601
- Frontend convierte: `new Date().toISOString()`
- Visualización: `toLocaleString('es-ES', ...)`

### Paginación
- Backend usa Spring Data Pageable
- Frontend maneja `page`, `size`, `sort` como params
- Respuesta incluye: `content`, `totalPages`, `totalElements`

### Análisis de Sentimientos
- Modelo: RNTN (Recursive Neural Tensor Network)
- Labels: ANXIETY, SUICIDAL, ANGER, SADNESS, FRUSTRATION
- Confidence: valor entre 0 y 1 (0% - 100%)
- Threshold de alto riesgo: 0.7 (70%)

---

## CONCLUSIÓN

✅ **Frontend completamente sincronizado con backend**
✅ **Todos los componentes CRUD implementados**
✅ **Sistema de permisos integrado**
✅ **Análisis de sentimientos con visualización completa**
✅ **Alertas de riesgo alto implementadas**
✅ **Documentación completa generada**

El frontend está listo para integrarse con el backend y comenzar pruebas end-to-end.

