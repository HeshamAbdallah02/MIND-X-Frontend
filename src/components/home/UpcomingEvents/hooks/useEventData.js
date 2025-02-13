// frontend/src/hooks/useEventData.js
import { useState, useEffect } from 'react';
import api from '../../../../utils/api';

const CACHE_KEY = 'events_cache';
const CACHE_TIMEOUT = 5 * 60 * 1000; // 5 minutes

const useEventData = () => {
  const [state, setState] = useState({
    events: [],
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
            events: JSON.parse(cachedData),
            loading: false,
            error: null
          });
          return;
        }

        setState(prev => ({ ...prev, loading: true }));
        
        const response = await api.get('/events');
        const sortedEvents = response.data.sort((a, b) => a.order - b.order);
        
        localStorage.setItem(CACHE_KEY, JSON.stringify(sortedEvents));
        localStorage.setItem(`${CACHE_KEY}_time`, Date.now());
        
        setState({
          events: sortedEvents,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Event fetch error:', error);
        setState({
          events: [],
          loading: false,
          error: error.response?.data?.message || 'Failed to load events'
        });
      }
    };

    fetchData();
    
    // Cache cleanup on unmount
    return () => {
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(`${CACHE_KEY}_time`);
    };
  }, []);

  return state;
};

export default useEventData;