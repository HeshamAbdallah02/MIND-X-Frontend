// frontend/src/hooks/queries/useHeroData.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../utils/api';
import { useErrorHandler } from '../useErrorHandler';

const QUERY_KEYS = {
  hero: ['hero'],
  heroById: (id) => ['hero', id],
};

// Fetch all hero contents
export const useHeroContents = () => {
  const handleError = useErrorHandler();
  
  return useQuery({
    queryKey: QUERY_KEYS.hero,
    queryFn: async () => {
      try {
        const { data } = await api.get('/hero');
        return data.sort((a, b) => a.order - b.order);
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

// Create hero content
export const useCreateHeroContent = () => {
  const queryClient = useQueryClient();
  const handleError = useErrorHandler();

  return useMutation({
    mutationFn: async (data) => {
      const { data: response } = await api.post('/hero', data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.hero });
    },
    onError: handleError,
  });
};

// Update hero content
export const useUpdateHeroContent = () => {
  const queryClient = useQueryClient();
  const handleError = useErrorHandler();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const { data: response } = await api.put(`/hero/${id}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.hero });
    },
    onError: handleError,
  });
};

// Delete hero content
export const useDeleteHeroContent = () => {
  const queryClient = useQueryClient();
  const handleError = useErrorHandler();

  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/hero/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.hero });
    },
    onError: handleError,
  });
};

export { QUERY_KEYS };