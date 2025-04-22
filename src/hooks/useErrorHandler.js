// frontend/src/hooks/useErrorHandler.js
import { useCallback } from 'react';
import toast from 'react-hot-toast';

export const useErrorHandler = () => {
  return useCallback((error) => {
    const message = error?.response?.data?.message || 
                   error?.message || 
                   'An unexpected error occurred';

    console.error('[ERROR]', {
      message,
      code: error?.code,
      stack: error?.stack,
      endpoint: error?.config?.url
    });

    toast.error(message, {
      position: 'top-center',
      duration: 5000,
      style: {
        background: '#fef2f2',
        color: '#b91c1c',
        border: '1px solid #fecaca'
      }
    });
  }, []);
};
