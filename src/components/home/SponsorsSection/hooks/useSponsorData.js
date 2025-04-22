//frontend/src/components/home/SponsorsSection/hooks/useSponsorData.js
import { useQuery } from '@tanstack/react-query';
import api from '../../../../utils/api';
import { useErrorHandler } from '../../../../hooks/useErrorHandler';

const fetchSponsors = async () => {
  try {
    const { data } = await api.get('/sponsors/active');
    return data;
  } catch (error) {
    throw new Error(`Failed to fetch sponsors: ${error.response?.data?.message || error.message}`);
  }
};

export const useSponsorData = () => {
  const handleError = useErrorHandler();
  
  return useQuery({
    queryKey: ['sponsors'],
    queryFn: async () => {
      try {
        return await fetchSponsors();
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error.message.includes(401)) return false;
      return failureCount < 2;
    },
    refetchOnWindowFocus: false
  });
};