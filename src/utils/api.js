// frontend/src/utils/api.js
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

// Cache token to avoid repeated localStorage access
let cachedToken = null;
let tokenExpiry = null;

const getToken = () => {
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  cachedToken = localStorage.getItem('token');
  // Cache for 5 minutes to reduce localStorage access
  tokenExpiry = Date.now() + 5 * 60 * 1000;
  return cachedToken;
};

const clearTokenCache = () => {
  cachedToken = null;
  tokenExpiry = null;
};

// API Configuration
const API_CONFIG = {
  baseURL: API_BASE_URL + '/api',
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  }
};

const api = axios.create(API_CONFIG);

// Request interceptor with cached token
api.interceptors.request.use(
  config => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor with better error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      clearTokenCache();
      // Use router navigation instead of direct window.location
      if (window.location.pathname !== `/${process.env.REACT_APP_ADMIN_PATH}/access`) {
        window.location.href = `/${process.env.REACT_APP_ADMIN_PATH}/access`;
      }
    }
    return Promise.reject(error);
  }
);

// Export utilities for token management
export const tokenUtils = {
  setToken: (token) => {
    localStorage.setItem('token', token);
    cachedToken = token;
    tokenExpiry = Date.now() + 5 * 60 * 1000;
  },
  removeToken: () => {
    localStorage.removeItem('token');
    clearTokenCache();
  },
  getToken
};

export default api;
