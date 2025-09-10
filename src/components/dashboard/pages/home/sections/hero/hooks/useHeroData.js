// frontend/src/components/dashboard/pages/home/sections/hero/hooks/useHeroData.js
import { 
  useHeroContents, 
  useDeleteHeroContent, 
  useReorderHeroContents 
} from '../../../../../../../hooks/queries/useHeroData';

const useHeroData = () => {
  const { 
    data: contents = [],
    isLoading, 
    refetch: fetchContents 
  } = useHeroContents();
  
  const deleteContentMutation = useDeleteHeroContent();
  const reorderMutation = useReorderHeroContents();
  
  const deleteContent = async (contentId) => {
    deleteContentMutation.mutate(contentId, {
      onSuccess: () => {
        import('react-hot-toast').then(({ toast }) => {
          toast.success('Content deleted successfully');
        });
      }
    });
  };

  const updateOrder = (reorderedContents) => {
    // Find which item was moved and to what position
    const originalContents = contents;
    
    // Find the item that was moved by comparing positions
    let movedItemId = null;
    let newIndex = -1;
    
    for (let i = 0; i < reorderedContents.length; i++) {
      if (originalContents[i]?._id !== reorderedContents[i]._id) {
        // Found the first position where items differ
        movedItemId = reorderedContents[i]._id;
        newIndex = i;
        break;
      }
    }
    
    if (movedItemId && newIndex >= 0) {
      reorderMutation.mutate({
        contentId: movedItemId,
        newIndex: newIndex,
        optimisticContents: reorderedContents
      });
    }
  };

  return {
    contents,
    isLoading,
    fetchContents,
    deleteContent,
    updateOrder,
    isReordering: reorderMutation.isPending
  };
};

export default useHeroData;