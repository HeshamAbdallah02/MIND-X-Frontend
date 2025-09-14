// frontend/src/hooks/useSeasonsQueries.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import * as seasonsAPI from '../services/seasonsAPI';

// Get all seasons (admin)
export const useSeasons = () => {
  return useQuery({
    queryKey: ['admin-seasons'],
    queryFn: seasonsAPI.getAllSeasons,
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get season board members
export const useSeasonBoardMembers = (seasonId) => {
  return useQuery({
    queryKey: ['season-board-members', seasonId],
    queryFn: () => seasonsAPI.getBoardMembers(seasonId),
    enabled: !!seasonId,
    staleTime: 2 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};

// Get season highlights
export const useSeasonHighlights = (seasonId) => {
  return useQuery({
    queryKey: ['season-highlights', seasonId],
    queryFn: () => seasonsAPI.getHighlights(seasonId),
    enabled: !!seasonId,
    staleTime: 2 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};

// Seasons mutations hook
export const useSeasonsMutations = () => {
  const queryClient = useQueryClient();

  // Create season
  const createSeasonMutation = useMutation({
    mutationFn: seasonsAPI.createSeason,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-seasons']);
      toast.success('Season created successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create season');
    },
  });

  // Update season
  const updateSeasonMutation = useMutation({
    mutationFn: ({ id, data }) => seasonsAPI.updateSeason(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-seasons']);
      toast.success('Season updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update season');
    },
  });

  // Delete season
  const deleteSeasonMutation = useMutation({
    mutationFn: seasonsAPI.deleteSeason,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-seasons']);
      toast.success('Season deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete season');
    },
  });

  // Reorder seasons with optimistic updates
  const reorderSeasonsMutation = useMutation({
    mutationFn: seasonsAPI.reorderSeasons,
    onMutate: async (newSeasonsOrder) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(['admin-seasons']);

      // Snapshot the previous value
      const previousSeasons = queryClient.getQueryData(['admin-seasons']);

      // Optimistically update to the new value
      if (previousSeasons) {
        const optimisticSeasons = previousSeasons.map(season => {
          const updatedSeason = newSeasonsOrder.find(s => s.id === season._id);
          return updatedSeason ? { ...season, order: updatedSeason.order } : season;
        });
        queryClient.setQueryData(['admin-seasons'], optimisticSeasons);
      }

      // Return a context object with the snapshotted value
      return { previousSeasons };
    },
    onError: (err, newSeasonsOrder, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousSeasons) {
        queryClient.setQueryData(['admin-seasons'], context.previousSeasons);
      }
      toast.error(err.response?.data?.message || 'Failed to reorder seasons');
    },
    onSuccess: () => {
      toast.success('Seasons reordered successfully!');
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have latest data
      queryClient.invalidateQueries(['admin-seasons']);
    },
  });

  // Upload cover image
  const uploadCoverImageMutation = useMutation({
    mutationFn: ({ seasonId, imageFile }) => seasonsAPI.uploadCoverImage(seasonId, imageFile),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-seasons']);
      toast.success('Cover image uploaded successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to upload cover image');
    },
  });

  // Delete cover image
  const deleteCoverImageMutation = useMutation({
    mutationFn: seasonsAPI.deleteCoverImage,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-seasons']);
      toast.success('Cover image deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete cover image');
    },
  });

  // Add board member
  const addBoardMemberMutation = useMutation({
    mutationFn: ({ seasonId, memberData }) => seasonsAPI.addBoardMember(seasonId, memberData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['admin-seasons']);
      queryClient.invalidateQueries(['season-board-members', variables.seasonId]);
      toast.success('Board member added successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add board member');
    },
  });

  // Update board member
  const updateBoardMemberMutation = useMutation({
    mutationFn: ({ seasonId, memberId, memberData }) => 
      seasonsAPI.updateBoardMember(seasonId, memberId, memberData),
    onMutate: (variables) => {
      console.log('updateBoardMemberMutation starting with:', variables);
    },
    onSuccess: (data, variables) => {
      console.log('updateBoardMemberMutation success:', data);
      queryClient.invalidateQueries(['admin-seasons']);
      queryClient.invalidateQueries(['season-board-members', variables.seasonId]);
      toast.success('Board member updated successfully!');
    },
    onError: (error, variables) => {
      console.error('updateBoardMemberMutation error:', error);
      toast.error(error.response?.data?.message || 'Failed to update board member');
    },
  });

  // Delete board member
  const deleteBoardMemberMutation = useMutation({
    mutationFn: ({ seasonId, memberId }) => seasonsAPI.deleteBoardMember(seasonId, memberId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['admin-seasons']);
      queryClient.invalidateQueries(['season-board-members', variables.seasonId]);
      toast.success('Board member deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete board member');
    },
  });

  // Reorder board members
  const reorderBoardMembersMutation = useMutation({
    mutationFn: ({ seasonId, members }) => seasonsAPI.reorderBoardMembers(seasonId, members),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['admin-seasons']);
      queryClient.invalidateQueries(['season-board-members', variables.seasonId]);
      toast.success('Board members reordered successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to reorder board members');
    },
  });

  // Set leader
  const setLeaderMutation = useMutation({
    mutationFn: ({ seasonId, memberId }) => seasonsAPI.setLeader(seasonId, memberId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['admin-seasons']);
      queryClient.invalidateQueries(['season-board-members', variables.seasonId]);
      toast.success('Leader updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update leader');
    },
  });

  // Upload member avatar
  const uploadMemberAvatarMutation = useMutation({
    mutationFn: ({ seasonId, memberId, imageFile }) => 
      seasonsAPI.uploadMemberAvatar(seasonId, memberId, imageFile),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['admin-seasons']);
      queryClient.invalidateQueries(['season-board-members', variables.seasonId]);
      toast.success('Avatar uploaded successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to upload avatar');
    },
  });

  // Add highlight
  const addHighlightMutation = useMutation({
    mutationFn: ({ seasonId, highlightData }) => seasonsAPI.addHighlight(seasonId, highlightData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['admin-seasons']);
      queryClient.invalidateQueries(['season-highlights', variables.seasonId]);
      toast.success('Highlight added successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add highlight');
    },
  });

  // Update highlight
  const updateHighlightMutation = useMutation({
    mutationFn: ({ seasonId, highlightId, highlightData }) => 
      seasonsAPI.updateHighlight(seasonId, highlightId, highlightData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['admin-seasons']);
      queryClient.invalidateQueries(['season-highlights', variables.seasonId]);
      toast.success('Highlight updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update highlight');
    },
  });

  // Delete highlight
  const deleteHighlightMutation = useMutation({
    mutationFn: ({ seasonId, highlightId }) => seasonsAPI.deleteHighlight(seasonId, highlightId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['admin-seasons']);
      queryClient.invalidateQueries(['season-highlights', variables.seasonId]);
      toast.success('Highlight deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete highlight');
    },
  });

  // Reorder highlights
  const reorderHighlightsMutation = useMutation({
    mutationFn: ({ seasonId, highlights }) => seasonsAPI.reorderHighlights(seasonId, highlights),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['admin-seasons']);
      queryClient.invalidateQueries(['season-highlights', variables.seasonId]);
      toast.success('Highlights reordered successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to reorder highlights');
    },
  });

  return {
    createSeasonMutation,
    updateSeasonMutation,
    deleteSeasonMutation,
    reorderSeasonsMutation,
    uploadCoverImageMutation,
    deleteCoverImageMutation,
    // Board member mutations
    createBoardMemberMutation: addBoardMemberMutation,
    updateBoardMemberMutation,
    deleteBoardMemberMutation,
    reorderBoardMembersMutation,
    setLeaderMutation,
    uploadBoardMemberImageMutation: uploadMemberAvatarMutation,
    // Highlight mutations  
    createHighlightMutation: addHighlightMutation,
    updateHighlightMutation,
    deleteHighlightMutation,
    reorderHighlightsMutation,
    uploadHighlightImageMutation: uploadMemberAvatarMutation, // Reuse for highlights
  };
};
