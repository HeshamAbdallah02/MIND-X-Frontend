// frontend/src/context/HeaderConfigContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import api from '../utils/api';

const HeaderConfigContext = createContext();

export const HeaderConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConfig = async (signal) => {
    try {
      setLoading(true);
      const response = await api.get('/header', { signal });
      setConfig(response.data);
      setError(null);
    } catch (err) {
      if (!signal.aborted) {
        setError(err.response?.data?.message || 'Failed to load header config');
      }
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchConfig(controller.signal);
    return () => controller.abort();
  }, []);

  return (
    <HeaderConfigContext.Provider value={{ config, loading, error, refresh: fetchConfig }}>
      {children}
    </HeaderConfigContext.Provider>
  );
};

export const useHeaderConfig = () => {
  const context = useContext(HeaderConfigContext);
  if (!context) {
    throw new Error('useHeaderConfig must be used within a HeaderConfigProvider');
  }
  return context;
};