import apiClient from './api';
import { API_ENDPOINTS } from '../config/api.config';

/**
 * Question Service - Gestión de preguntas de evaluación
 */
export const questionService = {
  // Get all questions
  getAll: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.QUESTIONS.BASE, { params });
    return response.data;
  },

  // Get question by ID
  getById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.QUESTIONS.BY_ID(id));
    return response.data;
  },

  // Get answers for a specific question
  getAnswersByQuestion: async (idPregunta) => {
    const response = await apiClient.get(API_ENDPOINTS.QUESTIONS.ANSWERS_BY_QUESTION(idPregunta));
    return response.data;
  },

  // Create question
  create: async (questionData) => {
    const response = await apiClient.post(API_ENDPOINTS.QUESTIONS.BASE, questionData);
    return response.data;
  },

  // Update question
  update: async (id, questionData) => {
    const response = await apiClient.put(API_ENDPOINTS.QUESTIONS.BY_ID(id), questionData);
    return response.data;
  },

  // Delete question
  delete: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.QUESTIONS.BY_ID(id));
    return response.data;
  },
};

export default questionService;

