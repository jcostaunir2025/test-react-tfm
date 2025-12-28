# RNTN Sentiment Analysis Frontend

Sistema frontend completo para el análisis de sentimientos en salud mental basado en Recursive Neural Tensor Network (RNTN).

## 🎯 Descripción

Aplicación web desarrollada en React + Vite que consume la API REST del sistema de análisis de sentimientos para salud mental. Proporciona una interfaz completa para la gestión de pacientes, consultas, evaluaciones y monitoreo de casos de alto riesgo.

## 🚀 Características Principales

### 🔐 Autenticación y Autorización
- Login con JWT
- Control de acceso basado en roles (RBAC)
- 7 roles predefinidos: ADMIN, DOCTOR, ENFERMERO, ANALISTA, RECEPCIONISTA, TECNICO, AUDITOR
- Rutas protegidas según permisos

### 👥 Gestión de Pacientes
- CRUD completo de pacientes
- Búsqueda y filtrado
- Información de contacto y datos demográficos
- Historial de consultas

### 📅 Gestión de Consultas
- Programación de consultas
- Estados: PROGRAMADA, EN_PROCESO, COMPLETADA, CANCELADA
- Asignación de profesionales
- Seguimiento temporal

### 📋 Evaluaciones y Análisis
- Creación y gestión de evaluaciones
- Preguntas estandarizadas
- Análisis automático de sentimientos con RNTN
- 5 categorías de sentimientos:
  - 🟡 Ansiedad (Riesgo Medio)
  - 🔴 Pensamientos Suicidas (Alto Riesgo)
  - 🟠 Enojo (Riesgo Medio)
  - 🔵 Tristeza (Riesgo Medio)
  - ⚪ Frustración (Riesgo Bajo)

### 🧠 Análisis de Sentimientos
- **Análisis Individual**: Analiza texto único con resultado detallado
- **Análisis por Lote**: Procesa múltiples textos simultáneamente
- **Estadísticas Agregadas**: Distribución, sentimiento dominante, promedios
- **Confianza de Predicción**: Score de 0-100%
- **Nivel de Riesgo**: Clasificación automática

### ⚠️ Monitoreo de Alto Riesgo
- Dashboard de casos críticos
- Detección automática de pensamientos suicidas
- Alertas en tiempo real
- Información de contacto para intervención
- Filtros temporales (24h, 3d, 7d, 30d)

### 📊 Reportes y Analytics
- Generación automática de reportes
- Visualizaciones con Recharts
- Estadísticas de evaluaciones
- Exportación de datos

### 👨‍💻 Gestión de Usuarios (Admin)
- Administración de usuarios del sistema
- Asignación de roles y permisos
- Activación/desactivación de cuentas

## 🛠️ Tecnologías Utilizadas

### Core
- **React 19.2** - Framework UI
- **Vite 7.2** - Build tool y dev server
- **React Router DOM 7.10** - Navegación

### Estado y Datos
- **Zustand 4.5** - Gestión de estado global
- **Axios 1.7** - Cliente HTTP
- **React Hook Form 7.53** - Manejo de formularios

### UI/UX
- **Tailwind CSS 3.4** - Estilos utility-first
- **Lucide React 0.468** - Iconos
- **Recharts 2.15** - Gráficos y visualizaciones

### Utilidades
- **date-fns 4.1** - Manipulación de fechas
- **clsx 2.1** - Utilidad para clases CSS

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── common/           # Componentes reutilizables
│   │   ├── Alert.jsx
│   │   ├── Card.jsx
│   │   ├── Loading.jsx
│   │   ├── Modal.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── Table.jsx
│   ├── layout/           # Layout de la aplicación
│   │   ├── Header.jsx
│   │   ├── Layout.jsx
│   │   └── Sidebar.jsx
│   ├── patients/         # Componentes de pacientes
│   ├── consultations/    # Componentes de consultas
│   ├── evaluations/      # Componentes de evaluaciones
│   ├── reports/          # Componentes de reportes
│   └── sentiment/        # Componentes de análisis
├── config/
│   └── api.config.js     # Configuración de API y constantes
├── pages/                # Páginas principales
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   ├── PatientsPage.jsx
│   ├── SentimentAnalysisPage.jsx
│   ├── HighRiskMonitoringPage.jsx
│   └── ...
├── services/             # Servicios de API
│   ├── api.js            # Cliente Axios configurado
│   ├── authService.js
│   ├── patientService.js
│   ├── consultationService.js
│   ├── evaluationService.js
│   ├── reportService.js
│   └── sentimentService.js
├── store/
│   └── authStore.js      # Store de autenticación
├── utils/                # Utilidades
│   ├── classNames.js
│   ├── dateUtils.js
│   └── sentimentUtils.js
├── App.jsx               # Componente raíz con rutas
├── main.jsx              # Entry point
└── index.css             # Estilos globales

```

## 🚦 Instalación y Configuración

### Prerequisitos
- Node.js 18+ 
- npm o yarn
- Backend API corriendo en http://localhost:8080

### Instalación

1. **Clonar el repositorio**
```bash
cd test-react-tfm
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env con tu configuración
VITE_API_BASE_URL=http://localhost:8080
```

4. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

5. **Abrir en el navegador**
```
http://localhost:5173
```

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo con HMR

# Producción
npm run build        # Construye para producción
npm run preview      # Previsualiza build de producción

# Calidad de código
npm run lint         # Ejecuta ESLint
```

