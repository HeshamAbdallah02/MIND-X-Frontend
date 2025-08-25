// frontend/src/hooks/queries/useStatsData.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../utils/api';
import { useErrorHandler } from '../useErrorHandler';

const QUERY_KEYS = {
  stats: ['stats'],
  statsAdmin: ['stats', 'admin'],
  statById: (id) => ['stats', id],
};

// Fetch stats for public display
export const useStats = () => {
  const handleError = useErrorHandler();
  
  return useQuery({
    queryKey: QUERY_KEYS.stats,
    queryFn: async () => {
      try {
        const { data } = await api.get('/stats');
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

// Fetch all stats for admin
export const useAdminStats = () => {
  const handleError = useErrorHandler();
  
  return useQuery({
    queryKey: QUERY_KEYS.statsAdmin,
    queryFn: async () => {
      try {
        const { data } = await api.get('/stats');
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

// Create stat
export const useCreateStat = () => {
  const queryClient = useQueryClient();
  const handleError = useErrorHandler();

  return useMutation({
    mutationFn: async (data) => {
      const { data: response } = await api.post('/stats', data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats });
    },
    onError: handleError,
  });
};

// Update stat
export const useUpdateStat = () => {
  const queryClient = useQueryClient();
  const handleError = useErrorHandler();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const { data: response } = await api.put(`/stats/${id}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats });
    },
    onError: handleError,
  });
};

// Delete stat
export const useDeleteStat = () => {
  const queryClient = useQueryClient();
  const handleError = useErrorHandler();

  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/stats/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats });
    },
    onError: handleError,
  });
};

export { QUERY_KEYS };