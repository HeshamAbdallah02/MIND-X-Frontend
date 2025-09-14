// frontend/src/services/ctaService.js
import api from '../utils/api';

// Admin CTA functions
export const fetchCTA = async () => {
  const response = await api.get('/cta/admin');
  return response.data;
};

export const updateCTA = async (ctaData) => {
  const response = await api.put('/cta/admin', ctaData);
  return response.data;
};

export const toggleCTAStatus = async () => {
  const response = await api.post('/cta/admin/toggle');
  return response.data;
};

// Public CTA function
export const fetchActiveCTA = async () => {
  const response = await api.get('/cta/active');
  return response.data;
};
