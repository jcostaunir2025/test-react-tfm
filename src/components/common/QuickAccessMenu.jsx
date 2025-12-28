import { useNavigate } from 'react-router-dom';
import {
  Users,
  Calendar,
  ClipboardList,
  FileText,
  AlertTriangle,
  Brain,
  UserCog,
  TrendingUp,
  Activity
} from 'lucide-react';
import { hasAnyRole } from '../../utils/roleUtils';

export const QuickAccessMenu = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      name: 'Nuevo Paciente',
      description: 'Registrar nuevo paciente',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700',
      route: '/patients',
      roles: ['ADMIN', 'DOCTOR', 'ENFERMERO', 'RECEPCIONISTA']
    },
    {
      name: 'Nueva Consulta',
      description: 'Agendar consulta',
      icon: Calendar,
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700',
      route: '/consultations',
      roles: ['ADMIN', 'DOCTOR', 'ENFERMERO']
    },
    {
      name: 'Nueva Evaluación',
      description: 'Crear evaluación',
      icon: ClipboardList,
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700',
      route: '/evaluations',
      roles: ['ADMIN', 'DOCTOR', 'ENFERMERO', 'ANALISTA']
    },
    {
      name: 'Análisis IA',
      description: 'Análisis de sentimientos',
      icon: Brain,
      color: 'from-pink-500 to-pink-600',
      hoverColor: 'hover:from-pink-600 hover:to-pink-700',
      route: '/sentiment',
      roles: ['ADMIN', 'DOCTOR', 'ANALISTA']
    },
    {
      name: 'Alto Riesgo',
      description: 'Monitoreo crítico',
      icon: AlertTriangle,
      color: 'from-red-500 to-red-600',
      hoverColor: 'hover:from-red-600 hover:to-red-700',
      route: '/high-risk',
      roles: ['ADMIN', 'DOCTOR', 'ENFERMERO']
    },
    {
      name: 'Generar Reporte',
      description: 'Crear nuevo reporte',
      icon: FileText,
      color: 'from-indigo-500 to-indigo-600',
      hoverColor: 'hover:from-indigo-600 hover:to-indigo-700',
      route: '/reports',
      roles: ['ADMIN', 'DOCTOR', 'ANALISTA', 'AUDITOR']
    },
    {
      name: 'Gestión Usuarios',
      description: 'Administrar usuarios',
      icon: UserCog,
      color: 'from-gray-600 to-gray-700',
      hoverColor: 'hover:from-gray-700 hover:to-gray-800',
      route: '/users',
      roles: ['ADMIN']
    },
    {
      name: 'Estadísticas',
      description: 'Ver estadísticas',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      hoverColor: 'hover:from-orange-600 hover:to-orange-700',
      route: '/reports',
      roles: ['ADMIN', 'DOCTOR', 'ANALISTA']
    }
  ];

  const filteredActions = quickActions.filter(
    action => !action.roles || hasAnyRole(action.roles)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Acceso Rápido</h2>
        <Activity className="h-5 w-5 text-primary-600" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredActions.map((action) => (
          <button
            key={action.name}
            onClick={() => navigate(action.route)}
            className={`
              group relative overflow-hidden
              bg-gradient-to-br ${action.color}
              ${action.hoverColor}
              rounded-xl p-5
              text-white text-left
              transition-all duration-300
              hover:shadow-xl hover:scale-105
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
            `}
          >
            {/* Icon */}
            <div className="mb-3">
              <action.icon className="h-8 w-8 transform group-hover:scale-110 transition-transform" />
            </div>

            {/* Text */}
            <div>
              <h3 className="font-semibold text-sm mb-1">
                {action.name}
              </h3>
              <p className="text-xs opacity-90">
                {action.description}
              </p>
            </div>

            {/* Hover effect background */}
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          </button>
        ))}
      </div>
    </div>
  );
};

