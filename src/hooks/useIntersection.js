// frontend/src/hooks/useIntersection.js
import { useEffect, useRef, useState } from 'react';
import { useIntersectionSystem } from '../context/IntersectionObserverContext';

export const useIntersection = (options = {}) => {
  const ref = useRef();
  const { register } = useIntersectionSystem();
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observedRef = useRef(false);

  useEffect(() => {
    if (!ref.current || observedRef.current) return;

    const cleanup = register(ref.current, (entry) => {
      if (!observedRef.current) {
        setIsIntersecting(entry.isIntersecting);
        if (options.triggerOnce && entry.isIntersecting) {
          observedRef.current = true;
        }
      }
    }, options);

    return () => {
      cleanup?.();
      observedRef.current = false;
    };
  }, [register, options]);

  return [ref, isIntersecting];
};