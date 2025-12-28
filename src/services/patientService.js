import apiClient from './api';
import { API_ENDPOINTS } from '../config/api.config';

export const patientService = {
  // Get all patients with optional filters
  getAll: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.PATIENTS.BASE, { params });
    return response.data;
  },

  // Get patient by ID
  getById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.PATIENTS.BY_ID(id));
    return response.data;
  },

  // Create patient
  create: async (patientData) => {
    const response = await apiClient.post(API_ENDPOINTS.PATIENTS.BASE, patientData);
    return response.data;
  },

  // Update patient
  update: async (id, patientData) => {
    const response = await apiClient.put(API_ENDPOINTS.PATIENTS.BY_ID(id), patientData);
    return response.data;
  },

  // Delete patient (soft delete)
  delete: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.PATIENTS.BY_ID(id));
    return response.data;
  },

  // Search patients (usa query param 'search' en lugar de endpoint separado)
  search: async (searchTerm, params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.PATIENTS.BASE, {
      params: { search: searchTerm, ...params },
    });
    return response.data;
  },
};

export default patientService;

