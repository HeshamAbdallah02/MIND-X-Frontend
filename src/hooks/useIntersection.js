// frontend/src/hooks/useIntersection.js
import { useEffect, useRef, useState } from 'react';

const useIntersection = (options = {}) => {
  const ref = useRef();
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerRef = useRef(null);
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (hasTriggered.current || !ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasTriggered.current) {
        setIsIntersecting(true);
        hasTriggered.current = true;
        
        // Cleanup immediately after first intersection
        if (observerRef.current && ref.current) {
          observerRef.current.unobserve(ref.current);
          observerRef.current.disconnect();
        }
      }
    }, {
      rootMargin: '0px 0px -15% 0px',
      threshold: 0.15,
      ...options
    });

    observerRef.current = observer;
    observer.observe(ref.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [options]);

  return [ref, isIntersecting];
};

export default useIntersection;