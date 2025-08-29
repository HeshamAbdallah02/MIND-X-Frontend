// frontend/src/hooks/queries/useStoryHeroData.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../utils/api';
import { useErrorHandler } from '../useErrorHandler';

const QUERY_KEYS = {
  storyHero: ['storyHero'],
  storyHeroAdmin: ['storyHero', 'admin'],
};

// Fetch story hero data for public display
export const useStoryHero = () => {
  const handleError = useErrorHandler();
  
  return useQuery({
    queryKey: QUERY_KEYS.storyHero,
    queryFn: async () => {
      try {
        const { data } = await api.get('/story-hero');
        return data;
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      if (error.response?.status === 401) return false;
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
  });
};

// Fetch story hero data for admin
export const useAdminStoryHero = () => {
  const handleError = useErrorHandler();
  
  return useQuery({
    queryKey: QUERY_KEYS.storyHeroAdmin,
    queryFn: async () => {
      try {
        const { data } = await api.get('/story-hero');
        return data;
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes for admin data
    retry: (failureCount, error) => {
      if (error.response?.status === 401) return false;
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
  });
};

// Update story hero
export const useUpdateStoryHero = () => {
  const queryClient = useQueryClient();
  const handleError = useErrorHandler();

  return useMutation({
    mutationFn: async (data) => {
      const { data: response } = await api.put('/story-hero', data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.storyHero });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.storyHeroAdmin });
    },
    onError: handleError,
  });
};

// Add image to story hero
export const useAddStoryHeroImage = () => {
  const queryClient = useQueryClient();
  const handleError = useErrorHandler();

  return useMutation({
    mutationFn: async (imageData) => {
      const { data: response } = await api.post('/story-hero/images', imageData);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.storyHero });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.storyHeroAdmin });
    },
    onError: handleError,
  });
};

// Remove image from story hero
export const useRemoveStoryHeroImage = () => {
  const queryClient = useQueryClient();
  const handleError = useErrorHandler();

  return useMutation({
    mutationFn: async (imageId) => {
      await api.delete(`/story-hero/images/${imageId}`);
      return imageId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.storyHero });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.storyHeroAdmin });
    },
    onError: handleError,
  });
};

export { QUERY_KEYS };
