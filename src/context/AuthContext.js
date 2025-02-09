// frontend/src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api'; // Use the centralized axios instance

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      
      const response = await api.get('/auth/me');
      setAdmin(response.data);
      setError(null);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
      setError(error.response?.data?.message || 'Session expired');
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      await checkAuth();
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAdmin(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ 
      admin, 
      loading,
      error,
      login, 
      logout,
      checkAuth // Optional: export if you need manual revalidation
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};