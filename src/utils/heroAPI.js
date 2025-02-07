// frontend/src/utils/heroAPI.js
import api from './api';

export const getHeroContents = () => api.get('/hero');
export const createHeroContent = (data) => api.post('/hero', data);
export const updateHeroContent = (id, data) => api.put(`/hero/${id}`, data);
export const deleteHeroContent = (id) => api.delete(`/hero/${id}`);