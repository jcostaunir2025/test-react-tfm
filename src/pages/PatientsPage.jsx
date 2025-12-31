import { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Filter,
  RefreshCw
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Spinner } from '../components/common/Loading';
import { Alert } from '../components/common/Alert';
import { Modal } from '../components/common/Modal';
import { usePermissions } from '../hooks/usePermissions';
import { patientService } from '../services';

// Helper para formatear género
const formatGender = (gender) => {
  const genderMap = {
    'MASCULINO': 'Masculino',
    'FEMENINO': 'Femenino',
    'OTRO': 'Otro',
    'NO_ESPECIFICA': 'No especifica'
  };
  return genderMap[gender] || gender;
};

export const PatientsPage = () => {
  const { canRead, canCreate, canUpdate, canDelete } = usePermissions('paciente');

  // Estados
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Formulario - Para inputs separados en el UI
  const [formData, setFormData] = useState({
    nombre: '',        // Para input de nombre (UI)
    apellido: '',      // Para input de apellido (UI)
    docPaciente: '',
    fechaPaciente: '',
    generoPaciente: '',
    direccionPaciente: '',
    telefonoPaciente: '',
    emailPaciente: '',
    contactoPaciente: '',
    telefonoContactoPaciente: ''
  });

  // Cargar pacientes al montar el componente
  useEffect(() => {
    if (canRead) {
      loadPatients();
    }
  }, [canRead, currentPage, searchTerm, filterStatus]);

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        size: 10,
        sort: 'idPaciente,desc'
      };

      if (searchTerm) {
        params.search = searchTerm;
      }

      if (filterStatus) {
        params.estatus = filterStatus;
      }

      const response = await patientService.getAll(params);

      // Manejar respuesta paginada
      if (response.content) {
        setPatients(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      } else {
        // Si no es paginado, manejar como array
        setPatients(Array.isArray(response) ? response : []);
      }
    } catch (err) {
      console.error('Error loading patients:', err);
      setError(err.message || 'Error al cargar pacientes');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    loadPatients();
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Concatenar nombre y apellido con espacio
      const nombreCompleto = `${formData.nombre.trim()} ${formData.apellido.trim()}`.trim();

      // Preparar datos para el backend (sin apellido separado)
      const dataToSend = {
        nombrePaciente: nombreCompleto,
        docPaciente: formData.docPaciente,
        fechaPaciente: formData.fechaPaciente,
        generoPaciente: formData.generoPaciente,
        direccionPaciente: formData.direccionPaciente,
        telefonoPaciente: formData.telefonoPaciente,
        emailPaciente: formData.emailPaciente,
        contactoPaciente: formData.contactoPaciente,
        telefonoContactoPaciente: formData.telefonoContactoPaciente,
        estatusPaciente: 'ACTIVO'  // Siempre ACTIVO al crear
      };

      await patientService.create(dataToSend);
      setShowCreateModal(false);
      resetForm();
      loadPatients();
      setError(null);
    } catch (err) {
      console.error('Error creating patient:', err);
      setError(err.message || 'Error al crear paciente');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Concatenar nombre y apellido con espacio
      const nombreCompleto = `${formData.nombre.trim()} ${formData.apellido.trim()}`.trim();

      // Preparar datos para el backend (sin apellido separado)
      const dataToSend = {
        nombrePaciente: nombreCompleto,
        docPaciente: formData.docPaciente,
        fechaPaciente: formData.fechaPaciente,
        generoPaciente: formData.generoPaciente,
        direccionPaciente: formData.direccionPaciente,
        telefonoPaciente: formData.telefonoPaciente,
        emailPaciente: formData.emailPaciente,
        contactoPaciente: formData.contactoPaciente,
        telefonoContactoPaciente: formData.telefonoContactoPaciente,
        estatusPaciente: 'ACTIVO'  // Siempre ACTIVO al editar
      };

      await patientService.update(selectedPatient.idPaciente, dataToSend);
      setShowEditModal(false);
      resetForm();
      setSelectedPatient(null);
      loadPatients();
      setError(null);
    } catch (err) {
      console.error('Error updating patient:', err);
      setError(err.message || 'Error al actualizar paciente');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);

      // Preparar datos para cambiar estado a INACTIVO (soft delete)
      const dataToSend = {
        nombrePaciente: selectedPatient.nombrePaciente,
        docPaciente: selectedPatient.docPaciente,
        fechaPaciente: selectedPatient.fechaPaciente,
        generoPaciente: selectedPatient.generoPaciente,
        direccionPaciente: selectedPatient.direccionPaciente,
        telefonoPaciente: selectedPatient.telefonoPaciente,
        emailPaciente: selectedPatient.emailPaciente,
        contactoPaciente: selectedPatient.contactoPaciente,
        telefonoContactoPaciente: selectedPatient.telefonoContactoPaciente,
        estatusPaciente: 'INACTIVO'  // Cambiar a INACTIVO al "eliminar"
      };

      // Usar update en lugar de delete para cambiar el estado
      await patientService.update(selectedPatient.idPaciente, dataToSend);

      setShowDeleteModal(false);
      setSelectedPatient(null);
      loadPatients();
      setError(null);
    } catch (err) {
      console.error('Error deleting patient:', err);
      setError(err.message || 'Error al eliminar paciente');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openEditModal = (patient) => {
    setSelectedPatient(patient);

    // Hacer split del nombre completo por el primer espacio
    const nombreCompleto = patient.nombrePaciente || '';
    const primerEspacio = nombreCompleto.indexOf(' ');
    let nombre = '';
    let apellido = '';

    if (primerEspacio > 0) {
      nombre = nombreCompleto.substring(0, primerEspacio);
      apellido = nombreCompleto.substring(primerEspacio + 1);
    } else {
      nombre = nombreCompleto;
    }

    setFormData({
      nombre: nombre,
      apellido: apellido,
      docPaciente: patient.docPaciente || '',
      fechaPaciente: patient.fechaPaciente || '',
      generoPaciente: patient.generoPaciente || '',
      direccionPaciente: patient.direccionPaciente || '',
      telefonoPaciente: patient.telefonoPaciente || '',
      emailPaciente: patient.emailPaciente || '',
      contactoPaciente: patient.contactoPaciente || '',
      telefonoContactoPaciente: patient.telefonoContactoPaciente || ''
    });
    setShowEditModal(true);
  };

  const openViewModal = (patient) => {
    setSelectedPatient(patient);
    setShowViewModal(true);
  };

  const openDeleteModal = (patient) => {
    setSelectedPatient(patient);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      apellido: '',
      docPaciente: '',
      fechaPaciente: '',
      generoPaciente: '',
      direccionPaciente: '',
      telefonoPaciente: '',
      emailPaciente: '',
      contactoPaciente: '',
      telefonoContactoPaciente: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Función para manejar inputs numéricos
  const handleNumericInput = (e, fieldName) => {
    const value = e.target.value.replace(/\D/g, '');
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  // Si no tiene permiso de lectura
  if (!canRead) {
    return (
      <div className="space-y-6">
        <Alert
          type="danger"
          title="Acceso Denegado"
          message="No tienes permisos para ver pacientes"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="h-8 w-8 text-primary-600" />
            Gestión de Pacientes
          </h1>
          <p className="text-gray-600 mt-2">
            Administra la información de los pacientes del sistema
          </p>
        </div>

        {canCreate && (
          <button
            onClick={openCreateModal}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Nuevo Paciente
          </button>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <Alert
          type="danger"
          title="Error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      {/* Filtros y búsqueda */}
      <Card>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Búsqueda */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar paciente
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre, apellido o documento..."
                  className="input pl-10"
                />
              </div>
            </div>

            {/* Filtro de estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setCurrentPage(0);
                  }}
                  className="input pl-10"
                >
                  <option value="">Todos</option>
                  <option value="ACTIVO">Activo</option>
                  <option value="INACTIVO">Inactivo</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary flex items-center gap-2">
              <Search className="h-4 w-4" />
              Buscar
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('');
                setCurrentPage(0);
              }}
              className="btn btn-secondary flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Limpiar
            </button>
          </div>
        </form>
      </Card>

      {/* Tabla de pacientes */}
      <Card>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" />
          </div>
        ) : patients.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay pacientes</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterStatus
                ? 'No se encontraron pacientes con los criterios de búsqueda'
                : 'Comienza creando un nuevo paciente'}
            </p>
            {canCreate && !searchTerm && !filterStatus && (
              <button
                onClick={openCreateModal}
                className="mt-4 btn btn-primary inline-flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Nuevo Paciente
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paciente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Documento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {patients.map((patient) => (
                    <tr key={patient.idPaciente} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {patient.nombrePaciente}
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatGender(patient.generoPaciente)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{patient.docPaciente}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{patient.telefonoPaciente}</div>
                        <div className="text-sm text-gray-500">{patient.emailPaciente}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          patient.estatusPaciente === 'ACTIVO'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {patient.estatusPaciente === 'ACTIVO' ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openViewModal(patient)}
                            className="text-primary-600 hover:text-primary-900"
                            title="Ver detalles"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          {canUpdate && (
                            <button
                              onClick={() => openEditModal(patient)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Editar"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => openDeleteModal(patient)}
                              className="text-red-600 hover:text-red-900"
                              title="Eliminar"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                    disabled={currentPage === 0}
                    className="btn btn-secondary"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                    disabled={currentPage === totalPages - 1}
                    className="btn btn-secondary"
                  >
                    Siguiente
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Mostrando <span className="font-medium">{currentPage * 10 + 1}</span> a{' '}
                      <span className="font-medium">
                        {Math.min((currentPage + 1) * 10, totalElements)}
                      </span>{' '}
                      de <span className="font-medium">{totalElements}</span> resultados
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                        disabled={currentPage === 0}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Anterior
                      </button>
                      {[...Array(Math.min(totalPages, 5))].map((_, idx) => {
                        const pageNum = currentPage < 3 ? idx : currentPage - 2 + idx;
                        if (pageNum >= totalPages) return null;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === pageNum
                                ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum + 1}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                        disabled={currentPage === totalPages - 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Siguiente
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Modal Crear - Continua en siguiente parte... */}
      <PatientFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreate}
        formData={formData}
        handleInputChange={handleInputChange}
        handleNumericInput={handleNumericInput}
        loading={loading}
        title="Nuevo Paciente"
        submitLabel="Crear Paciente"
      />

      {/* Modal Editar */}
      <PatientFormModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleUpdate}
        formData={formData}
        handleInputChange={handleInputChange}
        handleNumericInput={handleNumericInput}
        loading={loading}
        title="Editar Paciente"
        submitLabel="Actualizar Paciente"
      />

      {/* Modal Ver Detalles */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Detalles del Paciente"
      >
        {selectedPatient && (
          <PatientDetails
            patient={selectedPatient}
            onClose={() => setShowViewModal(false)}
            onEdit={() => {
              setShowViewModal(false);
              openEditModal(selectedPatient);
            }}
            canUpdate={canUpdate}
          />
        )}
      </Modal>

      {/* Modal Eliminar */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Marcar Paciente como Inactivo"
      >
        {selectedPatient && (
          <DeleteConfirmation
            patient={selectedPatient}
            onConfirm={handleDelete}
            onCancel={() => setShowDeleteModal(false)}
            loading={loading}
          />
        )}
      </Modal>
    </div>
  );
};

// Componente auxiliar: Formulario de Paciente
const PatientFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  handleInputChange,
  handleNumericInput,
  loading,
  title,
  submitLabel,
  showStatus = false
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title}>
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre *
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            required
            className="input"
            placeholder="Ej: Juan"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Apellido *
          </label>
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleInputChange}
            required
            className="input"
            placeholder="Ej: Pérez"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Documento *
          </label>
          <input
            type="number"
            name="docPaciente"
            value={formData.docPaciente}
            onChange={(e) => handleNumericInput(e, 'docPaciente')}
            required
            className="input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de Nacimiento *
          </label>
          <input
            type="date"
            name="fechaPaciente"
            value={formData.fechaPaciente}
            onChange={handleInputChange}
            required
            className="input"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Género *
        </label>
        <select
          name="generoPaciente"
          value={formData.generoPaciente}
          onChange={handleInputChange}
          required
          className="input"
        >
          <option value="">Seleccionar...</option>
          <option value="MASCULINO">Masculino</option>
          <option value="FEMENINO">Femenino</option>
          <option value="OTRO">Otro</option>
          <option value="NO_ESPECIFICA">No especifica</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Dirección
        </label>
        <input
          type="text"
          name="direccionPaciente"
          value={formData.direccionPaciente}
          onChange={handleInputChange}
          className="input"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono *
          </label>
          <input
            type="tel"
            name="telefonoPaciente"
            value={formData.telefonoPaciente}
            onChange={(e) => handleNumericInput(e, 'telefonoPaciente')}
            required
            className="input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="emailPaciente"
            value={formData.emailPaciente}
            onChange={handleInputChange}
            className="input"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contacto de Emergencia
          </label>
          <input
            type="text"
            name="contactoPaciente"
            value={formData.contactoPaciente}
            onChange={handleInputChange}
            className="input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono de Emergencia
          </label>
          <input
            type="tel"
            name="telefonoContactoPaciente"
            value={formData.telefonoContactoPaciente}
            onChange={(e) => handleNumericInput(e, 'telefonoContactoPaciente')}
            className="input"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-secondary"
        >
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Guardando...' : submitLabel}
        </button>
      </div>
    </form>
  </Modal>
);

// Componente auxiliar: Detalles del Paciente
const PatientDetails = ({ patient, onClose, onEdit, canUpdate }) => (
  <div className="space-y-4">
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Información Personal
      </h3>
      <dl className="grid grid-cols-2 gap-4">
        <div>
          <dt className="text-sm font-medium text-gray-500">Nombre Completo</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {patient.nombrePaciente}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Documento</dt>
          <dd className="mt-1 text-sm text-gray-900">{patient.docPaciente}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Fecha de Nacimiento</dt>
          <dd className="mt-1 text-sm text-gray-900">{patient.fechaPaciente}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Género</dt>
          <dd className="mt-1 text-sm text-gray-900">{formatGender(patient.generoPaciente)}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-sm font-medium text-gray-500">Dirección</dt>
          <dd className="mt-1 text-sm text-gray-900">{patient.direccionPaciente || 'No especificada'}</dd>
        </div>
      </dl>
    </div>

    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Información de Contacto
      </h3>
      <dl className="grid grid-cols-2 gap-4">
        <div>
          <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
          <dd className="mt-1 text-sm text-gray-900">{patient.telefonoPaciente}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Email</dt>
          <dd className="mt-1 text-sm text-gray-900">{patient.emailPaciente || 'No especificado'}</dd>
        </div>
      </dl>
    </div>

    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Contacto de Emergencia
      </h3>
      <dl className="grid grid-cols-2 gap-4">
        <div>
          <dt className="text-sm font-medium text-gray-500">Nombre</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {patient.contactoPaciente || 'No especificado'}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {patient.telefonoContactoPaciente || 'No especificado'}
          </dd>
        </div>
      </dl>
    </div>

    <div className="bg-gray-50 p-4 rounded-lg">
      <dl className="grid grid-cols-2 gap-4">
        <div>
          <dt className="text-sm font-medium text-gray-500">Estado</dt>
          <dd className="mt-1">
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              patient.estatusPaciente === 'ACTIVO'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {patient.estatusPaciente === 'ACTIVO' ? 'Activo' : 'Inactivo'}
            </span>
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">ID Paciente</dt>
          <dd className="mt-1 text-sm text-gray-900">{patient.idPaciente}</dd>
        </div>
      </dl>
    </div>

    <div className="flex justify-end gap-3 pt-4">
      <button
        onClick={onClose}
        className="btn btn-secondary"
      >
        Cerrar
      </button>
      {canUpdate && (
        <button
          onClick={onEdit}
          className="btn btn-primary"
        >
          Editar
        </button>
      )}
    </div>
  </div>
);

// Componente auxiliar: Confirmación de Eliminación
const DeleteConfirmation = ({ patient, onConfirm, onCancel, loading }) => (
  <div>
    <div className="mb-4">
      <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
        <Trash2 className="w-6 h-6 text-red-600" />
      </div>
      <div className="mt-3 text-center">
        <h3 className="text-lg font-medium text-gray-900">
          ¿Estás seguro?
        </h3>
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            Estás a punto de marcar como inactivo al paciente:
          </p>
          <p className="text-sm font-semibold text-gray-900 mt-1">
            {patient.nombrePaciente}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            El paciente cambiará su estado a <span className="font-semibold">INACTIVO</span> y se puede reactivar posteriormente.
          </p>
        </div>
      </div>
    </div>
    <div className="flex justify-end gap-3">
      <button
        onClick={onCancel}
        className="btn btn-secondary"
      >
        Cancelar
      </button>
      <button
        onClick={onConfirm}
        className="btn bg-red-600 hover:bg-red-700 text-white"
        disabled={loading}
      >
        {loading ? 'Procesando...' : 'Marcar como Inactivo'}
      </button>
    </div>
  </div>
);

