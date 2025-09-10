// frontend/src/api/brandSettingsAPI.js
import api from './api';

// Fallback brand settings for development
const fallbackSettings = {
  primaryColor: '#FBB859',
  secondaryColor: '#81C99C', 
  textPrimary: '#1e293b',
  textSecondary: '#606161',
  sectionBackground: '#ffffff',
  titleColor: '#1e293b',
  iconColor: '#81C99C',
  numberColor: '#FBB859',
  logoUrl: '/logo.png',
  brandName: 'MIND-X',
  tagline: 'Building the future of education',
  contactEmail: 'info@mind-x.org',
  socialLinks: {
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: ''
  }
};

export const fetchSettings = async () => {
  try {
    const response = await api.get('/settings');
    return response.data;
  } catch (error) {
    console.warn('Failed to fetch brand settings from backend, using fallback data:', error.message);
    // Return fallback data in development mode
    if (process.env.NODE_ENV === 'development') {
      return fallbackSettings;
    }
    throw error;
  }
};

export const updateSettings = async (data) => {
  try {
    const response = await api.patch('/settings', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': undefined // Let browser set the correct multipart/form-data with boundary
      },
      timeout: 60000 // 60 seconds for file uploads
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};