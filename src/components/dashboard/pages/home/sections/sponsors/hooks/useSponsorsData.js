// frontend/src/components/dashboard/pages/home/sections/sponsors/hooks/useSponsorsData.js
import { 
  useAdminSponsors, 
  useCreateSponsor, 
  useUpdateSponsor, 
  useDeleteSponsor 
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
  
  return {
    sponsors: data?.sponsors || [],
    partners: data?.partners || [],
    loading,
    error: error?.message || null,
    mutate,
    createSponsor,
    updateSponsor,
    deleteSponsor
  };
};

export default useSponsorsData;