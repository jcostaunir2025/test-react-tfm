import { Modal } from '../common/Modal';

/**
 * AnswerDetails - Modal para mostrar detalles completos de una respuesta con análisis
 * Sincronizado con EvaluacionRespuestaResponse del backend
 */
export const AnswerDetails = ({ answer, isOpen, onClose }) => {
  if (!answer) return null;

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSentimentColor = (label) => {
    const colors = {
      ANXIETY: 'yellow',
      SUICIDAL: 'red',
      ANGER: 'orange',
      SADNESS: 'blue',
      FRUSTRATION: 'purple',
    };
    return colors[label] || 'gray';
  };

  const getSentimentLabel = (label) => {
    const labels = {
      ANXIETY: 'Ansiedad',
      SUICIDAL: 'Riesgo Suicida',
      ANGER: 'Enojo',
      SADNESS: 'Tristeza',
      FRUSTRATION: 'Frustración',
    };
    return labels[label] || label;
  };

  const sentimentColor = getSentimentColor(answer.labelEvaluacionRespuesta);
  const sentimentLabel = getSentimentLabel(answer.labelEvaluacionRespuesta);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles de la Respuesta y Análisis de Sentimiento"
      size="large"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">Respuesta #{answer.idEvaluacionRespuesta}</h3>
              <p className="text-sm text-gray-600">{formatDateTime(answer.createdAt)}</p>
            </div>
            {answer.labelEvaluacionRespuesta && (
              <span
                className={`px-3 py-1 text-sm font-semibold rounded-full bg-${sentimentColor}-100 text-${sentimentColor}-800`}
              >
                {sentimentLabel}
              </span>
            )}
          </div>
        </div>

        {/* High Risk Alert */}
        {answer.labelEvaluacionRespuesta === 'SUICIDAL' && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">⚠️ Alerta de Riesgo Alto</h3>
                <p className="mt-1 text-sm text-red-700">
                  Se ha detectado riesgo suicida en esta respuesta. Se recomienda intervención
                  inmediata del personal especializado.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Question */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Pregunta</h4>
          <div className="bg-white border rounded-lg p-4">
            <p className="text-gray-700">{answer.textoPregunta || 'Sin pregunta asociada'}</p>
          </div>
        </div>

        {/* Answer Text */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Respuesta del Paciente</h4>
          <div className="bg-white border rounded-lg p-4">
            <p className="text-gray-700 whitespace-pre-wrap">{answer.textoEvaluacionRespuesta}</p>
          </div>
        </div>

        {/* Normalized Text */}
        {answer.textoSetEvaluacionRespuesta && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Texto Normalizado</h4>
            <div className="bg-gray-50 border rounded-lg p-4">
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {answer.textoSetEvaluacionRespuesta}
              </p>
            </div>
          </div>
        )}

        {/* Sentiment Analysis */}
        {answer.sentimentAnalysis && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Análisis de Sentimiento</h4>
            <div className="bg-white border rounded-lg p-4 space-y-3">
              {/* Main Label and Confidence */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Sentimiento Detectado:</span>
                  <p className="font-medium text-lg">{sentimentLabel}</p>
                </div>
                {answer.confidenceScore && (
                  <div>
                    <span className="text-sm text-gray-500">Nivel de Confianza:</span>
                    <p className="font-medium text-lg">
                      {(answer.confidenceScore * 100).toFixed(1)}%
                    </p>
                  </div>
                )}
              </div>

              {/* Sentiment Distribution */}
              {answer.sentimentAnalysis.sentimentScores && (
                <div className="pt-3 border-t">
                  <span className="text-sm text-gray-500 block mb-2">
                    Distribución de Sentimientos:
                  </span>
                  <div className="space-y-2">
                    {Object.entries(answer.sentimentAnalysis.sentimentScores).map(
                      ([label, score]) => {
                        const color = getSentimentColor(label);
                        const displayLabel = getSentimentLabel(label);
                        const percentage = (score * 100).toFixed(1);
                        return (
                          <div key={label} className="flex items-center">
                            <span className="text-sm w-24">{displayLabel}:</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-4">
                              <div
                                className={`bg-${color}-500 h-4 rounded-full`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm ml-2 w-12 text-right">{percentage}%</span>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}

              {/* Risk Level */}
              {answer.sentimentAnalysis.riskLevel && (
                <div className="pt-3 border-t">
                  <span className="text-sm text-gray-500">Nivel de Riesgo:</span>
                  <p className="font-medium">{answer.sentimentAnalysis.riskLevel}</p>
                </div>
              )}

              {/* Additional Info */}
              {answer.sentimentAnalysis.predictedAt && (
                <div className="pt-3 border-t">
                  <span className="text-sm text-gray-500">Análisis realizado:</span>
                  <p className="text-sm">{formatDateTime(answer.sentimentAnalysis.predictedAt)}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* No Analysis */}
        {!answer.labelEvaluacionRespuesta && !answer.sentimentAnalysis && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p className="text-sm text-yellow-700">
              Esta respuesta no ha sido analizada. El análisis de sentimiento puede ayudar a
              identificar riesgos y emociones del paciente.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AnswerDetails;

