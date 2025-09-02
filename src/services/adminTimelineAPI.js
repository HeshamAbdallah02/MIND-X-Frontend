//frontend/src/services/adminTimelineAPI.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const adminTimelineAPI = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth
adminTimelineAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
adminTimelineAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Timeline Sections API
 */
export const timelineSectionsAPI = {
  // Get all sections
  getSections: async () => {
    const response = await adminTimelineAPI.get('/timeline/sections');
    return response.data;
  },

  // Create a new section
  createSection: async (sectionData) => {
    const response = await adminTimelineAPI.post('/timeline/sections', sectionData);
    return response.data;
  },

  // Update a section
  updateSection: async (id, sectionData) => {
    const response = await adminTimelineAPI.put(`/timeline/sections/${id}`, sectionData);
    return response.data;
  },

  // Delete a section
  deleteSection: async (id) => {
    const response = await adminTimelineAPI.delete(`/timeline/sections/${id}`);
    return response.data;
  },

  // Reorder sections
  reorderSections: async (orderedIds) => {
    const response = await adminTimelineAPI.put('/timeline/sections/reorder', { orderedIds });
    return response.data;
  }
};

/**
 * Timeline Phases API
 */
export const timelinePhasesAPI = {
  // Get all phases for a section
  getPhases: async (sectionId) => {
    const response = await adminTimelineAPI.get(`/timeline/sections/${sectionId}/phases`);
    return response.data;
  },

  // Get all phases (across all sections)
  getAllPhases: async () => {
    const response = await adminTimelineAPI.get('/timeline/phases');
    return response.data;
  },

  // Create a new phase
  createPhase: async (phaseData) => {
    const response = await adminTimelineAPI.post('/timeline/phases', phaseData);
    return response.data;
  },

  // Update a phase
  updatePhase: async (id, phaseData) => {
    const response = await adminTimelineAPI.put(`/timeline/phases/${id}`, phaseData);
    return response.data;
  },

  // Delete a phase
  deletePhase: async (id) => {
    const response = await adminTimelineAPI.delete(`/timeline/phases/${id}`);
    return response.data;
  },

  // Reorder phases within a section
  reorderPhases: async (sectionId, orderedIds) => {
    const response = await adminTimelineAPI.put(`/timeline/sections/${sectionId}/phases/reorder`, { orderedIds });
    return response.data;
  },

  // Upload phase image
  uploadPhaseImage: async (id, formData) => {
    const response = await adminTimelineAPI.post(`/timeline/phases/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete phase image
  deletePhaseImage: async (id) => {
    const response = await adminTimelineAPI.delete(`/timeline/phases/${id}/image`);
    return response.data;
  }
};

/**
 * Combined Timeline API
 */
export const adminTimelineAPI_combined = {
  // Get complete timeline data
  getTimelineData: async () => {
    const response = await adminTimelineAPI.get('/timeline');
    return response.data;
  },

  // Search phases
  searchPhases: async (query) => {
    const response = await adminTimelineAPI.get(`/timeline/phases/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Filter phases by year range
  filterPhasesByYear: async (startYear, endYear) => {
    const response = await adminTimelineAPI.get(`/timeline/phases/filter?startYear=${startYear}&endYear=${endYear}`);
    return response.data;
  },

  // Get timeline stats
  getTimelineStats: async () => {
    const response = await adminTimelineAPI.get('/timeline/stats');
    return response.data;
  }
};

const adminTimelineAPI_export = {
  sections: timelineSectionsAPI,
  phases: timelinePhasesAPI,
  combined: adminTimelineAPI_combined
};

export default adminTimelineAPI_export;
