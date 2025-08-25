// frontend/src/hooks/queries/useEventsData.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../utils/api';
import { useErrorHandler } from '../useErrorHandler';

const QUERY_KEYS = {
  events: ['events'],
  eventsAdmin: ['events', 'admin'],
  eventsActive: ['events', 'active'],
  eventById: (id) => ['events', id],
};

// Fetch active events for public display
export const useActiveEvents = () => {
  const handleError = useErrorHandler();
  
  return useQuery({
    queryKey: QUERY_KEYS.eventsActive,
    queryFn: async () => {
      try {
        const { data } = await api.get('/events');
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

// Fetch all events for admin
export const useAdminEvents = () => {
  const handleError = useErrorHandler();
  
  return useQuery({
    queryKey: QUERY_KEYS.eventsAdmin,
    queryFn: async () => {
      try {
        const { data } = await api.get('/events/admin');
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

// Create event
export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  const handleError = useErrorHandler();

  return useMutation({
    mutationFn: async (data) => {
      const { data: response } = await api.post('/events', data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.events });
    },
    onError: handleError,
  });
};

// Update event
export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  const handleError = useErrorHandler();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const { data: response } = await api.put(`/events/${id}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.events });
    },
    onError: handleError,
  });
};

// Delete event
export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  const handleError = useErrorHandler();

  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/events/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.events });
    },
    onError: handleError,
  });
};

// Toggle event active status
export const useToggleEventActive = () => {
  const queryClient = useQueryClient();
  const handleError = useErrorHandler();

  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.patch(`/events/${id}/toggle-active`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.events });
    },
    onError: handleError,
  });
};

// Update event order
export const useUpdateEventOrder = () => {
  const queryClient = useQueryClient();
  const handleError = useErrorHandler();

  return useMutation({
    mutationFn: async ({ id, order }) => {
      const { data } = await api.patch(`/events/${id}/order`, { order });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.events });
    },
    onError: handleError,
  });
};

export { QUERY_KEYS };