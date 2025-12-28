import apiClient from './api';
import { API_ENDPOINTS } from '../config/api.config';

export const reportService = {
  // Get all reports
  getAll: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.REPORTS.BASE, { params });
    return response.data;
  },

  // Get report by ID
  getById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.REPORTS.BY_ID(id));
    return response.data;
  },

  // Get reports by evaluation
  getByEvaluation: async (evalId, params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.REPORTS.BY_EVALUATION(evalId), { params });
    return response.data;
  },

  // Get reports by user
  getByUser: async (userId, params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.REPORTS.BY_USER(userId), { params });
    return response.data;
  },

  // Generate/create report
  generate: async (reportData) => {
    const response = await apiClient.post(API_ENDPOINTS.REPORTS.BASE, reportData);
    return response.data;
  },

  // Update report
  update: async (id, reportData) => {
    const response = await apiClient.put(API_ENDPOINTS.REPORTS.BY_ID(id), reportData);
    return response.data;
  },

  // Delete report
  delete: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.REPORTS.BY_ID(id));
    return response.data;
  },
};

export default reportService;

