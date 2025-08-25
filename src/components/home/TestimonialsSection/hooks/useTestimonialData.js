// frontend/src/components/home/TestimonialsSection/hooks/useTestimonialData.js
import { useActiveTestimonials } from '../../../../hooks/queries/useTestimonialsData';

const useTestimonialData = () => {
  const { data: testimonials = [], isLoading: loading, error } = useActiveTestimonials();
  
  return {
    testimonials,
    loading,
    error: error?.message || null
  };
};

export default useTestimonialData;