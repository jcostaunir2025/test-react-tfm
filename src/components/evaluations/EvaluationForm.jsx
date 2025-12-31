import { useState, useEffect } from 'react';

/**
 * EvaluationForm - Formulario para crear/editar evaluaciones
 * Sincronizado con backend EvaluacionRequest/EvaluacionResponse
 */
export const EvaluationForm = ({ evaluation, onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    nombreEvaluacion: '',
    tituloEvaluacion: '',
    areaEvaluacion: '',
  });

  const [errors, setErrors] = useState({});

  // Area options (puede extenderse según el backend)
  const areaOptions = [
    'SALUD_MENTAL',
    'PSICOLOGIA',
    'PSIQUIATRIA',
    'NEUROLOGIA',
    'TERAPIA',
    'OTRO',
  ];

  useEffect(() => {
    if (evaluation) {
      setFormData({
        nombreEvaluacion: evaluation.nombreEvaluacion || '',
        tituloEvaluacion: evaluation.tituloEvaluacion || '',
        areaEvaluacion: evaluation.areaEvaluacion || '',
      });
    }
  }, [evaluation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.nombreEvaluacion.trim()) {
      newErrors.nombreEvaluacion = 'El nombre de la evaluación es obligatorio';
    } else if (formData.nombreEvaluacion.length > 100) {
      newErrors.nombreEvaluacion = 'El nombre no puede exceder 100 caracteres';
    }

    if (formData.tituloEvaluacion && formData.tituloEvaluacion.length > 100) {
      newErrors.tituloEvaluacion = 'El título no puede exceder 100 caracteres';
    }

    if (formData.areaEvaluacion && formData.areaEvaluacion.length > 100) {
      newErrors.areaEvaluacion = 'El área no puede exceder 100 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Clean empty optional fields
    const submitData = {
      nombreEvaluacion: formData.nombreEvaluacion.trim(),
      tituloEvaluacion: formData.tituloEvaluacion.trim() || null,
      areaEvaluacion: formData.areaEvaluacion.trim() || null,
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nombre de la Evaluación */}
      <div>
        <label htmlFor="nombreEvaluacion" className="block text-sm font-medium text-gray-700">
          Nombre de la Evaluación <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="nombreEvaluacion"
          name="nombreEvaluacion"
          value={formData.nombreEvaluacion}
          onChange={handleChange}
          maxLength={100}
          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
            errors.nombreEvaluacion ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Evaluación de Sentimientos - Sesión 1"
        />
        {errors.nombreEvaluacion && (
          <p className="mt-1 text-sm text-red-600">{errors.nombreEvaluacion}</p>
        )}
      </div>

      {/* Título de la Evaluación */}
      <div>
        <label htmlFor="tituloEvaluacion" className="block text-sm font-medium text-gray-700">
          Título de la Evaluación
        </label>
        <input
          type="text"
          id="tituloEvaluacion"
          name="tituloEvaluacion"
          value={formData.tituloEvaluacion}
          onChange={handleChange}
          maxLength={100}
          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
            errors.tituloEvaluacion ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Evaluación Inicial de Riesgo"
        />
        {errors.tituloEvaluacion && (
          <p className="mt-1 text-sm text-red-600">{errors.tituloEvaluacion}</p>
        )}
      </div>

      {/* Área de Evaluación */}
      <div>
        <label htmlFor="areaEvaluacion" className="block text-sm font-medium text-gray-700">
          Área de Evaluación
        </label>
        <select
          id="areaEvaluacion"
          name="areaEvaluacion"
          value={formData.areaEvaluacion}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
            errors.areaEvaluacion ? 'border-red-300' : 'border-gray-300'
          }`}
        >
          <option value="">Seleccione un área</option>
          {areaOptions.map((area) => (
            <option key={area} value={area}>
              {area.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
        {errors.areaEvaluacion && (
          <p className="mt-1 text-sm text-red-600">{errors.areaEvaluacion}</p>
        )}
      </div>

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
          {isLoading ? 'Guardando...' : evaluation ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
};

