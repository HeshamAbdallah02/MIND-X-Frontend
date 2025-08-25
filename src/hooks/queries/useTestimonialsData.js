// frontend/src/hooks/queries/useTestimonialsData.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../utils/api';
import { useErrorHandler } from '../useErrorHandler';

const QUERY_KEYS = {
  testimonials: ['testimonials'],
  testimonialsActive: ['testimonials', 'active'],
  testimonialsAdmin: ['testimonials', 'admin'],
  testimonialById: (id) => ['testimonials', id],
};

// Fetch active testimonials for public display
export const useActiveTestimonials = () => {
  const handleError = useErrorHandler();
  
  return useQuery({
    queryKey: QUERY_KEYS.testimonialsActive,
    queryFn: async () => {
      try {
        const { data } = await api.get('/testimonials/active');
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

// Fetch all testimonials for admin
export const useAdminTestimonials = () => {
  const handleError = useErrorHandler();
  
  return useQuery({
    queryKey: QUERY_KEYS.testimonialsAdmin,
    queryFn: async () => {
      try {
        const { data } = await api.get('/testimonials');
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

// Create testimonial
export const useCreateTestimonial = () => {
  const queryClient = useQueryClient();
  const handleError = useErrorHandler();

  return useMutation({
    mutationFn: async (data) => {
      const { data: response } = await api.post('/testimonials', data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.testimonials });
    },
    onError: handleError,
  });
};

// Update testimonial
export const useUpdateTestimonial = () => {
  const queryClient = useQueryClient();
  const handleError = useErrorHandler();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const { data: response } = await api.put(`/testimonials/${id}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.testimonials });
    },
    onError: handleError,
  });
};

// Delete testimonial
export const useDeleteTestimonial = () => {
  const queryClient = useQueryClient();
  const handleError = useErrorHandler();

  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/testimonials/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.testimonials });
    },
    onError: handleError,
  });
};

export { QUERY_KEYS };