import { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Alert } from '../components/common/Alert';
import { Spinner } from '../components/common/Loading';
import { Modal } from '../components/common/Modal';
import { ConsultationForm, ConsultationList, ConsultationDetails } from '../components/consultations';
import { consultationService } from '../services/consultationService';
import { usePermissions } from '../hooks/usePermissions';

/**
 * ConsultationsPage - Página completa de gestión de consultas médicas
 * Sincronizada con backend ConsultaController
 */
export const ConsultationsPage = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(20);

  const { hasPermission } = usePermissions();
  const canCreate = hasPermission('consulta:create');
  const canUpdate = hasPermission('consulta:update');
  const canDelete = hasPermission('consulta:delete');
  const canRead = hasPermission('consulta:read');

  useEffect(() => {
    if (canRead) {
      loadConsultations();
    }
  }, [currentPage, canRead]);

  const loadConsultations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await consultationService.getAll({
        page: currentPage,
        size: pageSize,
        sort: 'fechahoraConsulta,desc',
      });

      if (response.content) {
        setConsultations(response.content);
        setTotalPages(response.totalPages);
      } else {
        setConsultations(response);
      }
    } catch (err) {
      setError('Error al cargar las consultas: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedConsultation(null);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEdit = (consultation) => {
    setSelectedConsultation(consultation);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleViewDetails = (consultation) => {
    setSelectedConsultation(consultation);
    setShowDetails(true);
  };

  const handleSubmit = async (formData) => {
    try {
      setFormLoading(true);
      setError(null);

      if (isEditing && selectedConsultation) {
        await consultationService.update(selectedConsultation.idConsulta, formData);
        setSuccess('Consulta actualizada exitosamente');
      } else {
        await consultationService.create(formData);
        setSuccess('Consulta creada exitosamente');
      }

      setShowForm(false);
      setSelectedConsultation(null);
      await loadConsultations();
    } catch (err) {
      setError('Error al guardar la consulta: ' + err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateStatus = async (consultationId, newStatus) => {
    try {
      setError(null);
      await consultationService.updateStatus(consultationId, newStatus);
      setSuccess('Estado actualizado exitosamente');
      await loadConsultations();
    } catch (err) {
      setError('Error al actualizar el estado: ' + err.message);
    }
  };

  const handleFinalize = async (consultationId) => {
    if (!window.confirm('¿Está seguro de finalizar esta consulta?')) {
      return;
    }

    try {
      setError(null);
      await consultationService.finalize(consultationId);
      setSuccess('Consulta finalizada exitosamente');
      await loadConsultations();
    } catch (err) {
      setError('Error al finalizar la consulta: ' + err.message);
    }
  };

  const handleDelete = async (consultationId) => {
    if (!window.confirm('¿Está seguro de eliminar esta consulta?')) {
      return;
    }

    try {
      setError(null);
      await consultationService.delete(consultationId);
      setSuccess('Consulta eliminada exitosamente');
      await loadConsultations();
    } catch (err) {
      setError('Error al eliminar la consulta: ' + err.message);
    }
  };

  if (!canRead) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message="No tiene permisos para ver las consultas" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Consultas Médicas</h1>
        <p className="mt-2 text-gray-600">
          Administre las consultas médicas, estados y evaluaciones asociadas
        </p>
      </div>

      {/* Alerts */}
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      {/* Actions */}
      <Card className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Consultas</h2>
            <p className="text-sm text-gray-500">Total: {consultations.length}</p>
          </div>
          {canCreate && (
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              + Nueva Consulta
            </button>
          )}
        </div>
      </Card>

      {/* Consultations List */}
      <Card>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner />
          </div>
        ) : (
          <>
            <ConsultationList
              consultations={consultations}
              onEdit={canUpdate ? handleEdit : undefined}
              onDelete={canDelete ? handleDelete : undefined}
              onViewDetails={handleViewDetails}
              onUpdateStatus={canUpdate ? handleUpdateStatus : undefined}
              onFinalize={canUpdate ? handleFinalize : undefined}
              isLoading={loading}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex justify-center space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  className="px-3 py-1 border rounded-md disabled:opacity-50"
                >
                  Anterior
                </button>
                <span className="px-3 py-1">
                  Página {currentPage + 1} de {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage >= totalPages - 1}
                  className="px-3 py-1 border rounded-md disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setSelectedConsultation(null);
        }}
        title={isEditing ? 'Editar Consulta' : 'Nueva Consulta'}
      >
        <ConsultationForm
          consultation={selectedConsultation}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setSelectedConsultation(null);
          }}
          isLoading={formLoading}
        />
      </Modal>

      {/* Details Modal */}
      <ConsultationDetails
        consultation={selectedConsultation}
        isOpen={showDetails}
        onClose={() => {
          setShowDetails(false);
          setSelectedConsultation(null);
        }}
      />
    </div>
  );
};

export default ConsultationsPage;

