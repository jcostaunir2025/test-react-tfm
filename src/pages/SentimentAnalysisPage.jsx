import { useState, useEffect } from 'react';
import {
  Brain,
  Send,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  FileText,
  Activity
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Spinner } from '../components/common/Loading';
import { Alert } from '../components/common/Alert';
import { usePermissions } from '../hooks/usePermissions';
import { sentimentService } from '../services';

/**
 * SentimentAnalysisPage - Análisis de sentimientos con RNTN
 * Permite análisis individual, por lotes y visualización de estadísticas
 */
export const SentimentAnalysisPage = () => {
  const { hasPermission } = usePermissions();
  const canRead = hasPermission('analisis_sentimiento:read');

  // Estados principales
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Análisis individual
  const [singleText, setSingleText] = useState('');
  const [singleResult, setSingleResult] = useState(null);

  // Análisis por lotes
  const [batchTexts, setBatchTexts] = useState('');
  const [batchResults, setBatchResults] = useState(null);

  // Estadísticas
  const [labels, setLabels] = useState([]);
  const [modelStats, setModelStats] = useState(null);
  const [highRiskAlerts, setHighRiskAlerts] = useState([]);

  // Tab activo
  const [activeTab, setActiveTab] = useState('single');

  useEffect(() => {
    if (canRead) {
      loadInitialData();
    }
  }, [canRead]);

  const loadInitialData = async () => {
    try {
      const [labelsData, statsData, alertsData] = await Promise.all([
        sentimentService.getLabels().catch(() => []),
        sentimentService.getModelStats().catch(() => null),
        sentimentService.getHighRiskAlerts(7).catch(() => [])
      ]);
      
      setLabels(labelsData || []);
      setModelStats(statsData || null);
      setHighRiskAlerts(alertsData || []);
    } catch (err) {
      console.error('Error al cargar datos iniciales:', err);
    }
  };

  const handleSinglePredict = async (e) => {
    e.preventDefault();
    
    if (!singleText.trim()) {
      setError('Por favor ingrese un texto para analizar');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSingleResult(null);
      
      const result = await sentimentService.predict(singleText);
      setSingleResult(result);
      setSuccess('Análisis completado exitosamente');
    } catch (err) {
      setError('Error al analizar el texto: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBatchPredict = async (e) => {
    e.preventDefault();
    
    if (!batchTexts.trim()) {
      setError('Por favor ingrese textos para analizar');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setBatchResults(null);
      
      const textsArray = batchTexts.split('\n').filter(t => t.trim());
      const result = await sentimentService.batchPredictAggregate(textsArray);
      setBatchResults(result);
      setSuccess(`${textsArray.length} textos analizados exitosamente`);
    } catch (err) {
      setError('Error al analizar los textos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (label) => {
    const colors = {
      'ANXIETY': 'yellow',
      'SUICIDAL': 'red',
      'ANGER': 'orange',
      'SADNESS': 'blue',
      'FRUSTRATION': 'purple',
    };
    return colors[label] || 'gray';
  };

  const getSentimentLabel = (label) => {
    const labels = {
      'ANXIETY': 'Ansiedad',
      'SUICIDAL': 'Riesgo Suicida',
      'ANGER': 'Enojo',
      'SADNESS': 'Tristeza',
      'FRUSTRATION': 'Frustración',
    };
    return labels[label] || label;
  };

  if (!canRead) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message="No tiene permisos para acceder a esta página" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Brain className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Análisis de Sentimientos</h1>
        </div>
        <p className="text-gray-600">
          Análisis de emociones y sentimientos usando el modelo RNTN
        </p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      {highRiskAlerts.length > 0 && (
        <Card className="mb-6 bg-red-50 border-red-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-red-900">Alertas de Alto Riesgo</h3>
              <p className="text-sm text-red-700 mt-1">
                Se detectaron <strong>{highRiskAlerts.length}</strong> alertas de riesgo suicida en los últimos 7 días
              </p>
            </div>
          </div>
        </Card>
      )}

      <Card className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('single')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'single'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Análisis Individual
              </div>
            </button>
            <button
              onClick={() => setActiveTab('batch')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'batch'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Análisis por Lotes
              </div>
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'stats'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Estadísticas
              </div>
            </button>
          </nav>
        </div>
      </Card>

      {activeTab === 'single' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold mb-4">Texto a Analizar</h3>
            <form onSubmit={handleSinglePredict} className="space-y-4">
              <textarea
                value={singleText}
                onChange={(e) => setSingleText(e.target.value)}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Ingrese el texto a analizar..."
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Spinner className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                {loading ? 'Analizando...' : 'Analizar'}
              </button>
            </form>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-4">Resultado</h3>
            {singleResult ? (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-2xl font-bold">{getSentimentLabel(singleResult.predictedLabel)}</span>
                  {singleResult.predictedLabel === 'SUICIDAL' && (
                    <div className="mt-3 bg-red-50 border border-red-200 rounded p-3">
                      <AlertTriangle className="h-5 w-5 text-red-600 inline mr-2" />
                      <span className="text-red-900 font-semibold">Alerta de Alto Riesgo</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Los resultados aparecerán aquí</p>
              </div>
            )}
          </Card>
        </div>
      )}

      {activeTab === 'batch' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold mb-4">Textos (uno por línea)</h3>
            <form onSubmit={handleBatchPredict} className="space-y-4">
              <textarea
                value={batchTexts}
                onChange={(e) => setBatchTexts(e.target.value)}
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                placeholder="Ingrese los textos, uno por línea..."
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {loading ? 'Analizando...' : 'Analizar Lote'}
              </button>
            </form>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-4">Resultados Agregados</h3>
            {batchResults ? (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-2xl font-bold">{batchResults.totalAnalyzed}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Los resultados aparecerán aquí</p>
              </div>
            )}
          </Card>
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Estadísticas del Modelo</h3>
              <button onClick={loadInitialData} className="text-gray-600 hover:text-gray-900">
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
            {modelStats ? (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Precisión</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {modelStats.accuracy ? `${(modelStats.accuracy * 100).toFixed(1)}%` : 'N/A'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No hay estadísticas disponibles</p>
              </div>
            )}
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-4">Sentimientos Detectables</h3>
            {labels.length > 0 ? (
              <div className="space-y-3">
                {labels.map((label) => (
                  <div key={label} className={`p-3 rounded-lg bg-${getSentimentColor(label)}-50`}>
                    <span className="font-medium">{getSentimentLabel(label)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">No hay labels disponibles</p>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default SentimentAnalysisPage;

