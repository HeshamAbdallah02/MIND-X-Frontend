// frontend/src/context/BrandSettingsContext.js
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { fetchSettings } from '../utils/brandSettingsAPI';
import { useErrorHandler } from '../hooks/useErrorHandler';

const BrandSettingsContext = createContext(null);

export const BrandSettingsProvider = ({ children }) => {
  const [state, setState] = useState({
    settings: null,
    isLoading: true,
    error: null
  });
  
  const handleError = useErrorHandler();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadSettings = async () => {
      try {
        const data = await fetchSettings({ signal: controller.signal });
        if (isMounted) {
          setState({
            settings: data,
            isLoading: false,
            error: null
          });
        }
      } catch (error) {
        if (isMounted) {
          handleError(error);
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: error.message
          }));
        }
      }
    };

    loadSettings();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [handleError]);

  const updateSettings = (newSettings) => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...newSettings
      }
    }));
  };

  const value = useMemo(() => ({
    ...state,
    updateSettings
  }), [state]);

  return (
    <BrandSettingsContext.Provider value={value}>
      {children}
    </BrandSettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(BrandSettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a BrandSettingsProvider');
  }
  return {
    settings: context.settings,
    updateSettings: context.updateSettings
  };
};

export const useAnimationSettings = () => {
  const { settings } = useSettings();
  
  return useMemo(() => ({
    baseSpeed: settings?.sponsorsColors?.animation?.baseSpeed ?? 300,
    acceleration: settings?.sponsorsColors?.animation?.accelerationFactor ?? 1.0
  }), [settings]);
};
