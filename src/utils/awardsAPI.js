// frontend/src/utils/awardsAPI.js
import api from './api';

export const awardsAPI = {
  // Public endpoints
  getAwards: () => api.get('/awards'),
  getAward: (id) => api.get(`/awards/${id}`),
  getAwardsByType: (type) => api.get(`/awards/type/${type}`),
  getAwardsByYear: (year) => api.get(`/awards/year/${year}`),
  getAwardsSettings: () => api.get('/awards/settings/config'),

  // Protected endpoints (require authentication)
  getAllAwards: () => api.get('/awards/all'),
  createAward: (awardData) => api.post('/awards', awardData),
  updateAward: (id, awardData) => api.put(`/awards/${id}`, awardData),
  deleteAward: (id) => api.delete(`/awards/${id}`),
  reorderAwards: (awardsOrder) => api.put('/awards/reorder/batch', { awards: awardsOrder }),
  updateAwardsSettings: (settingsData) => api.put('/awards/settings/config', settingsData),
};

export default awardsAPI;
