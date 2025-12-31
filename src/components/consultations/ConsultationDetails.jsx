import { Modal } from '../common/Modal';

/**
 * ConsultationDetails - Modal para mostrar detalles completos de una consulta
 * Sincronizado con ConsultaResponse del backend
 */
export const ConsultationDetails = ({ consultation, isOpen, onClose }) => {
  if (!consultation) return null;

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

  const getStatusColor = (statusId) => {
    const colors = {
      1: 'yellow',
      2: 'blue',
      3: 'green',
      4: 'red',
      5: 'purple',
      6: 'gray',
    };
    return colors[statusId] || 'gray';
  };

  const statusColor = getStatusColor(consultation.estatusConsulta);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalles de la Consulta">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">Consulta #{consultation.idConsulta}</h3>
              <p className="text-sm text-gray-600">
                {formatDateTime(consultation.fechahoraConsulta)}
              </p>
            </div>
            <span
              className={`px-3 py-1 text-sm font-semibold rounded-full bg-${statusColor}-100 text-${statusColor}-800`}
            >
              {consultation.estatusConsultaNombre || 'ESTADO DESCONOCIDO'}
            </span>
          </div>
        </div>

        {/* Patient Information */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Información del Paciente</h4>
          <div className="bg-white border rounded-lg p-4 space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Nombre:</span>
                <p className="font-medium">{consultation.paciente?.nombrePaciente || '-'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Documento:</span>
                <p className="font-medium">{consultation.paciente?.docPaciente || '-'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Staff Information */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Personal Médico</h4>
          <div className="bg-white border rounded-lg p-4 space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Nombre:</span>
                <p className="font-medium">{consultation.personal?.nombrePersonal || '-'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Documento:</span>
                <p className="font-medium">{consultation.personal?.docPersonal || '-'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Evaluation Information */}
        {consultation.evaluacion && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Evaluación Asociada</h4>
            <div className="bg-white border rounded-lg p-4 space-y-2">
              <div>
                <span className="text-sm text-gray-500">Nombre:</span>
                <p className="font-medium">{consultation.evaluacion.nombreEvaluacion}</p>
              </div>
              {consultation.evaluacion.tituloEvaluacion && (
                <div>
                  <span className="text-sm text-gray-500">Título:</span>
                  <p className="font-medium">{consultation.evaluacion.tituloEvaluacion}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Consultation Dates */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Fechas</h4>
          <div className="bg-white border rounded-lg p-4 space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Inicio:</span>
                <p className="font-medium">{formatDateTime(consultation.fechahoraConsulta)}</p>
              </div>
              {consultation.fechafinConsulta && (
                <div>
                  <span className="text-sm text-gray-500">Fin:</span>
                  <p className="font-medium">{formatDateTime(consultation.fechafinConsulta)}</p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
              <div>
                <span className="text-sm text-gray-500">Creado:</span>
                <p className="text-sm">{formatDateTime(consultation.createdAt)}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Actualizado:</span>
                <p className="text-sm">{formatDateTime(consultation.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end">
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

export default ConsultationDetails;

