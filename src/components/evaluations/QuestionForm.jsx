import { useState, useEffect } from 'react';
import { Alert } from '../common/Alert';
import { Spinner } from '../common/Loading';
import { questionService } from '../../services/questionService';

/**
 * QuestionForm - Formulario para crear/editar preguntas de evaluación
 * Sincronizado con backend EvaluacionPreguntaRequest/EvaluacionPreguntaResponse
 */
export const QuestionForm = ({ question, onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    textoEvaluacionPregunta: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (question) {
      setFormData({
        textoEvaluacionPregunta: question.textoEvaluacionPregunta || '',
      });
    }
  }, [question]);

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

    if (!formData.textoEvaluacionPregunta.trim()) {
      newErrors.textoEvaluacionPregunta = 'El texto de la pregunta es obligatorio';
    } else if (formData.textoEvaluacionPregunta.length < 5) {
      newErrors.textoEvaluacionPregunta = 'La pregunta debe tener al menos 5 caracteres';
    } else if (formData.textoEvaluacionPregunta.length > 1000) {
      newErrors.textoEvaluacionPregunta = 'La pregunta no puede exceder 1000 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const submitData = {
      textoEvaluacionPregunta: formData.textoEvaluacionPregunta.trim(),
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Texto de la Pregunta */}
      <div>
        <label
          htmlFor="textoEvaluacionPregunta"
          className="block text-sm font-medium text-gray-700"
        >
          Texto de la Pregunta <span className="text-red-500">*</span>
        </label>
        <textarea
          id="textoEvaluacionPregunta"
          name="textoEvaluacionPregunta"
          value={formData.textoEvaluacionPregunta}
          onChange={handleChange}
          rows={4}
          maxLength={1000}
          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
            errors.textoEvaluacionPregunta ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="¿Cómo se siente hoy?"
        />
        <div className="mt-1 flex justify-between">
          {errors.textoEvaluacionPregunta ? (
            <p className="text-sm text-red-600">{errors.textoEvaluacionPregunta}</p>
          ) : (
            <p className="text-sm text-gray-500">Mínimo 5 caracteres</p>
          )}
          <p className="text-sm text-gray-500">
            {formData.textoEvaluacionPregunta.length}/1000
          </p>
        </div>
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
          {isLoading ? 'Guardando...' : question ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
};

export default QuestionForm;

