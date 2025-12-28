import { SENTIMENT_LABELS, RISK_LEVELS } from '../config/api.config';

export const getSentimentBadgeClass = (sentiment) => {
  const mapping = {
    [SENTIMENT_LABELS.ANXIETY]: 'badge-anxiety',
    [SENTIMENT_LABELS.SUICIDAL]: 'badge-suicidal',
    [SENTIMENT_LABELS.ANGER]: 'badge-anger',
    [SENTIMENT_LABELS.SADNESS]: 'badge-sadness',
    [SENTIMENT_LABELS.FRUSTRATION]: 'badge-frustration',
  };
  return mapping[sentiment] || 'badge';
};

export const getRiskBadgeClass = (riskLevel) => {
  const mapping = {
    [RISK_LEVELS.HIGH]: 'badge-high-risk',
    [RISK_LEVELS.MEDIUM]: 'badge-medium-risk',
    [RISK_LEVELS.LOW]: 'badge-low-risk',
  };
  return mapping[riskLevel] || 'badge';
};

export const getSentimentLabel = (sentiment) => {
  const labels = {
    [SENTIMENT_LABELS.ANXIETY]: 'Ansiedad',
    [SENTIMENT_LABELS.SUICIDAL]: 'Pensamientos Suicidas',
    [SENTIMENT_LABELS.ANGER]: 'Enojo',
    [SENTIMENT_LABELS.SADNESS]: 'Tristeza',
    [SENTIMENT_LABELS.FRUSTRATION]: 'Frustración',
  };
  return labels[sentiment] || sentiment;
};

export const getRiskLabel = (riskLevel) => {
  const labels = {
    [RISK_LEVELS.HIGH]: 'Alto Riesgo',
    [RISK_LEVELS.MEDIUM]: 'Riesgo Medio',
    [RISK_LEVELS.LOW]: 'Riesgo Bajo',
  };
  return labels[riskLevel] || riskLevel;
};

export const formatConfidence = (confidence) => {
  return `${(confidence * 100).toFixed(1)}%`;
};