## 🔑 Usuarios de Prueba

El backend proporciona usuarios de prueba para cada rol:

| Usuario | Contraseña | Rol | Permisos |
|---------|-----------|-----|----------|
| admin | admin123 | ADMIN | Acceso completo |
| doctor | doctor123 | DOCTOR | Operaciones médicas |
| enfermero | enfermero123 | ENFERMERO | Cuidados básicos |
| analista | analista123 | ANALISTA | Analytics y reportes |
| recepcionista | recep123 | RECEPCIONISTA | Registro de pacientes |

## 🎨 Diseño y UI/UX

### Sistema de Colores
- **Primary**: Azul (#3b82f6) - Acciones principales
- **Danger**: Rojo (#ef4444) - Alertas y alto riesgo
- **Warning**: Amarillo (#f59e0b) - Advertencias
- **Success**: Verde (#22c55e) - Confirmaciones

### Badges de Sentimientos
- **Ansiedad**: Fondo amarillo
- **Suicidal**: Fondo rojo con animación pulse
- **Enojo**: Fondo naranja
- **Tristeza**: Fondo azul
- **Frustración**: Fondo gris

### Responsividad
- Mobile-first design
- Breakpoints de Tailwind (sm, md, lg, xl)
- Sidebar colapsable
- Tablas con scroll horizontal

## 🔌 Integración con Backend

### Endpoints Principales Utilizados

```javascript
// Autenticación
POST /api/v1/auth/login

// Análisis de Sentimientos
POST /api/v1/sentiment/predict
POST /api/v1/sentiment/batch
POST /api/v1/sentiment/batch/with-aggregates

// Pacientes
GET    /api/v1/pacientes
POST   /api/v1/pacientes
PUT    /api/v1/pacientes/:id
DELETE /api/v1/pacientes/:id

// Evaluaciones
GET /api/v1/evaluaciones/:id/aggregates
GET /api/v1/evaluaciones/high-risk
GET /api/v1/evaluaciones/high-risk/recent/:days

// Reportes
POST /api/v1/reportes/generate
GET  /api/v1/reportes
```

### Manejo de Errores
- Interceptor de Axios para errores globales
- Redirección automática en 401 (no autorizado)
- Mensajes de error amigables
- Componentes Alert para feedback visual

### Autenticación JWT
- Token almacenado en localStorage
- Header `Authorization: Bearer {token}` en todas las peticiones
- Renovación automática (próximamente)
- Logout con limpieza de estado

## 🧪 Testing (Próximamente)

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## 📦 Build y Deploy

### Build para Producción
```bash
npm run build
```

Genera carpeta `dist/` con:
- HTML, CSS, JS minificados
- Assets optimizados
- Source maps

### Despliegue
Compatible con:
- **Vercel**: `vercel --prod`
- **Netlify**: Drag & drop de carpeta `dist/`
- **Nginx**: Servir carpeta `dist/`
- **Apache**: Configurar mod_rewrite para SPA

### Variables de Entorno en Producción
```env
VITE_API_BASE_URL=https://api.yourdomain.com
```

## 🔒 Seguridad

- ✅ JWT para autenticación
- ✅ Rutas protegidas por roles
- ✅ Validación de formularios
- ✅ Sanitización de inputs
- ✅ HTTPS en producción (recomendado)
- ✅ CSP headers (configurar en servidor)

## 🎯 Roadmap

### Completado ✅
- [x] Autenticación JWT
- [x] Dashboard principal
- [x] Gestión de pacientes
- [x] Análisis de sentimientos
- [x] Monitoreo de alto riesgo
- [x] Layout responsive

### En Desarrollo 🚧
- [ ] Módulo de consultas completo
- [ ] Módulo de evaluaciones completo
- [ ] Generación avanzada de reportes
- [ ] Gestión de usuarios (admin)
- [ ] Configuración del sistema

### Futuro 🔮
- [ ] Notificaciones en tiempo real (WebSockets)
- [ ] Exportación a PDF/Excel
- [ ] Gráficos avanzados
- [ ] Modo offline
- [ ] Internacionalización (i18n)
- [ ] Tema oscuro/claro

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto es privado y confidencial. Todos los derechos reservados © 2025

## 👥 Autores

- **Javier Costa** - Desarrollo Frontend
- **Equipo Backend** - API REST RNTN

## 📞 Soporte

## 📚 Documentación

Para documentación técnica detallada, consulta la carpeta [`docs/`](./docs/):
- **[Índice de Documentación](./docs/INDEX.md)** - Índice completo de todos los documentos
- **[Guía de Permisos](./docs/GUIA_PERMISOS.md)** - Sistema de roles y permisos
- **[Módulo de Pacientes](./docs/MODULO_PACIENTES_DOCUMENTACION.md)** - Documentación del módulo de pacientes
- **[Soluciones CORS](./docs/RESUMEN_FINAL_CORS.md)** - Configuración y solución de problemas CORS

Para soporte y consultas:
- Email: support@rntn-system.com
- Documentación API: http://localhost:8080/swagger-ui.html

## 🙏 Agradecimientos

- Stanford CoreNLP por el modelo RNTN
- Comunidad React
- Tailwind CSS
- Todos los colaboradores del proyecto

---

**Versión**: 1.0.0  
**Última actualización**: 28 de Diciembre, 2025  
**Estado**: ✅ Producción

