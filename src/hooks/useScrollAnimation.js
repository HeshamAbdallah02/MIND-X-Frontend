// frontend/src/hooks/useScrollAnimation.js
import { useEffect, useRef } from 'react';
import { useIntersectionSystem } from '../context/IntersectionObserverContext';

export const useScrollAnimation = (effect, options = {}) => {
  const ref = useRef();
  const { register } = useIntersectionSystem();

  useEffect(() => {
    if (!ref.current) return;

    const cleanup = register(ref.current, (entry) => {
      effect(entry.isIntersecting);
    }, { 
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px',
      ...options 
    });

    return cleanup;
  }, [register, effect, options]);

  return ref;
};