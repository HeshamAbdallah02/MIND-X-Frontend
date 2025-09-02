//frontend/src/hooks/useTimelineQueries.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { timelinePhasesAPI } from '../services/adminTimelineAPI';

// Timeline Phases Hook for Our Story Journey
export const useTimelinePhases = () => {
  return useQuery({
    queryKey: ['journeyTimelinePhases'],
    queryFn: timelinePhasesAPI.getAllPhases, // This gets all phases from the phases API
    staleTime: 30000,
  });
};

// Timeline Mutations Hook
export const useTimelineMutations = () => {
  const queryClient = useQueryClient();

  const createPhaseMutation = useMutation({
    mutationFn: (phaseData) => {
      // Add a default section ID since we're working with a single timeline
      const dataWithSection = {
        ...phaseData,
        sectionId: 'default-journey-section' // We'll create this default section
      };
      return timelinePhasesAPI.createPhase(dataWithSection);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['journeyTimelinePhases']);
      toast.success('Timeline phase created successfully!');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to create phase');
    },
  });

  const updatePhaseMutation = useMutation({
    mutationFn: ({ id, data }) => timelinePhasesAPI.updatePhase(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['journeyTimelinePhases']);
      toast.success('Timeline phase updated successfully!');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to update phase');
    },
  });

  const deletePhaseMutation = useMutation({
    mutationFn: (id) => timelinePhasesAPI.deletePhase(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['journeyTimelinePhases']);
      toast.success('Timeline phase deleted successfully!');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to delete phase');
    },
  });

  const reorderPhasesMutation = useMutation({
    mutationFn: ({ sectionId, phases }) => {
      // Convert phases to the format expected by the API
      const orderedIds = phases.map((phase, index) => ({
        id: phase.id,
        order: index + 1
      }));
      return timelinePhasesAPI.reorderPhases(sectionId, orderedIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['journeyTimelinePhases']);
      toast.success('Timeline phases reordered successfully!');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to reorder phases');
    },
  });

  const uploadPhaseImageMutation = useMutation({
    mutationFn: ({ phaseId, file }) => timelinePhasesAPI.uploadPhaseImage(phaseId, file),
    onSuccess: () => {
      queryClient.invalidateQueries(['journeyTimelinePhases']);
      toast.success('Image uploaded successfully!');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to upload image');
    },
  });

  const deletePhaseImageMutation = useMutation({
    mutationFn: (phaseId) => timelinePhasesAPI.deletePhaseImage(phaseId),
    onSuccess: () => {
      queryClient.invalidateQueries(['journeyTimelinePhases']);
      toast.success('Image removed successfully!');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to remove image');
    },
  });

  return {
    createPhaseMutation,
    updatePhaseMutation,
    deletePhaseMutation,
    reorderPhasesMutation,
    uploadPhaseImageMutation,
    deletePhaseImageMutation
  };
};
