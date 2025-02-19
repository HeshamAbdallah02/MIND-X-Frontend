// frontend/src/components/home/TestimonialsSection/hooks/useTestimonialData.js
import { useState, useEffect } from 'react';
import api from '../../../../utils/api';

const CACHE_KEY = 'testimonials_cache';
const CACHE_TIMEOUT = 5 * 60 * 1000; // 5 minutes

const useTestimonialData = () => {
  const [state, setState] = useState({
    testimonials: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        const cachedTime = localStorage.getItem(`${CACHE_KEY}_time`);
        
        if (cachedData && cachedTime && Date.now() - cachedTime < CACHE_TIMEOUT) {
          setState({
            testimonials: JSON.parse(cachedData),
            loading: false,
            error: null
          });
          return;
        }

        setState(prev => ({ ...prev, loading: true }));
        
        const response = await api.get('/testimonials/active');
        const sortedTestimonials = response.data.sort((a, b) => a.order - b.order);
        
        localStorage.setItem(CACHE_KEY, JSON.stringify(sortedTestimonials));
        localStorage.setItem(`${CACHE_KEY}_time`, Date.now());
        
        setState({
          testimonials: sortedTestimonials,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Testimonials fetch error:', error);
        setState({
          testimonials: [],
          loading: false,
          error: error.response?.data?.message || 'Failed to load testimonials'
        });
      }
    };

    fetchData();
    
    return () => {
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(`${CACHE_KEY}_time`);
    };
  }, []);

  return state;
};

export default useTestimonialData;