import { useEffect, useState } from 'react';
import { Users, Calendar, ClipboardList, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import { Card } from '../components/common/Card';
import { QuickAccessMenu } from '../components/common/QuickAccessMenu';
import { RoleDebugPanel } from '../components/common/RoleDebugPanel';
import { useAuthStore } from '../store/authStore';
import evaluationService from '../services/evaluationService';
import { Alert } from '../components/common/Alert';

export const DashboardPage = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalConsultations: 0,
    totalEvaluations: 0,
    highRiskCases: 0,
  });
  const [highRiskData, setHighRiskData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load high-risk cases
      const highRisk = await evaluationService.getHighRiskRecent(7);
      setHighRiskData(highRisk);

      // Mock stats - in real app, these would come from API
      setStats({
        totalPatients: 150,
        totalConsultations: 45,
        totalEvaluations: 320,
        highRiskCases: highRisk.length,
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Pacientes Totales',
      value: stats.totalPatients,
      icon: Users,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
    },
    {
      title: 'Consultas Activas',
      value: stats.totalConsultations,
      icon: Calendar,
      color: 'text-success-600',
      bgColor: 'bg-success-50',
    },
    {
      title: 'Evaluaciones',
      value: stats.totalEvaluations,
      icon: ClipboardList,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Casos de Alto Riesgo',
      value: stats.highRiskCases,
      icon: AlertTriangle,
      color: 'text-danger-600',
      bgColor: 'bg-danger-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Bienvenido, {user?.nombre || user?.username}
        </h1>
        <p className="text-gray-600 mt-2">
          Sistema de Análisis de Sentimientos para Salud Mental
        </p>
      </div>

      {/* 🔍 Panel de Debug - TEMPORAL */}
      <RoleDebugPanel />

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <div className="flex items-center">
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Access Menu */}
      <QuickAccessMenu />

      {/* High-risk alerts */}
      {highRiskData.length > 0 && (
        <Card title="Alertas de Alto Riesgo (Últimos 7 días)">
          <Alert
            type="warning"
            title={`${highRiskData.length} casos de alto riesgo detectados`}
            message="Requieren atención inmediata"
          />
          <div className="mt-4 space-y-3">
            {highRiskData.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-danger-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-danger-600" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {item.pacienteNombre || 'Paciente'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Evaluación #{item.evaluacionId}
                    </p>
                  </div>
                </div>
                <span className="badge badge-suicidal">Alto Riesgo</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Actividad Reciente">
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Activity className="h-5 w-5 text-primary-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Nueva evaluación completada</p>
                <p className="text-xs text-gray-600">Hace 2 horas</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-success-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Reporte generado</p>
                <p className="text-xs text-gray-600">Hace 5 horas</p>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Estadísticas Rápidas">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Tasa de respuesta</span>
                <span className="font-medium">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-success-600 h-2 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Evaluaciones completadas</span>
                <span className="font-medium">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary-600 h-2 rounded-full" style={{ width: '92%' }} />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

