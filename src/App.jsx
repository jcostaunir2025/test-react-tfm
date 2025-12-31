import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { PatientsPage } from './pages/PatientsPage';
import SentimentAnalysisPage from './pages/SentimentAnalysisPage';
import { HighRiskMonitoringPage } from './pages/HighRiskMonitoringPage';
import ConsultationsPage from './pages/ConsultationsPage';
import EvaluationsPage from './pages/EvaluationsPage';
import UsersPage from './pages/UsersPage';

const ReportsPage = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900">Reportes</h1>
    <div className="card">
      <p className="text-gray-600">Módulo de reportes en desarrollo...</p>
    </div>
  </div>
);

const SettingsPage = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
    <div className="card">
      <p className="text-gray-600">Módulo de configuración en desarrollo...</p>
    </div>
  </div>
);

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />

          <Route
            path="patients"
            element={
              <ProtectedRoute roles={['ADMIN', 'DOCTOR', 'ENFERMERO', 'RECEPCIONISTA']}>
                <PatientsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="consultations"
            element={
              <ProtectedRoute roles={['ADMIN', 'DOCTOR', 'ENFERMERO']}>
                <ConsultationsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="evaluations"
            element={
              <ProtectedRoute roles={['ADMIN', 'DOCTOR', 'ENFERMERO', 'ANALISTA']}>
                <EvaluationsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="sentiment"
            element={
              <ProtectedRoute roles={['ADMIN', 'DOCTOR', 'ANALISTA']}>
                <SentimentAnalysisPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="reports"
            element={
              <ProtectedRoute roles={['ADMIN', 'DOCTOR', 'ANALISTA', 'AUDITOR']}>
                <ReportsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="high-risk"
            element={
              <ProtectedRoute roles={['ADMIN', 'DOCTOR', 'ENFERMERO']}>
                <HighRiskMonitoringPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="users"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <UsersPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="settings"
            element={
              <ProtectedRoute roles={['ADMIN', 'DOCTOR']}>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

