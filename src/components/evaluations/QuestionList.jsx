import { Table } from '../common/Table';

/**
 * QuestionList - Lista de preguntas de evaluación
 * Sincronizado con EvaluacionPreguntaResponse del backend
 */
export const QuestionList = ({
  questions = [],
  onEdit,
  onDelete,
  onViewAnswers,
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

  const columns = [
    {
      key: 'idEvaluacionPregunta',
      label: 'ID',
      render: (value) => <span className="font-medium">#{value}</span>,
    },
    {
      key: 'textoEvaluacionPregunta',
      label: 'Pregunta',
      render: (value) => (
        <div className="max-w-md">
          <p className="text-sm">{value}</p>
        </div>
      ),
    },
    {
      key: 'cantidadRespuestas',
      label: 'Respuestas',
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {value || 0}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Creado',
      render: (value) => <div className="text-sm text-gray-500">{formatDateTime(value)}</div>,
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_, row) => (
        <div className="flex space-x-2">
          {onViewAnswers && (
            <button
              onClick={() => onViewAnswers(row)}
              className="text-blue-600 hover:text-blue-900 text-sm"
              title="Ver respuestas"
            >
              Respuestas
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
              onClick={() => onDelete(row.idEvaluacionPregunta)}
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
    <Table
      data={questions}
      columns={columns}
      isLoading={isLoading}
      emptyMessage="No hay preguntas registradas"
    />
  );
};

export default QuestionList;

