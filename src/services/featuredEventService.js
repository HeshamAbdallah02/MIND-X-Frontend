// frontend/src/services/featuredEventService.js
// Service specifically for the Events Page featured & past events functionality
import axios from 'axios';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const featuredEventAPI = axios.create({
  baseURL: `${API_BASE_URL}/api/page-events`, // Updated to page-events endpoint
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth
featuredEventAPI.interceptors.request.use(
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
featuredEventAPI.interceptors.response.use(
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

/**
 * Get featured event (next upcoming event)
 */
export const getFeaturedEvent = async () => {
  const response = await featuredEventAPI.get('/featured');
  return response.data;
};

/**
 * Get all active events
 */
export const getEvents = async () => {
  const response = await featuredEventAPI.get('/');
  return response.data;
};

/**
 * Get single event by ID
 */
export const getEventById = async (id) => {
  const response = await featuredEventAPI.get(`/${id}`);
  return response.data;
};

/**
 * Get event categories
 */
export const getEventCategories = async () => {
  const response = await featuredEventAPI.get('/categories'); // Updated endpoint
  return response.data;
};

/**
 * Get past events with search and filtering
 */
export const getPastEvents = async ({ pageParam = 1, search = '', categories = [] }) => {
  const params = {
    page: pageParam,
    limit: 12,
    search,
  };
  
  if (categories.length > 0) {
    params.categories = categories.join(',');
  }
  
  const response = await featuredEventAPI.get('/past', { params });
  return response.data;
};

// ==================== REACT QUERY HOOKS ====================

/**
 * Hook to fetch featured event
 */
export const useFeaturedEvent = () => {
  return useQuery({
    queryKey: ['event', 'featured'],
    queryFn: getFeaturedEvent,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook to fetch all events
 */
export const useEvents = () => {
  return useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
};

/**
 * Hook to fetch single event
 */
export const useEvent = (id) => {
  return useQuery({
    queryKey: ['event', id],
    queryFn: () => getEventById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
};

/**
 * Alias for useEvent - Hook to fetch single event by ID
 */
export const useEventById = useEvent;

/**
 * Hook to fetch event categories
 */
export const useEventCategories = () => {
  return useQuery({
    queryKey: ['events', 'categories'],
    queryFn: getEventCategories,
    staleTime: 1000 * 60 * 30, // 30 minutes - categories don't change often
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook to fetch past events with infinite scroll
 */
export const usePastEvents = (search = '', categories = []) => {
  return useInfiniteQuery({
    queryKey: ['events', 'past', search, categories],
    queryFn: ({ pageParam = 1 }) => getPastEvents({ pageParam, search, categories }),
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasMore ? lastPage.pagination.page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

export default featuredEventAPI;
