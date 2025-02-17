// frontend/src/components/home/StatsSection/hooks/useStatsData.js
import { useState, useEffect } from 'react';
import api from '../../../../utils/api';

const useStatsData = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading };
};

export default useStatsData;