// frontend/src/contexts/BrandSettingsContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchSettings } from '../utils/brandSettingsAPI';

const BrandSettingsContext = createContext();

export const BrandSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const data = await fetchSettings();
        setSettings(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  return (
    <BrandSettingsContext.Provider value={{ settings, loading, error, setSettings }}>
      {children}
    </BrandSettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(BrandSettingsContext);
  if (context === undefined) {
    throw new Error('useBrandSettings must be used within a BrandSettingsProvider');
  }
  return context;
};