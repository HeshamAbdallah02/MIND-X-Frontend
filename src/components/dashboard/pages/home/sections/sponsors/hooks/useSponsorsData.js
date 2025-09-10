// frontend/src/components/dashboard/pages/home/sections/sponsors/hooks/useSponsorsData.js
import { 
  useAdminSponsors, 
  useCreateSponsor, 
  useUpdateSponsor, 
  useDeleteSponsor,
  useReorderSponsors
} from '../../../../../../../hooks/queries/useSponsorsData';

const useSponsorsData = () => {
  const { 
    data,
    isLoading: loading, 
    error, 
    refetch: mutate 
  } = useAdminSponsors();
  
  const createSponsor = useCreateSponsor();
  const updateSponsor = useUpdateSponsor();
  const deleteSponsor = useDeleteSponsor();
  const reorderSponsors = useReorderSponsors();
  
  return {
    sponsors: data?.sponsors || [],
    partners: data?.partners || [],
    loading,
    error: error?.message || null,
    mutate,
    createSponsor,
    updateSponsor,
    deleteSponsor,
    reorderSponsors
  };
};

export default useSponsorsData;