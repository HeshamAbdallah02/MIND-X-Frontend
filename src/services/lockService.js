// frontend/src/services/lockService.js
import api from '../utils/api';

export const getLockStatus = async (section) => {
  try {
    const response = await api.get(`/locks/status/${section}`);
    return response.data;
  } catch (error) {
    return { locked: false, lock: null };
  }
};

export const manageLock = async (action, section) => {
  try {
    const response = await api.post(`/locks/${action}`, { section });
    return response.data;
  } catch (error) {
    if (error.response?.status === 409) {
      error.lock = error.response.data.lock;
    }
    throw error;
  }
};