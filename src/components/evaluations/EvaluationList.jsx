import { Table } from '../common/Table';

/**
 * EvaluationList - Lista de evaluaciones
 * Sincronizado con EvaluacionResponse del backend
 */
export const EvaluationList = ({
  evaluations = [],
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

  const columns = [
    {
      key: 'idEvaluacion',
      label: 'ID',
      render: (value) => <span className="font-medium">#{value}</span>,
    },
    {
      key: 'nombreEvaluacion',
      label: 'Nombre',
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: 'tituloEvaluacion',
      label: 'Título',
      render: (value) => (
        <span className="text-sm">{value || <span className="text-gray-400">Sin título</span>}</span>
      ),
    },
    {
      key: 'areaEvaluacion',
      label: 'Área',
      render: (value) => (
        <span className="text-sm">
          {value ? value.replace(/_/g, ' ') : <span className="text-gray-400">Sin área</span>}
        </span>
      ),
    },
    {
      key: 'fechaEvaluacion',
      label: 'Fecha',
      render: (value) => <div className="text-sm">{formatDateTime(value)}</div>,
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
              onClick={() => onDelete(row.idEvaluacion)}
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
      data={evaluations}
      columns={columns}
      isLoading={isLoading}
      emptyMessage="No hay evaluaciones registradas"
    />
  );
};

export default EvaluationList;

