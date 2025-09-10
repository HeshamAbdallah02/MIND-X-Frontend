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
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.sponsorsActive });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.sponsorsAdmin });
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
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.sponsorsActive });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.sponsorsAdmin });
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
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.sponsorsActive });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.sponsorsAdmin });
    },
    onError: handleError,
  });
};

// Reorder sponsors with optimistic updates
export const useReorderSponsors = () => {
  const queryClient = useQueryClient();
  const handleError = useErrorHandler();

  return useMutation({
    mutationFn: async (reorderData) => {
      // reorderData: { sponsors: [{id, order}], partners: [{id, order}] } or just [{id, order}]
      const updates = Array.isArray(reorderData) 
        ? reorderData 
        : [...(reorderData.sponsors || []), ...(reorderData.partners || [])];
      
      await Promise.all(
        updates.map(item =>
          api.patch(`/sponsors/${item.id}/order`, { order: item.order })
        )
      );
      return reorderData;
    },
    onMutate: async (reorderData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.sponsorsAdmin });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(QUERY_KEYS.sponsorsAdmin);

      // Optimistically update to the new value
      if (previousData) {
        const updates = Array.isArray(reorderData) 
          ? reorderData 
          : [...(reorderData.sponsors || []), ...(reorderData.partners || [])];
        
        const optimisticSponsors = previousData.sponsors.map(sponsor => {
          const update = updates.find(u => u.id === sponsor._id);
          return update ? { ...sponsor, order: update.order } : sponsor;
        }).sort((a, b) => (a.order || 0) - (b.order || 0));

        const optimisticPartners = previousData.partners.map(partner => {
          const update = updates.find(u => u.id === partner._id);
          return update ? { ...partner, order: update.order } : partner;
        }).sort((a, b) => (a.order || 0) - (b.order || 0));

        queryClient.setQueryData(QUERY_KEYS.sponsorsAdmin, {
          ...previousData,
          sponsors: optimisticSponsors,
          partners: optimisticPartners
        });
      }

      return { previousData };
    },
    onError: (err, reorderData, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(QUERY_KEYS.sponsorsAdmin, context.previousData);
      }
      handleError(err);
    },
    onSuccess: () => {
      // Show success message
      import('react-hot-toast').then(({ toast }) => {
        toast.success('Order updated successfully');
      });
    },
    onSettled: () => {
      // Always refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.sponsors });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.sponsorsActive });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.sponsorsAdmin });
    },
  });
};

export { QUERY_KEYS };