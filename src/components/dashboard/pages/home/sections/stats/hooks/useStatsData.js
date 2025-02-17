// frontend/src/components/dashboard/pages/home/sections/stats/hooks/useStatsData.js
import useSWR from 'swr';
import api from '../../../../../../../utils/api';

const fetcher = url => api.get(url).then(res => res.data);

const useStatsData = () => {
  const { data, error, mutate } = useSWR('/stats', fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false
  });

  return {
    stats: data,
    loading: !data && !error,
    error,
    mutate
  };
};

export default useStatsData;