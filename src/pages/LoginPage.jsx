import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { LogIn, Brain } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import authService from '../services/authService';
import { Alert } from '../components/common/Alert';
import { LoadingButton } from '../components/common/Loading';

export const LoginPage = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(data.username, data.password);
      login(response.user, response.token);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            RNTN Sentiment Analysis
          </h1>
          <p className="text-gray-600">
            Sistema de Análisis de Sentimientos para Salud Mental
          </p>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Iniciar Sesión</h2>

          {error && (
            <Alert type="error" message={error} dismissible onDismiss={() => setError('')} className="mb-4" />
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Usuario</label>
              <input
                type="text"
                className="input"
                {...register('username', { required: 'El usuario es requerido' })}
              />
              {errors.username && (
                <p className="text-sm text-danger-600 mt-1">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label className="label">Contraseña</label>
              <input
                type="password"
                className="input"
                {...register('password', { required: 'La contraseña es requerida' })}
              />
              {errors.password && (
                <p className="text-sm text-danger-600 mt-1">{errors.password.message}</p>
              )}
            </div>

            <LoadingButton
              type="submit"
              loading={loading}
              className="btn btn-primary w-full flex items-center justify-center"
            >
              <LogIn className="h-5 w-5 mr-2" />
              Iniciar Sesión
            </LoadingButton>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Usuarios de prueba disponibles según rol
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600 mt-4">
          © 2025 RNTN Sentiment Analysis System
        </p>
      </div>
    </div>
  );
};

