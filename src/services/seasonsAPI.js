// frontend/src/services/seasonsAPI.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const seasonsAPI = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth
seasonsAPI.interceptors.request.use(
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
seasonsAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/dashboard/login';
    }
    return Promise.reject(error);
  }
);

// ==================== PUBLIC API FUNCTIONS ====================

// Get all active seasons
export const getSeasons = async () => {
  try {
    const response = await seasonsAPI.get('/seasons');
    return response.data;
  } catch (error) {
    console.error('Error fetching seasons:', error);
    throw error;
  }
};

// Get season by academic year
export const getSeasonByYear = async (academicYear) => {
  try {
    const response = await seasonsAPI.get(`/seasons/year/${academicYear}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching season ${academicYear}:`, error);
    throw error;
  }
};

// Get season by ID
export const getSeasonById = async (id) => {
  try {
    const response = await seasonsAPI.get(`/seasons/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching season ${id}:`, error);
    throw error;
  }
};

// ==================== ADMIN API FUNCTIONS ====================

// Get all seasons (including inactive) - Admin only
export const getAllSeasons = async () => {
  try {
    const response = await seasonsAPI.get('/seasons/admin/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching all seasons:', error);
    throw error;
  }
};

// Create new season - Admin only
export const createSeason = async (seasonData) => {
  try {
    const response = await seasonsAPI.post('/seasons/admin', seasonData);
    return response.data;
  } catch (error) {
    console.error('Error creating season:', error);
    throw error;
  }
};

// Update season - Admin only
export const updateSeason = async (id, seasonData) => {
  try {
    const response = await seasonsAPI.put(`/seasons/admin/${id}`, seasonData);
    return response.data;
  } catch (error) {
    console.error(`Error updating season ${id}:`, error);
    throw error;
  }
};

// Delete season - Admin only
export const deleteSeason = async (id) => {
  try {
    const response = await seasonsAPI.delete(`/seasons/admin/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting season ${id}:`, error);
    throw error;
  }
};

// Reorder seasons - Admin only
export const reorderSeasons = async (seasons) => {
  try {
    const response = await seasonsAPI.put('/seasons/admin/reorder/batch', { seasons });
    return response.data;
  } catch (error) {
    console.error('Error reordering seasons:', error);
    throw error;
  }
};

// ==================== IMAGE UPLOAD FUNCTIONS ====================

// Upload cover image - Admin only
export const uploadCoverImage = async (seasonId, imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await seasonsAPI.post(
      `/seasons/admin/${seasonId}/cover-image`,
      formData,
      {
        headers: {
          'Content-Type': undefined, // Let browser set the correct multipart/form-data with boundary
        },
        timeout: 60000 // 60 seconds for file uploads
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error uploading cover image for season ${seasonId}:`, error);
    throw error;
  }
};

// Delete cover image - Admin only
export const deleteCoverImage = async (seasonId) => {
  try {
    const response = await seasonsAPI.delete(`/seasons/admin/${seasonId}/cover-image`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting cover image for season ${seasonId}:`, error);
    throw error;
  }
};

// Upload board member avatar - Admin only
export const uploadMemberAvatar = async (seasonId, memberId, imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await seasonsAPI.post(
      `/seasons/admin/${seasonId}/board-members/${memberId}/avatar`,
      formData,
      {
        headers: {
          'Content-Type': undefined, // Let browser set the correct multipart/form-data with boundary
        },
        timeout: 60000 // 60 seconds for file uploads
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error uploading avatar for member ${memberId}:`, error);
    throw error;
  }
};

// ==================== BOARD MEMBER FUNCTIONS ====================

// Add board member - Admin only
export const addBoardMember = async (seasonId, memberData) => {
  try {
    const response = await seasonsAPI.post(`/seasons/admin/${seasonId}/board-members`, memberData);
    return response.data;
  } catch (error) {
    console.error(`Error adding board member to season ${seasonId}:`, error);
    throw error;
  }
};

// Update board member - Admin only
export const updateBoardMember = async (seasonId, memberId, memberData) => {
  try {
    const response = await seasonsAPI.put(
      `/seasons/admin/${seasonId}/board-members/${memberId}`, 
      memberData
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating board member ${memberId}:`, error);
    throw error;
  }
};

