// frontend/src/hooks/queries/useSponsorsData.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../utils/api';
import { useErrorHandler } from '../useErrorHandler';

const QUERY_KEYS = {
  sponsors: ['sponsors'],
  sponsorsActive: ['sponsors', 'active'],
  sponsorsAdmin: ['sponsors', 'admin'],
  sponsorById: (id) => ['sponsors', id],
};

// Fetch active sponsors for public display
export const useActiveSponsors = () => {
  const handleError = useErrorHandler();
  
  return useQuery({
    queryKey: QUERY_KEYS.sponsorsActive,
    queryFn: async () => {
      try {
        const { data } = await api.get('/sponsors/active');
        // Backend already returns { sponsors: [...], partners: [...] }
        return {
          sponsors: data?.sponsors || [],
          partners: data?.partners || [],
        };
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

// Fetch all sponsors for admin
export const useAdminSponsors = () => {
  const handleError = useErrorHandler();
  
  return useQuery({
    queryKey: QUERY_KEYS.sponsorsAdmin,
    queryFn: async () => {
      try {
        const { data } = await api.get('/sponsors');
        // Backend returns array, so we need to filter it
        const items = Array.isArray(data) ? data : [];
        return {
          sponsors: items.filter(s => s.type === 'sponsor'),
          partners: items.filter(s => s.type === 'partner'),
          loading: false,
          error: null,
        };
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

// Create sponsor
export const useCreateSponsor = () => {
  const queryClient = useQueryClient();
  const handleError = useErrorHandler();

  return useMutation({
    mutationFn: async (data) => {
      const { data: response } = await api.post('/sponsors', data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.sponsors });
    },
    onError: handleError,
  });
};

// Update sponsor
export const useUpdateSponsor = () => {
  const queryClient = useQueryClient();
  const handleError = useErrorHandler();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const { data: response } = await api.put(`/sponsors/${id}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.sponsors });
    },
    onError: handleError,
  });
};

// Delete sponsor
export const useDeleteSponsor = () => {
  const queryClient = useQueryClient();
  const handleError = useErrorHandler();

  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/sponsors/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.sponsors });
    },
    onError: handleError,
  });
};

export { QUERY_KEYS };