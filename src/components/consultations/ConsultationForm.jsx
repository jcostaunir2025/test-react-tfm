import { useState, useEffect } from 'react';
import { Alert } from '../common/Alert';
import { Spinner } from '../common/Loading';
import { patientService } from '../../services/patientService';
import { staffService } from '../../services/staffService';
import { evaluationService } from '../../services/evaluationService';

/**
 * ConsultationForm - Formulario para crear/editar consultas
 * Sincronizado con backend ConsultaRequest/ConsultaResponse
 */
export const ConsultationForm = ({ consultation, onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    idPaciente: '',
    idPersonal: '',
    idEvaluacion: '',
    fechahoraConsulta: '',
    estatusConsulta: 1, // Default: PENDIENTE
  });

  const [patients, setPatients] = useState([]);
  const [staff, setStaff] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);

  // Consultation status options (según backend)
  const statusOptions = [
    { id: 1, name: 'PENDIENTE' },
    { id: 2, name: 'EN_PROGRESO' },
    { id: 3, name: 'COMPLETADA' },
    { id: 4, name: 'CANCELADA' },
    { id: 5, name: 'REPROGRAMADA' },
    { id: 6, name: 'NO_ASISTIO' },
  ];

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (consultation) {
      setFormData({
        idPaciente: consultation.paciente?.idPaciente || '',
        idPersonal: consultation.personal?.idPersonal || '',
        idEvaluacion: consultation.idEvaluacion || '',
        fechahoraConsulta: consultation.fechahoraConsulta
          ? new Date(consultation.fechahoraConsulta).toISOString().slice(0, 16)
          : '',
        estatusConsulta: consultation.estatusConsulta || 1,
      });
    }
  }, [consultation]);

  const loadInitialData = async () => {
    try {
      setLoadingData(true);
      const [patientsData, staffData, evaluationsData] = await Promise.all([
        patientService.getAll({ size: 100 }),
        staffService.getAll({ size: 100 }),
        evaluationService.getAll({ size: 100 }),
      ]);

      setPatients(patientsData.content || patientsData || []);
      setStaff(staffData.content || staffData || []);
      setEvaluations(evaluationsData.content || evaluationsData || []);
    } catch (err) {
      setError('Error al cargar los datos: ' + err.message);
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'idPaciente' || name === 'idPersonal' || name === 'idEvaluacion' || name === 'estatusConsulta'
        ? value ? parseInt(value) : ''
        : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert fechahoraConsulta to ISO format
    const submitData = {
      ...formData,
      fechahoraConsulta: formData.fechahoraConsulta
        ? new Date(formData.fechahoraConsulta).toISOString()
        : null,
      idEvaluacion: formData.idEvaluacion || null, // Optional field
    };

    onSubmit(submitData);
  };

  if (loadingData) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {/* Patient Selection */}
      <div>
        <label htmlFor="idPaciente" className="block text-sm font-medium text-gray-700">
          Paciente <span className="text-red-500">*</span>
        </label>
        <select
          id="idPaciente"
          name="idPaciente"
          value={formData.idPaciente}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Seleccione un paciente</option>
          {patients.map((patient) => (
            <option key={patient.idPaciente} value={patient.idPaciente}>
              {patient.nombrePaciente} - {patient.docPaciente}
            </option>
          ))}
        </select>
      </div>

      {/* Staff Selection */}
      <div>
        <label htmlFor="idPersonal" className="block text-sm font-medium text-gray-700">
          Personal Médico <span className="text-red-500">*</span>
        </label>
        <select
          id="idPersonal"
          name="idPersonal"
          value={formData.idPersonal}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Seleccione personal médico</option>
          {staff.map((member) => (
            <option key={member.idPersonal} value={member.idPersonal}>
              {member.nombrePersonal} - {member.docPersonal}
            </option>
          ))}
        </select>
      </div>

      {/* Evaluation Selection (Optional) */}
      <div>
        <label htmlFor="idEvaluacion" className="block text-sm font-medium text-gray-700">
          Evaluación (Opcional)
        </label>
        <select
          id="idEvaluacion"
          name="idEvaluacion"
          value={formData.idEvaluacion}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Sin evaluación asociada</option>
          {evaluations.map((evaluation) => (
            <option key={evaluation.idEvaluacion} value={evaluation.idEvaluacion}>
              {evaluation.nombreEvaluacion}
            </option>
          ))}
        </select>
      </div>

      {/* Consultation Date/Time */}
      <div>
        <label htmlFor="fechahoraConsulta" className="block text-sm font-medium text-gray-700">
          Fecha y Hora <span className="text-red-500">*</span>
        </label>
        <input
          type="datetime-local"
          id="fechahoraConsulta"
          name="fechahoraConsulta"
          value={formData.fechahoraConsulta}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* Status (only when editing) */}
      {consultation && (
        <div>
          <label htmlFor="estatusConsulta" className="block text-sm font-medium text-gray-700">
            Estado
          </label>
          <select
            id="estatusConsulta"
            name="estatusConsulta"
            value={formData.estatusConsulta}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {statusOptions.map((status) => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Guardando...' : consultation ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
};

export default ConsultationForm;

