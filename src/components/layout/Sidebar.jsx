import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardList,
  FileText,
  AlertTriangle,
  Brain,
  Settings,
  UserCog,
  ChevronDown,
  ChevronRight,
  Activity,
  Shield
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { hasAnyRole } from '../../utils/roleUtils';

export const Sidebar = () => {
  const { user } = useAuthStore();
  const [expandedSections, setExpandedSections] = useState({
    main: true,
    clinical: true,
    analytics: true,
    admin: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const navigationSections = [
    {
      id: 'main',
      name: 'Principal',
      items: [
        {
          name: 'Dashboard',
          to: '/',
          icon: LayoutDashboard,
          roles: ['ADMIN', 'DOCTOR', 'ENFERMERO', 'ANALISTA', 'RECEPCIONISTA', 'AUDITOR'],
          badge: null,
          description: 'Panel principal con estadísticas y resumen'
        }
      ]
    },
    {
      id: 'clinical',
      name: 'Gestión Clínica',
      items: [
        {
          name: 'Pacientes',
          to: '/patients',
          icon: Users,
          roles: ['ADMIN', 'DOCTOR', 'ENFERMERO', 'RECEPCIONISTA'],
          badge: null,
          description: 'Gestión completa de pacientes (CRUD)'
        },
        {
          name: 'Consultas',
          to: '/consultations',
          icon: Calendar,
          roles: ['ADMIN', 'DOCTOR', 'ENFERMERO'],
          badge: null,
          description: 'Consultas médicas y seguimiento'
        },
        {
          name: 'Evaluaciones',
          to: '/evaluations',
          icon: ClipboardList,
          roles: ['ADMIN', 'DOCTOR', 'ENFERMERO', 'ANALISTA'],
          badge: null,
          description: 'Evaluaciones psicológicas y preguntas'
        },
        {
          name: 'Alto Riesgo',
          to: '/high-risk',
          icon: AlertTriangle,
          roles: ['ADMIN', 'DOCTOR', 'ENFERMERO'],
          badge: { text: '!', variant: 'danger' },
          description: 'Monitoreo de pacientes con riesgo suicida'
        }
      ]
    },
    {
      id: 'analytics',
      name: 'Análisis y Reportes',
      items: [
        {
          name: 'Análisis de Sentimientos',
          to: '/sentiment',
          icon: Brain,
          roles: ['ADMIN', 'DOCTOR', 'ANALISTA'],
          badge: { text: 'RNTN', variant: 'info' },
          description: 'Análisis de sentimientos con modelo RNTN'
        },
        {
          name: 'Reportes',
          to: '/reports',
          icon: FileText,
          roles: ['ADMIN', 'DOCTOR', 'ANALISTA', 'AUDITOR'],
          badge: null,
          description: 'Reportes y estadísticas del sistema'
        }
      ]
    },
    {
      id: 'admin',
      name: 'Administración',
      items: [
        {
          name: 'Usuarios',
          to: '/users',
          icon: UserCog,
          roles: ['ADMIN'],
          badge: { text: 'Admin', variant: 'warning' },
          description: 'Gestión de usuarios y roles (Solo ADMIN)'
        },
        {
          name: 'Configuración',
          to: '/settings',
          icon: Settings,
          roles: ['ADMIN', 'DOCTOR'],
          badge: null,
          description: 'Configuración del sistema'
        }
      ]
    }
  ];

  const filteredSections = navigationSections
    .map(section => ({
      ...section,
      items: section.items.filter(item => !item.roles || hasAnyRole(item.roles))
    }))
    .filter(section => section.items.length > 0);

  const Badge = ({ badge }) => {
    if (!badge) return null;

    const variants = {
      danger: 'bg-red-100 text-red-600 border-red-200',
      warning: 'bg-yellow-100 text-yellow-600 border-yellow-200',
      success: 'bg-green-100 text-green-600 border-green-200',
      info: 'bg-blue-100 text-blue-600 border-blue-200',
      default: 'bg-gray-100 text-gray-600 border-gray-200'
    };

    return (
      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${variants[badge.variant] || variants.default}`}>
        {badge.text}
      </span>
    );
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] overflow-y-auto">
      {/* User Info Card */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-primary-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-sm">
              {user?.nombre?.charAt(0) || user?.username?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.nombre || user?.username}
            </p>
            <p className="text-xs text-primary-600 font-medium">
              {user?.roles?.[0] || 'Usuario'}
            </p>
          </div>
          <Activity className="h-4 w-4 text-green-500" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-2">
        {filteredSections.map((section) => (
          <div key={section.id} className="space-y-1">
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
            >
              <span>{section.name}</span>
              {expandedSections[section.id] ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>

            {/* Section Items */}
            {expandedSections[section.id] && (
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-primary-50 text-primary-700 shadow-sm border border-primary-100'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                      }`
                    }
                    title={item.description}
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon
                          className={`h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110 ${
                            isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'
                          }`}
                        />
                        <span className="flex-1 truncate">{item.name}</span>
                        <Badge badge={item.badge} />
                        {isActive && (
                          <div className="w-1.5 h-1.5 bg-primary-600 rounded-full animate-pulse" />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Shield className="h-4 w-4" />
          <span>Sesión segura</span>
        </div>
      </div>
    </aside>
  );
};

