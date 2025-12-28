import apiClient from './api';
import { API_ENDPOINTS } from '../config/api.config';

export const sentimentService = {
  // Single text prediction
  predict: async (text) => {
    const response = await apiClient.post(API_ENDPOINTS.SENTIMENT.PREDICT, { text });
    return response.data;
  },

  // Batch prediction
  batchPredict: async (texts) => {
    const response = await apiClient.post(API_ENDPOINTS.SENTIMENT.BATCH, { texts });
    return response.data;
  },

  // Batch prediction with aggregate analysis
  batchPredictAggregate: async (texts) => {
    const response = await apiClient.post(API_ENDPOINTS.SENTIMENT.BATCH_AGGREGATE, { texts });
    return response.data;
  },

  // Get sentiment labels
  getLabels: async () => {
    const response = await apiClient.get(API_ENDPOINTS.SENTIMENT.LABELS);
    return response.data;
  },

  // Get model statistics
  getModelStats: async () => {
    const response = await apiClient.get(API_ENDPOINTS.SENTIMENT.MODEL_STATS);
    return response.data;
  },

  // Get aggregate stats from database
  getAggregateStats: async (responseIds) => {
    const response = await apiClient.post(API_ENDPOINTS.SENTIMENT.AGGREGATE_STATS, responseIds);
    return response.data;
  },

  // Get distribution by evaluation
  getDistributionByEvaluation: async (idEvaluacion) => {
    const response = await apiClient.get(API_ENDPOINTS.SENTIMENT.AGGREGATE_EVALUATION(idEvaluacion));
    return response.data;
  },

  // Get high-risk alerts
  getHighRiskAlerts: async (daysBack = 7) => {
    const response = await apiClient.get(API_ENDPOINTS.SENTIMENT.HIGH_RISK_ALERTS, {
      params: { daysBack },
    });
    return response.data;
  },
};

export default sentimentService;

