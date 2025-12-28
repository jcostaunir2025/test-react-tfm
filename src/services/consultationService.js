import apiClient from './api';
import { API_ENDPOINTS } from '../config/api.config';

export const consultationService = {
  // Get all consultations
  getAll: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.CONSULTATIONS.BASE, { params });
    return response.data;
  },

  // Get consultation by ID
  getById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.CONSULTATIONS.BY_ID(id));
    return response.data;
  },

  // Get consultations by patient (con filtros de fecha opcionales)
  getByPatient: async (patientId, params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.CONSULTATIONS.BY_PATIENT(patientId), { params });
    return response.data;
  },

  // Get consultations by staff
  getByStaff: async (staffId, params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.CONSULTATIONS.BY_STAFF(staffId), { params });
    return response.data;
  },

  // Create consultation
  create: async (consultationData) => {
    const response = await apiClient.post(API_ENDPOINTS.CONSULTATIONS.BASE, consultationData);
    return response.data;
  },

  // Update consultation
  update: async (id, consultationData) => {
    const response = await apiClient.put(API_ENDPOINTS.CONSULTATIONS.BY_ID(id), consultationData);
    return response.data;
  },

  // Update consultation status (usa /estado en lugar de /status)
  updateStatus: async (id, estatusConsulta) => {
    const response = await apiClient.patch(API_ENDPOINTS.CONSULTATIONS.UPDATE_STATUS(id), { estatusConsulta });
    return response.data;
  },

  // Finalize consultation
  finalize: async (id, fechafinConsulta = null) => {
    const body = fechafinConsulta ? { fechafinConsulta } : {};
    const response = await apiClient.post(API_ENDPOINTS.CONSULTATIONS.FINALIZE(id), body);
    return response.data;
  },

  // Delete consultation
  delete: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.CONSULTATIONS.BY_ID(id));
    return response.data;
  },
};

export default consultationService;

