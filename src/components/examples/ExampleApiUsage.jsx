import { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import { patientService, sentimentService } from '../../services';
import { Card } from '../common/Card';
import { Spinner } from '../common/Loading';
import { Alert } from '../common/Alert';

/**
 * Ejemplo de componente usando useApi hook
 * Basado en CORS_FRONTEND_GUIDE.md
 */
const ExampleApiUsage = () => {
  const [pacientes, setPacientes] = useState([]);
  const [sentimentResult, setSentimentResult] = useState(null);
  const { callApi, loading, error } = useApi();

  // Cargar pacientes al montar el componente
  useEffect(() => {
    loadPacientes();
  }, []);

  const loadPacientes = async () => {
    try {
      const data = await callApi(patientService.getAll);
      setPacientes(data);
    } catch (err) {
      console.error('Error cargando pacientes:', err);
    }
  };

  const analyzeSentiment = async (text) => {
    try {
      const result = await callApi(sentimentService.predict, text);
      setSentimentResult(result);
    } catch (err) {
      console.error('Error analizando sentimiento:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Ejemplo de Uso de API</h2>

      {error && (
        <Alert type="error" message={error} />
      )}

      {/* Lista de Pacientes */}
      <Card>
        <h3 className="text-xl font-semibold mb-4">Pacientes</h3>
        {pacientes.length === 0 ? (
          <p className="text-gray-500">No hay pacientes disponibles</p>
        ) : (
          <ul className="space-y-2">
            {pacientes.map((p) => (
              <li key={p.idPaciente} className="p-2 border-b">
                {p.nombre} {p.apellido} - {p.email}
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* Análisis de Sentimientos */}
      <Card>
        <h3 className="text-xl font-semibold mb-4">Análisis de Sentimientos</h3>
        <div className="space-y-4">
          <button
            onClick={() => analyzeSentiment('Me siento muy feliz hoy')}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Analizar: "Me siento muy feliz hoy"
          </button>

          <button
            onClick={() => analyzeSentiment('Estoy muy triste y deprimido')}
            disabled={loading}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Analizar: "Estoy muy triste y deprimido"
          </button>

          {sentimentResult && (
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <p><strong>Texto:</strong> {sentimentResult.text}</p>
              <p><strong>Sentimiento:</strong> {sentimentResult.sentiment}</p>
              <p><strong>Puntuación:</strong> {sentimentResult.score}</p>
              <p><strong>Confianza:</strong> {(sentimentResult.confidence * 100).toFixed(2)}%</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ExampleApiUsage;

