import { useState, useEffect } from 'react';
import { Alert } from '../common/Alert';
import { Spinner } from '../common/Loading';
import { questionService } from '../../services/questionService';

/**
 * AnswerForm - Formulario para crear/editar respuestas de evaluación
 * Sincronizado con backend EvaluacionRespuestaRequest/EvaluacionRespuestaResponse
 */
export const AnswerForm = ({
  answer,
  questionId,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    idEvaluacionPregunta: questionId || '',
    textoEvaluacionRespuesta: '',
    analizarSentimiento: true,
  });

  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!questionId) {
      loadQuestions();
    }
  }, [questionId]);

  useEffect(() => {
    if (answer) {
      setFormData({
        idEvaluacionPregunta: answer.idEvaluacionPregunta || '',
        textoEvaluacionRespuesta: answer.textoEvaluacionRespuesta || '',
        analizarSentimiento: true, // Always analyze on update
      });
    }
  }, [answer]);

  const loadQuestions = async () => {
    try {
      setLoadingQuestions(true);
      const response = await questionService.getAll({ size: 100 });
      setQuestions(response.content || response || []);
    } catch (err) {
      console.error('Error loading questions:', err);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
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

    if (!formData.idEvaluacionPregunta) {
      newErrors.idEvaluacionPregunta = 'Debe seleccionar una pregunta';
    }

    if (!formData.textoEvaluacionRespuesta.trim()) {
      newErrors.textoEvaluacionRespuesta = 'El texto de la respuesta es obligatorio';
    } else if (formData.textoEvaluacionRespuesta.length < 1) {
      newErrors.textoEvaluacionRespuesta = 'La respuesta debe tener al menos 1 carácter';
    } else if (formData.textoEvaluacionRespuesta.length > 5000) {
      newErrors.textoEvaluacionRespuesta = 'La respuesta no puede exceder 5000 caracteres';
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
      idEvaluacionPregunta: parseInt(formData.idEvaluacionPregunta),
      textoEvaluacionRespuesta: formData.textoEvaluacionRespuesta.trim(),
      analizarSentimiento: formData.analizarSentimiento,
    };

    onSubmit(submitData);
  };

  if (loadingQuestions) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Question Selection (only if not provided via props) */}
      {!questionId && (
        <div>
          <label htmlFor="idEvaluacionPregunta" className="block text-sm font-medium text-gray-700">
            Pregunta <span className="text-red-500">*</span>
          </label>
          <select
            id="idEvaluacionPregunta"
            name="idEvaluacionPregunta"
            value={formData.idEvaluacionPregunta}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.idEvaluacionPregunta ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Seleccione una pregunta</option>
            {questions.map((q) => (
              <option key={q.idEvaluacionPregunta} value={q.idEvaluacionPregunta}>
                {q.textoEvaluacionPregunta}
              </option>
            ))}
          </select>
          {errors.idEvaluacionPregunta && (
            <p className="mt-1 text-sm text-red-600">{errors.idEvaluacionPregunta}</p>
          )}
        </div>
      )}

      {/* Texto de la Respuesta */}
      <div>
        <label
          htmlFor="textoEvaluacionRespuesta"
          className="block text-sm font-medium text-gray-700"
        >
          Texto de la Respuesta <span className="text-red-500">*</span>
        </label>
        <textarea
          id="textoEvaluacionRespuesta"
          name="textoEvaluacionRespuesta"
          value={formData.textoEvaluacionRespuesta}
          onChange={handleChange}
          rows={6}
          maxLength={5000}
          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
            errors.textoEvaluacionRespuesta ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Me siento muy ansioso y no puedo dormir bien..."
        />
        <div className="mt-1 flex justify-between">
          {errors.textoEvaluacionRespuesta ? (
            <p className="text-sm text-red-600">{errors.textoEvaluacionRespuesta}</p>
          ) : (
            <p className="text-sm text-gray-500">
              Escriba la respuesta del paciente a la pregunta
            </p>
          )}
          <p className="text-sm text-gray-500">
            {formData.textoEvaluacionRespuesta.length}/5000
          </p>
        </div>
      </div>

      {/* Analizar Sentimiento */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="analizarSentimiento"
          name="analizarSentimiento"
          checked={formData.analizarSentimiento}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="analizarSentimiento" className="ml-2 block text-sm text-gray-700">
          Analizar sentimiento automáticamente con RNTN
        </label>
      </div>

      {/* Information Alert */}
      <Alert
        type="info"
        message="El análisis de sentimiento identificará emociones como ansiedad, tristeza, enojo, frustración o riesgo suicida. Si se detecta riesgo alto, se generará una alerta automática."
      />

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
          {isLoading ? 'Procesando...' : answer ? 'Actualizar' : 'Registrar'}
        </button>
      </div>
    </form>
  );
};

export default AnswerForm;

