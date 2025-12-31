import { useState } from 'react';
import { Table } from '../common/Table';

/**
 * ConsultationList - Lista de consultas con acciones
 * Sincronizado con ConsultaResponse del backend
 */
export const ConsultationList = ({
  consultations = [],
  onEdit,
  onDelete,
  onViewDetails,
  onUpdateStatus,
  onFinalize,
  isLoading = false,
}) => {
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Status options
  const statusOptions = [
    { id: 1, name: 'PENDIENTE', color: 'yellow' },
    { id: 2, name: 'EN_PROGRESO', color: 'blue' },
    { id: 3, name: 'COMPLETADA', color: 'green' },
    { id: 4, name: 'CANCELADA', color: 'red' },
    { id: 5, name: 'REPROGRAMADA', color: 'purple' },
    { id: 6, name: 'NO_ASISTIO', color: 'gray' },
  ];

  const getStatusColor = (statusId) => {
    const status = statusOptions.find((s) => s.id === statusId);
    return status?.color || 'gray';
  };

  const getStatusName = (statusId) => {
    const status = statusOptions.find((s) => s.id === statusId);
    return status?.name || 'DESCONOCIDO';
  };

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

  const handleStatusUpdate = (consultation, newStatusId) => {
    if (onUpdateStatus) {
      onUpdateStatus(consultation.idConsulta, newStatusId);
    }
    setShowStatusModal(false);
    setSelectedConsultation(null);
  };

  const columns = [
    {
      key: 'idConsulta',
      label: 'ID',
      render: (value) => <span className="font-medium">#{value}</span>,
    },
    {
      key: 'paciente',
      label: 'Paciente',
      render: (value) => (
        <div>
          <div className="font-medium">{value?.nombrePaciente || '-'}</div>
          <div className="text-sm text-gray-500">{value?.docPaciente || '-'}</div>
        </div>
      ),
    },
    {
      key: 'personal',
      label: 'Personal',
      render: (value) => (
        <div>
          <div className="font-medium">{value?.nombrePersonal || '-'}</div>
          <div className="text-sm text-gray-500">{value?.docPersonal || '-'}</div>
        </div>
      ),
    },
    {
      key: 'evaluacion',
      label: 'Evaluación',
      render: (value) => (
        <div className="text-sm">
          {value?.nombreEvaluacion || <span className="text-gray-400">Sin evaluación</span>}
        </div>
      ),
    },
    {
      key: 'fechahoraConsulta',
      label: 'Fecha/Hora',
      render: (value) => <div className="text-sm">{formatDateTime(value)}</div>,
    },
    {
      key: 'estatusConsulta',
      label: 'Estado',
      render: (value, row) => {
        const color = getStatusColor(value);
        const name = row.estatusConsultaNombre || getStatusName(value);
        return (
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full bg-${color}-100 text-${color}-800`}
          >
            {name}
          </span>
        );
      },
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
          {onEdit && row.estatusConsulta !== 3 && (
            <button
              onClick={() => onEdit(row)}
              className="text-indigo-600 hover:text-indigo-900 text-sm"
              title="Editar"
            >
              Editar
            </button>
          )}
          {onUpdateStatus && row.estatusConsulta !== 3 && (
            <button
              onClick={() => {
                setSelectedConsultation(row);
                setShowStatusModal(true);
              }}
              className="text-yellow-600 hover:text-yellow-900 text-sm"
              title="Cambiar estado"
            >
              Estado
            </button>
          )}
          {onFinalize && row.estatusConsulta === 2 && (
            <button
              onClick={() => onFinalize(row.idConsulta)}
              className="text-green-600 hover:text-green-900 text-sm"
              title="Finalizar"
            >
              Finalizar
            </button>
          )}
          {onDelete && row.estatusConsulta === 1 && (
            <button
              onClick={() => onDelete(row.idConsulta)}
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
    <>
      <Table
        data={consultations}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No hay consultas registradas"
      />

      {/* Status Update Modal */}
      {showStatusModal && selectedConsultation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Actualizar Estado de Consulta</h3>
            <p className="text-sm text-gray-600 mb-4">
              Consulta #{selectedConsultation.idConsulta} -{' '}
              {selectedConsultation.paciente?.nombrePaciente}
            </p>
            <div className="space-y-2">
              {statusOptions.map((status) => (
                <button
                  key={status.id}
                  onClick={() => handleStatusUpdate(selectedConsultation, status.id)}
                  className={`w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 ${
                    selectedConsultation.estatusConsulta === status.id
                      ? 'bg-blue-50 border-2 border-blue-500'
                      : 'border border-gray-300'
                  }`}
                >
                  <span className={`font-medium text-${status.color}-700`}>{status.name}</span>
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedConsultation(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConsultationList;

