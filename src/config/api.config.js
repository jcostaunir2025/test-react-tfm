// API Configuration
export const API_CONFIG = {
  // En desarrollo, usa URLs relativas para aprovechar el proxy de Vite
  // En producción, usa la variable de entorno o la URL completa del backend
  BASE_URL: import.meta.env.PROD
    ? (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080')
    : '', // URLs relativas en desarrollo (el proxy de Vite redirigirá a localhost:8080)
  API_VERSION: '/api/v1',
  TIMEOUT: 30000,
};

export const API_ENDPOINTS = {
  // Auth (uses /api/v1 prefix like all other endpoints)
  AUTH: {
    LOGIN: '/auth/login',
    VALIDATE: '/auth/validate',
  },

  // Sentiment Analysis
  SENTIMENT: {
    PREDICT: '/sentiment/predict',
    BATCH: '/sentiment/predict/batch',
    BATCH_AGGREGATE: '/sentiment/predict/batch/aggregate',
    LABELS: '/sentiment/labels',
    MODEL_STATS: '/sentiment/model/stats',
    AGGREGATE_STATS: '/sentiment/aggregate/stats',
    AGGREGATE_EVALUATION: (id) => `/sentiment/aggregate/evaluation/${id}`,
    HIGH_RISK_ALERTS: '/sentiment/alerts/high-risk',
  },

  // Patients
  PATIENTS: {
    BASE: '/pacientes',
    BY_ID: (id) => `/pacientes/${id}`,
  },

  // Medical Staff
  STAFF: {
    BASE: '/personal',
    BY_ID: (id) => `/personal/${id}`,
  },

  // Consultations
  CONSULTATIONS: {
    BASE: '/consultas',
    BY_ID: (id) => `/consultas/${id}`,
    BY_PATIENT: (patientId) => `/consultas/paciente/${patientId}`,
    BY_STAFF: (staffId) => `/consultas/personal/${staffId}`,
    UPDATE_STATUS: (id) => `/consultas/${id}/estado`,
    FINALIZE: (id) => `/consultas/${id}/finalizar`,
  },

  // Evaluations
  EVALUATIONS: {
    BASE: '/evaluaciones',
    BY_ID: (id) => `/evaluaciones/${id}`,
    AGGREGATE_ANALYSIS: '/evaluaciones/analisis-agregado',
    // Respuestas
    ANSWERS: '/evaluaciones/respuestas',
    ANSWER_BY_ID: (id) => `/evaluaciones/respuestas/${id}`,
    ANSWERS_BY_LABEL: (label) => `/evaluaciones/respuestas/label/${label}`,
    HIGH_RISK_ANSWERS: '/evaluaciones/respuestas/alto-riesgo',
  },

  // Questions
  QUESTIONS: {
    BASE: '/preguntas',
    BY_ID: (id) => `/preguntas/${id}`,
    ANSWERS_BY_QUESTION: (idPregunta) => `/preguntas/${idPregunta}/respuestas`,
  },

  // Reports
  REPORTS: {
    BASE: '/reportes',
    BY_ID: (id) => `/reportes/${id}`,
    BY_EVALUATION: (evalId) => `/reportes/evaluacion/${evalId}`,
    BY_USER: (userId) => `/reportes/usuario/${userId}`,
  },

  // Users (Admin only)
  USERS: {
    BASE: '/usuarios',
    BY_ID: (id) => `/usuarios/${id}`,
    BY_NAME: (nombreUsuario) => `/usuarios/nombre/${nombreUsuario}`,
    ROLES: '/usuarios/roles',
  },

  // Permissions
  PERMISSIONS: {
    BASE: '/permissions',
    BY_ID: (id) => `/permissions/${id}`,
    BY_RESOURCE: '/permissions/by-resource',
    RESOURCES: '/permissions/resources',
    ACTIONS: '/permissions/actions',
    MY_PERMISSIONS: '/permissions/my-permissions',
    MY_PERMISSIONS_BY_RESOURCE: '/permissions/my-permissions/by-resource',
    CHECK: (permissionName) => `/permissions/check/${permissionName}`,
  },

  // Role Permissions (Admin only)
  ROLE_PERMISSIONS: {
    BY_ROLE: (roleId) => `/role-permissions/role/${roleId}`,
    ASSIGN: '/role-permissions/assign',
    ADD: (roleId) => `/role-permissions/role/${roleId}/add`,
    REMOVE: (roleId) => `/role-permissions/role/${roleId}/remove`,
    SUMMARY: '/role-permissions/summary',
    HAS_PERMISSION: (roleId, permissionName) => `/role-permissions/role/${roleId}/has/${permissionName}`,
  },
};

// Risk levels mapping
export const RISK_LEVELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
};

// Sentiment labels mapping
export const SENTIMENT_LABELS = {
  ANXIETY: 'ANXIETY',
  SUICIDAL: 'SUICIDAL',
  ANGER: 'ANGER',
  SADNESS: 'SADNESS',
  FRUSTRATION: 'FRUSTRATION',
};

// Consultation status
export const CONSULTATION_STATUS = {
  PROGRAMADA: 'PROGRAMADA',
  EN_PROCESO: 'EN_PROCESO',
  COMPLETADA: 'COMPLETADA',
  CANCELADA: 'CANCELADA',
};

// User roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  DOCTOR: 'DOCTOR',
  ENFERMERO: 'ENFERMERO',
  ANALISTA: 'ANALISTA',
  RECEPCIONISTA: 'RECEPCIONISTA',
  TECNICO: 'TECNICO',
  AUDITOR: 'AUDITOR',
};

