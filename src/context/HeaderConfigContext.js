// frontend/src/context/HeaderConfigContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import api from '../utils/api';

const HeaderConfigContext = createContext();

export const HeaderConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const response = await api.get('/header');
      setConfig(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load header config');
      setConfig(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
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