// frontend/src/components/dashboard/pages/home/sections/testimonials/hooks/useTestimonialsData.js
import useSWR from 'swr';
import api from '../../../../../../../utils/api';

const fetcher = url => api.get(url).then(res => res.data);

const useTestimonialsData = () => {
  const { data, error, mutate } = useSWR('/testimonials', fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false
  });

  return {
    testimonials: data,
    loading: !data && !error,
    error,
    mutate
  };
};

export default useTestimonialsData;