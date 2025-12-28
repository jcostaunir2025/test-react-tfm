import { useState, useCallback } from 'react';

/**
 * Custom hook for API calls
 * Basado en el ejemplo de CORS_FRONTEND_GUIDE.md
 */
export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = useCallback(async (apiFunction, ...args) => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiFunction(...args);
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Error en la petición';
      setError(errorMessage);
      console.error('API Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    callApi,
    loading,
    error,
    resetError,
  };
}

export default useApi;

