// frontend/src/components/dashboard/pages/home/sections/testimonials/hooks/useTestimonialsData.js
import { useAdminTestimonials } from '../../../../../../../hooks/queries/useTestimonialsData';

const useTestimonialsData = () => {
  const { 
    data: testimonials = [], 
    isLoading, 
    error, 
    refetch: mutate 
  } = useAdminTestimonials();
  
  return {
    testimonials,
    isLoading,
    error,
    mutate
  };
};

export default useTestimonialsData;