// Delete board member - Admin only
export const deleteBoardMember = async (seasonId, memberId) => {
  try {
    const response = await seasonsAPI.delete(`/seasons/admin/${seasonId}/board-members/${memberId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting board member ${memberId}:`, error);
    throw error;
  }
};

// Reorder board members - Admin only
export const reorderBoardMembers = async (seasonId, members) => {
  try {
    const response = await seasonsAPI.put(
      `/seasons/admin/${seasonId}/board-members/reorder`, 
      { members }
    );
    return response.data;
  } catch (error) {
    console.error(`Error reordering board members for season ${seasonId}:`, error);
    throw error;
  }
};

// Set leader - Admin only
export const setLeader = async (seasonId, memberId) => {
  try {
    const response = await seasonsAPI.put(`/seasons/admin/${seasonId}/set-leader/${memberId}`);
    return response.data;
  } catch (error) {
    console.error(`Error setting leader ${memberId} for season ${seasonId}:`, error);
    throw error;
  }
};

// ==================== HIGHLIGHT FUNCTIONS ====================

// Add highlight - Admin only
export const addHighlight = async (seasonId, highlightData) => {
  try {
    const response = await seasonsAPI.post(`/seasons/admin/${seasonId}/highlights`, highlightData);
    return response.data;
  } catch (error) {
    console.error(`Error adding highlight to season ${seasonId}:`, error);
    throw error;
  }
};

// Update highlight - Admin only
export const updateHighlight = async (seasonId, highlightId, highlightData) => {
  try {
    const response = await seasonsAPI.put(
      `/seasons/admin/${seasonId}/highlights/${highlightId}`, 
      highlightData
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating highlight ${highlightId}:`, error);
    throw error;
  }
};

// Delete highlight - Admin only
export const deleteHighlight = async (seasonId, highlightId) => {
  try {
    const response = await seasonsAPI.delete(`/seasons/admin/${seasonId}/highlights/${highlightId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting highlight ${highlightId}:`, error);
    throw error;
  }
};

// Reorder highlights - Admin only
export const reorderHighlights = async (seasonId, highlights) => {
  try {
    const response = await seasonsAPI.put(
      `/seasons/admin/${seasonId}/highlights/reorder`, 
      { highlights }
    );
    return response.data;
  } catch (error) {
    console.error(`Error reordering highlights for season ${seasonId}:`, error);
    throw error;
  }
};

// ==================== BOARD MEMBER GETTER FUNCTIONS ====================

// Get board members for a season
export const getBoardMembers = async (seasonId) => {
  try {
    const response = await seasonsAPI.get(`/seasons/${seasonId}`);
    return response.data.boardMembers || [];
  } catch (error) {
    console.error(`Error fetching board members for season ${seasonId}:`, error);
    throw error;
  }
};

// ==================== HIGHLIGHTS GETTER FUNCTIONS ====================

// Get highlights for a season
export const getHighlights = async (seasonId) => {
  try {
    const response = await seasonsAPI.get(`/seasons/${seasonId}`);
    return response.data.highlights || [];
  } catch (error) {
    console.error(`Error fetching highlights for season ${seasonId}:`, error);
    throw error;
  }
};

// Default export
const seasonsAPIService = {
  // Public functions
  getSeasons,
  getSeasonByYear,
  getSeasonById,
  
  // Admin functions
  getAllSeasons,
  createSeason,
  updateSeason,
  deleteSeason,
  reorderSeasons,
  
  // Image functions
  uploadCoverImage,
  deleteCoverImage,
  uploadMemberAvatar,
  
  // Board member functions
  addBoardMember,
  updateBoardMember,
  deleteBoardMember,
  reorderBoardMembers,
  setLeader,
  
  // Highlight functions
  addHighlight,
  updateHighlight,
  deleteHighlight,
  reorderHighlights
};

export default seasonsAPIService;
