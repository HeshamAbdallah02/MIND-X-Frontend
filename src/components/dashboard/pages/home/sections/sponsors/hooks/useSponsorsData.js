// frontend/src/components/dashboard/pages/home/sections/sponsors/hooks/useSponsorsData.js
import useSWR from 'swr';
import api from '../../../../../../../utils/api';

const fetcher = url => api.get(url).then(res => res.data);

const useSponsorsData = () => {
  const { data, error, mutate } = useSWR('/sponsors', fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false
  });

  return {
    sponsors: data?.filter(s => s.type === 'sponsor') || [],
    partners: data?.filter(s => s.type === 'partner') || [],
    loading: !data && !error,
    error,
    mutate
  };
};

export default useSponsorsData;
