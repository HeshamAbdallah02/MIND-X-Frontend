// frontend/src/api/brandSettingsAPI.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const fetchSettings = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/settings`);
    return response.data;
  } catch (error) {
    console.error('Error fetching settings:', error);
    throw error;
  }
};

export const updateSettings = async (data, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/settings`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
};