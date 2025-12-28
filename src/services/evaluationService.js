import apiClient from './api';
import { API_ENDPOINTS } from '../config/api.config';

export const evaluationService = {
  // Get all evaluations
  getAll: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.EVALUATIONS.BASE, { params });
    return response.data;
  },

  // Get evaluation by ID
  getById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.EVALUATIONS.BY_ID(id));
    return response.data;
  },

  // Get evaluation aggregated analysis by question IDs
  getAggregateAnalysis: async (preguntaIds) => {
    const response = await apiClient.get(API_ENDPOINTS.EVALUATIONS.AGGREGATE_ANALYSIS, {
      params: { preguntaIds: preguntaIds.join(',') },
    });
    return response.data;
  },

  // Create evaluation
  create: async (evaluationData) => {
    const response = await apiClient.post(API_ENDPOINTS.EVALUATIONS.BASE, evaluationData);
    return response.data;
  },

  // Update evaluation
  update: async (id, evaluationData) => {
    const response = await apiClient.put(API_ENDPOINTS.EVALUATIONS.BY_ID(id), evaluationData);
    return response.data;
  },

  // Delete evaluation
  delete: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.EVALUATIONS.BY_ID(id));
    return response.data;
  },

  // ===== RESPUESTAS =====

  // Get all answers (respuestas)
  getAllAnswers: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.EVALUATIONS.ANSWERS, { params });
    return response.data;
  },

  // Get answer by ID
  getAnswerById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.EVALUATIONS.ANSWER_BY_ID(id));
    return response.data;
  },

  // Create evaluation answer with sentiment analysis
  createAnswer: async (answerData) => {
    const response = await apiClient.post(API_ENDPOINTS.EVALUATIONS.ANSWERS, answerData);
    return response.data;
  },

  // Update evaluation answer
  updateAnswer: async (id, answerData) => {
    const response = await apiClient.put(API_ENDPOINTS.EVALUATIONS.ANSWER_BY_ID(id), answerData);
    return response.data;
  },

  // Delete evaluation answer
  deleteAnswer: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.EVALUATIONS.ANSWER_BY_ID(id));
    return response.data;
  },

  // Get answers by sentiment label
  getAnswersByLabel: async (label) => {
    const response = await apiClient.get(API_ENDPOINTS.EVALUATIONS.ANSWERS_BY_LABEL(label));
    return response.data;
  },

  // Get high-risk answers
  getHighRiskAnswers: async (umbral = 0.7) => {
    const response = await apiClient.get(API_ENDPOINTS.EVALUATIONS.HIGH_RISK_ANSWERS, {
      params: { umbral },
    });
    return response.data;
  },
};

export default evaluationService;

