/**
 * Ejemplos de Uso de los Servicios
 * Basado en CORS_FRONTEND_GUIDE.md
 *
 * Este archivo muestra cómo usar cada servicio correctamente
 */

import {
  authService,
  patientService,
  staffService,
  consultationService,
  evaluationService,
  reportService,
  sentimentService,
  userService,
} from '../services';

// ============================================
// 1. AUTENTICACIÓN
// ============================================

export const ejemplosAuth = {
  // Login
  login: async () => {
    try {
      const response = await authService.login('admin', 'password123');
      // Response: { token, type: 'Bearer', username, roles }
      localStorage.setItem('jwt_token', response.token);
      localStorage.setItem('user', JSON.stringify({
        username: response.username,
        roles: response.roles,
      }));
      return response;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },

  // Register (nuevo usuario)
  register: async () => {
    try {
      const userData = {
        username: 'nuevo_usuario',
        password: 'password123',
        email: 'usuario@email.com',
        rol: 'DOCTOR',
      };
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  },

  // Logout
  logout: async () => {
    await authService.logout();
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user');
  },
};

// ============================================
// 2. ANÁLISIS DE SENTIMIENTOS
// ============================================

export const ejemplosSentiment = {
  // Predicción simple
  predictSimple: async () => {
    try {
      const result = await sentimentService.predict('Me siento muy feliz hoy');
      // Response: { text, sentiment: 'POSITIVE', score: 4, confidence: 0.85 }
      console.log('Sentimiento:', result.sentiment);
      console.log('Puntuación:', result.score);
      return result;
    } catch (error) {
      console.error('Error en predicción:', error);
      throw error;
    }
  },

  // Predicción por lotes
  predictBatch: async () => {
    try {
      const texts = [
        'Me siento muy feliz',
        'Estoy triste y deprimido',
        'No me siento ni bien ni mal',
      ];
      const result = await sentimentService.batchPredict(texts);
      // Response: { predictions: [...], aggregateAnalysis: {...} }
      console.log('Análisis agregado:', result.aggregateAnalysis);
      return result;
    } catch (error) {
      console.error('Error en predicción batch:', error);
      throw error;
    }
  },
};

// ============================================
// 3. PACIENTES
// ============================================

export const ejemplosPacientes = {
  // Obtener todos los pacientes
  getAll: async () => {
    const pacientes = await patientService.getAll();
    console.log('Total de pacientes:', pacientes.length);
    return pacientes;
  },

  // Obtener paciente por ID
  getById: async (id) => {
    const paciente = await patientService.getById(id);
    console.log('Paciente:', paciente.nombre, paciente.apellido);
    return paciente;
  },

  // Crear paciente
  create: async () => {
    const nuevoPaciente = {
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan@email.com',
      telefono: '123456789',
      fechaNacimiento: '1990-01-01',
    };
    const paciente = await patientService.create(nuevoPaciente);
    return paciente;
  },

  // Buscar pacientes
  search: async (searchTerm) => {
    const results = await patientService.search(searchTerm);
    return results;
  },

  // Actualizar paciente
  update: async (id, data) => {
    const updated = await patientService.update(id, data);
    return updated;
  },

  // Eliminar paciente
  delete: async (id) => {
    await patientService.delete(id);
    console.log('Paciente eliminado');
  },
};

// ============================================
// 4. PERSONAL MÉDICO
// ============================================

export const ejemplosStaff = {
  // Obtener todo el personal
  getAll: async () => {
    const staff = await staffService.getAll();
    return staff;
  },

  // Obtener personal por ID
  getById: async (id) => {
    const member = await staffService.getById(id);
    return member;
  },

  // Crear miembro del personal
  create: async () => {
    const nuevoStaff = {
      nombre: 'Dr. María',
      apellido: 'González',
      especialidad: 'Psiquiatría',
      email: 'maria@hospital.com',
    };
    const staff = await staffService.create(nuevoStaff);
    return staff;
  },

  // Buscar personal
  search: async (searchTerm) => {
    const results = await staffService.search(searchTerm);
    return results;
  },
};

// ============================================
// 5. CONSULTAS
// ============================================

export const ejemplosConsultas = {
  // Obtener todas las consultas
  getAll: async () => {
    const consultas = await consultationService.getAll();
    return consultas;
  },

  // Obtener consultas por paciente
  getByPatient: async (patientId) => {
    const consultas = await consultationService.getByPatient(patientId);
    console.log(`Consultas del paciente ${patientId}:`, consultas.length);
    return consultas;
  },

  // Obtener consultas por personal
  getByStaff: async (staffId) => {
    const consultas = await consultationService.getByStaff(staffId);
    return consultas;
  },

  // Crear consulta
  create: async () => {
    const nuevaConsulta = {
      idPaciente: 1,
      idPersonal: 2,
      fecha: '2025-12-27T10:00:00',
      motivo: 'Consulta de seguimiento',
      estado: 'PROGRAMADA',
    };
    const consulta = await consultationService.create(nuevaConsulta);
    return consulta;
  },

  // Actualizar estado de consulta
  updateStatus: async (id, status) => {
    const updated = await consultationService.updateStatus(id, status);
    console.log('Nuevo estado:', status);
    return updated;
  },
};

// ============================================
// 6. EVALUACIONES
// ============================================

export const ejemplosEvaluaciones = {
  // Obtener todas las evaluaciones
  getAll: async () => {
    const evaluaciones = await evaluationService.getAll();
    return evaluaciones;
  },

  // Obtener evaluaciones por consulta
  getByConsultation: async (consultId) => {
    const evaluaciones = await evaluationService.getByConsultation(consultId);
    return evaluaciones;
  },

  // Obtener agregados de evaluación
  getAggregates: async (id) => {
    const aggregates = await evaluationService.getAggregates(id);
    return aggregates;
  },

  // Obtener evaluaciones de alto riesgo
  getHighRisk: async () => {
    const highRisk = await evaluationService.getHighRisk();
    console.log('Evaluaciones de alto riesgo:', highRisk.length);
    return highRisk;
  },

  // Obtener evaluaciones de alto riesgo recientes
  getHighRiskRecent: async (days = 7) => {
    const recent = await evaluationService.getHighRiskRecent(days);
    console.log(`Alto riesgo últimos ${days} días:`, recent.length);
    return recent;
  },

  // Crear evaluación
  create: async () => {
    const nuevaEvaluacion = {
      idConsulta: 1,
      fecha: '2025-12-27',
      observaciones: 'Paciente muestra mejoría',
    };
    const evaluacion = await evaluationService.create(nuevaEvaluacion);
    return evaluacion;
  },
};

// ============================================
// 7. REPORTES
// ============================================

export const ejemplosReportes = {
  // Obtener todos los reportes
  getAll: async () => {
    const reportes = await reportService.getAll();
    return reportes;
  },

  // Obtener reportes por evaluación
  getByEvaluation: async (evalId) => {
    const reportes = await reportService.getByEvaluation(evalId);
    return reportes;
  },

  // Obtener reportes por usuario
  getByUser: async (userId) => {
    const reportes = await reportService.getByUser(userId);
    return reportes;
  },

  // Generar reporte
  generate: async () => {
    const reportData = {
      idEvaluacion: 1,
      tipo: 'COMPLETO',
      formato: 'PDF',
    };
    const reporte = await reportService.generate(reportData);
    return reporte;
  },
};

// ============================================
// 8. USUARIOS (ADMIN)
// ============================================

export const ejemplosUsuarios = {
  // Obtener todos los usuarios (requiere ADMIN)
  getAll: async () => {
    const usuarios = await userService.getAll();
    return usuarios;
  },

  // Obtener usuario por ID
  getById: async (id) => {
    const usuario = await userService.getById(id);
    return usuario;
  },

  // Crear usuario
  create: async () => {
    const nuevoUsuario = {
      username: 'nuevo_doctor',
      password: 'password123',
      email: 'doctor@hospital.com',
      rol: 'DOCTOR',
      activo: true,
    };
    const usuario = await userService.create(nuevoUsuario);
    return usuario;
  },

  // Cambiar contraseña
  changePassword: async (id) => {
    const passwordData = {
      oldPassword: 'password123',
      newPassword: 'newPassword456',
    };
    await userService.changePassword(id, passwordData);
    console.log('Contraseña actualizada');
  },

  // Activar usuario
  activate: async (id) => {
    await userService.activate(id);
    console.log('Usuario activado');
  },

  // Desactivar usuario
  deactivate: async (id) => {
    await userService.deactivate(id);
    console.log('Usuario desactivado');
  },
};

// ============================================
// 9. EJEMPLO COMPLETO: FLUJO DE TRABAJO
// ============================================

export const ejemploFlujoCompleto = async () => {
  try {
    // 1. Login
    console.log('1. Iniciando sesión...');
    const auth = await authService.login('admin', 'password123');
    localStorage.setItem('jwt_token', auth.token);

    // 2. Obtener pacientes
    console.log('2. Obteniendo pacientes...');
    const pacientes = await patientService.getAll();

    // 3. Seleccionar un paciente
    const paciente = pacientes[0];
    console.log('3. Paciente seleccionado:', paciente.nombre);

    // 4. Obtener consultas del paciente
    console.log('4. Obteniendo consultas...');
    const consultas = await consultationService.getByPatient(paciente.idPaciente);

    // 5. Obtener evaluaciones de una consulta
    const consulta = consultas[0];
    console.log('5. Obteniendo evaluaciones...');
    const evaluaciones = await evaluationService.getByConsultation(consulta.idConsulta);

    // 6. Analizar sentimiento de texto de evaluación
    console.log('6. Analizando sentimiento...');
    const sentiment = await sentimentService.predict(
      'El paciente muestra signos de mejoría y está más optimista'
    );
    console.log('Sentimiento detectado:', sentiment.sentiment);

    // 7. Verificar evaluaciones de alto riesgo
    console.log('7. Verificando alto riesgo...');
    const highRisk = await evaluationService.getHighRisk();
    console.log('Casos de alto riesgo:', highRisk.length);

    return {
      auth,
      pacientes,
      consultas,
      evaluaciones,
      sentiment,
      highRisk,
    };
  } catch (error) {
    console.error('Error en flujo completo:', error);
    throw error;
  }
};

export default {
  ejemplosAuth,
  ejemplosSentiment,
  ejemplosPacientes,
  ejemplosStaff,
  ejemplosConsultas,
  ejemplosEvaluaciones,
  ejemplosReportes,
  ejemplosUsuarios,
  ejemploFlujoCompleto,
};

