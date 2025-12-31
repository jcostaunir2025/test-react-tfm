import { Table } from '../common/Table';

/**
 * AnswerList - Lista de respuestas de evaluación con análisis de sentimiento
 * Sincronizado con EvaluacionRespuestaResponse del backend
 */
export const AnswerList = ({
  answers = [],
  onEdit,
  onDelete,
  onViewDetails,
  isLoading = false,
}) => {
  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
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

  const columns = [
    {
      key: 'idEvaluacionRespuesta',
      label: 'ID',
      render: (value) => <span className="font-medium">#{value}</span>,
    },
    {
      key: 'textoPregunta',
      label: 'Pregunta',
      render: (value) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-600 truncate">{value || '-'}</p>
        </div>
      ),
    },
    {
      key: 'textoEvaluacionRespuesta',
      label: 'Respuesta',
      render: (value) => (
        <div className="max-w-md">
          <p className="text-sm truncate">{value}</p>
        </div>
      ),
    },
    {
      key: 'labelEvaluacionRespuesta',
      label: 'Sentimiento',
      render: (value, row) => {
        if (!value) return <span className="text-gray-400 text-sm">Sin analizar</span>;
        const color = getSentimentColor(value);
        const label = getSentimentLabel(value);
        return (
          <div className="flex flex-col">
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full bg-${color}-100 text-${color}-800`}
            >
              {label}
            </span>
            {row.confidenceScore && (
              <span className="text-xs text-gray-500 mt-1">
                {(row.confidenceScore * 100).toFixed(1)}% confianza
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: 'createdAt',
      label: 'Fecha',
      render: (value) => <div className="text-sm text-gray-500">{formatDateTime(value)}</div>,
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_, row) => (
        <div className="flex space-x-2">
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(row)}
              className="text-blue-600 hover:text-blue-900 text-sm"
              title="Ver detalles"
            >
              Ver
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(row)}
              className="text-indigo-600 hover:text-indigo-900 text-sm"
              title="Editar"
            >
              Editar
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(row.idEvaluacionRespuesta)}
              className="text-red-600 hover:text-red-900 text-sm"
              title="Eliminar"
            >
              Eliminar
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <Table
        data={answers}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No hay respuestas registradas"
      />

      {/* Risk Alert Summary */}
      {answers.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total de respuestas:</span>
            <span className="font-medium">{answers.length}</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-600">Riesgo alto detectado:</span>
            <span className="font-medium text-red-600">
              {answers.filter((a) => a.labelEvaluacionRespuesta === 'SUICIDAL').length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnswerList;

