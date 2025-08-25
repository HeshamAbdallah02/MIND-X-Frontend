// frontend/src/components/home/StatsSection/hooks/useStatsData.js
import { useStats } from '../../../../hooks/queries/useStatsData';

const useStatsData = () => {
  const { data: stats, isLoading: loading, error } = useStats();
  
  return {
    stats: stats || [],
    loading,
    error: error?.message || null
  };
};

export default useStatsData;