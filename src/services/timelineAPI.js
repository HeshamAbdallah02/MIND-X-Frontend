//frontend/src/services/timelineAPI.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const timelineAPI = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth
timelineAPI.interceptors.request.use(
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
timelineAPI.interceptors.response.use(
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
 * Fetch all timeline data (sections and phases)
 * @returns {Promise} Promise resolving to timeline data
 */
export const fetchTimelineData = async () => {
  try {
    const response = await timelineAPI.get('/timeline');
    
    // Validate response structure
    if (!response.data || typeof response.data !== 'object') {
      throw new Error('Invalid timeline data format received');
    }

    const { sections = [], phases = [] } = response.data;

    // Validate and transform data
    const validatedSections = sections.map(section => ({
      id: section.id || '',
      title: section.title || 'Our Journey',
      subtitle: section.subtitle || '',
      backgroundColor: section.backgroundColor || '#f8fafc',
      lineColor: section.lineColor || '#e2e8f0',
      nodeColor: section.nodeColor || '#FBB859',
      textColor: section.textColor || '#1e293b',
      isActive: Boolean(section.isActive),
      order: Number(section.order) || 0,
    }));

    const validatedPhases = phases.map(phase => ({
      id: phase.id || '',
      year: phase.year || '',
      headline: phase.headline || '',
      description: phase.description || '',
      imageUrl: phase.imageUrl || null,
      imageAlt: phase.imageAlt || phase.headline || '',
      backgroundColor: phase.backgroundColor || '#ffffff',
      textColor: phase.textColor || '#1e293b',
      accentColor: phase.accentColor || '#FBB859',
      position: phase.position || 'auto',
      isActive: Boolean(phase.isActive),
      order: Number(phase.order) || 0,
      sectionId: phase.sectionId || '',
    }));

    return {
      sections: validatedSections.sort((a, b) => a.order - b.order),
      phases: validatedPhases.sort((a, b) => a.order - b.order),
    };
  } catch (error) {
    console.warn('Timeline API Error:', error.message);
    
    // Always return fallback data in development, or when backend is not available
    if (process.env.NODE_ENV === 'development' || error.code === 'ECONNREFUSED' || error.response?.status === 404) {
      console.warn('Using fallback timeline data - Backend not implemented yet');
      return getFallbackTimelineData();
    }
    
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to fetch timeline data'
    );
  }
};

/**
 * Fetch timeline sections only
 * @returns {Promise} Promise resolving to timeline sections
 */
export const fetchTimelineSections = async () => {
  try {
    const response = await timelineAPI.get('/timeline/sections');
    return response.data;
  } catch (error) {
    console.error('Error fetching timeline sections:', error);
    throw new Error(
      error.response?.data?.message || 
      'Failed to fetch timeline sections'
    );
  }
};

/**
 * Fetch timeline phases for a specific section
 * @param {string} sectionId - The section ID
 * @returns {Promise} Promise resolving to timeline phases
 */
export const fetchTimelinePhases = async (sectionId) => {
  try {
    const response = await timelineAPI.get(`/timeline/sections/${sectionId}/phases`);
    return response.data;
  } catch (error) {
    console.error('Error fetching timeline phases:', error);
    throw new Error(
      error.response?.data?.message || 
      'Failed to fetch timeline phases'
    );
  }
};

/**
 * Create new timeline section (admin only)
 * @param {Object} sectionData - Section data
 * @returns {Promise} Promise resolving to created section
 */
export const createTimelineSection = async (sectionData) => {
  try {
    const response = await timelineAPI.post('/timeline/sections', sectionData);
    return response.data;
  } catch (error) {
    console.error('Error creating timeline section:', error);
    throw new Error(
      error.response?.data?.message || 
      'Failed to create timeline section'
    );
  }
};

/**
 * Update timeline section (admin only)
 * @param {string} sectionId - Section ID
 * @param {Object} updateData - Updated section data
 * @returns {Promise} Promise resolving to updated section
 */
export const updateTimelineSection = async (sectionId, updateData) => {
  try {
    const response = await timelineAPI.put(`/timeline/sections/${sectionId}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Error updating timeline section:', error);
    throw new Error(
      error.response?.data?.message || 
      'Failed to update timeline section'
    );
  }
};

/**
 * Delete timeline section (admin only)
 * @param {string} sectionId - Section ID
 * @returns {Promise} Promise resolving to success status
 */
export const deleteTimelineSection = async (sectionId) => {
  try {
    const response = await timelineAPI.delete(`/timeline/sections/${sectionId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting timeline section:', error);
    throw new Error(
      error.response?.data?.message || 
      'Failed to delete timeline section'
    );
  }
};

/**
 * Create new timeline phase (admin only)
 * @param {Object} phaseData - Phase data
 * @returns {Promise} Promise resolving to created phase
 */
export const createTimelinePhase = async (phaseData) => {
  try {
    const response = await timelineAPI.post('/timeline/phases', phaseData);
    return response.data;
  } catch (error) {
    console.error('Error creating timeline phase:', error);
    throw new Error(
      error.response?.data?.message || 
      'Failed to create timeline phase'
    );
  }
};

/**
 * Update timeline phase (admin only)
 * @param {string} phaseId - Phase ID
 * @param {Object} updateData - Updated phase data
 * @returns {Promise} Promise resolving to updated phase
 */
export const updateTimelinePhase = async (phaseId, updateData) => {
  try {
    const response = await timelineAPI.put(`/timeline/phases/${phaseId}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Error updating timeline phase:', error);
    throw new Error(
      error.response?.data?.message || 
      'Failed to update timeline phase'
    );
  }
};

/**
 * Delete timeline phase (admin only)
 * @param {string} phaseId - Phase ID
 * @returns {Promise} Promise resolving to success status
 */
export const deleteTimelinePhase = async (phaseId) => {
  try {
    const response = await timelineAPI.delete(`/timeline/phases/${phaseId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting timeline phase:', error);
    throw new Error(
      error.response?.data?.message || 
      'Failed to delete timeline phase'
    );
  }
};

/**
 * Reorder timeline phases (admin only)
 * @param {string} sectionId - Section ID
 * @param {Array} phaseIds - Array of phase IDs in new order
 * @returns {Promise} Promise resolving to updated phases
 */
export const reorderTimelinePhases = async (sectionId, phaseIds) => {
  try {
    const response = await timelineAPI.put(`/timeline/sections/${sectionId}/reorder`, {
      phaseIds
    });
    return response.data;
  } catch (error) {
    console.error('Error reordering timeline phases:', error);
    throw new Error(
      error.response?.data?.message || 
      'Failed to reorder timeline phases'
    );
  }
};

/**
 * Fallback timeline data for development/testing
 * @returns {Object} Fallback timeline data
 */
const getFallbackTimelineData = () => ({
  sections: [
    {
      id: 'main-timeline',
      title: 'Our Journey',
      subtitle: 'Key milestones that shaped MIND-X',
      backgroundColor: '#f8fafc',
      lineColor: '#e2e8f0',
      nodeColor: '#FBB859',
      textColor: '#1e293b',
      isActive: true,
      order: 0,
    }
  ],
  phases: [
    {
      id: 'phase-1',
      year: '2018',
      headline: 'MIND-X is Born',
      description: 'Founded by a group of visionary students at the university, MIND-X began with a mission to bridge the gap between academic knowledge and practical skills.',
      imageUrl: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      imageAlt: 'MIND-X founding',
      backgroundColor: '#ffffff',
      textColor: '#1e293b',
      accentColor: '#FBB859',
      position: 'left',
      isActive: true,
      order: 0,
      sectionId: 'main-timeline',
      expandable: false,
    },
    {
      id: 'phase-2',
      year: '2019',
      headline: 'First Workshop Series',
      description: 'Launched our inaugural workshop series focusing on practical technology skills for students.',
      imageUrl: null,
      imageAlt: '',
      backgroundColor: '#ffffff',
      textColor: '#1e293b',
      accentColor: '#FBB859',
      position: 'right',
      isActive: true,
      order: 1,
      sectionId: 'main-timeline',
      expandable: true,
    },
    {
      id: 'phase-3',
      year: '2020',
      headline: 'National Recognition',
      description: 'Received recognition from educational institutions across Egypt for our innovative approach.',
      imageUrl: null,
      imageAlt: '',
      backgroundColor: '#ffffff',
      textColor: '#1e293b',
      accentColor: '#FBB859',
      position: 'left',
      isActive: true,
      order: 2,
      sectionId: 'main-timeline',
      expandable: true,
    },
  ],
});

export default timelineAPI;
