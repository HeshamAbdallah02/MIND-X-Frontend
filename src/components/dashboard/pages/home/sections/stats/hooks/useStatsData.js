// frontend/src/components/dashboard/pages/home/sections/stats/hooks/useStatsData.js
import { 
  useAdminStats, 
  useCreateStat, 
  useUpdateStat, 
  useDeleteStat 
} from '../../../../../../../hooks/queries/useStatsData';

const useStatsData = () => {
  const { 
    data: stats = [], 
    isLoading: loading, 
    error, 
    refetch: mutate 
  } = useAdminStats();
  
  const createStat = useCreateStat();
  const updateStat = useUpdateStat();
  const deleteStat = useDeleteStat();
  
  return {
    stats,
    loading,
    error: error?.message || null,
    mutate,
    createStat,
    updateStat,
    deleteStat
  };
};

export default useStatsData;