// frontend/src/api/brandSettingsAPI.js
import axios from 'axios';
import api from './api'; // Use the configured axios instance

const API_URL = process.env.REACT_APP_API_URL || 'https://mind-x-backend.fly.dev';

export const fetchSettings = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/settings`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateSettings = async (data, token) => {
  try {
    const response = await api.put('/settings', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadFile = async (file, token) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(
      `${API_URL}/api/upload`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
