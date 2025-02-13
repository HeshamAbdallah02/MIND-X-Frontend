// src/hooks/useScrollAnimation.js
import { useEffect, useMemo } from 'react';

export const useScrollAnimation = () => {
  const observers = useMemo(() => new Map(), []);

  const register = (ref, callback, options = {}) => {
    if (!ref?.current || observers.has(ref)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback();
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px',
      ...options
    });

    observer.observe(ref.current);
    observers.set(ref, observer);
  };

  useEffect(() => {
    return () => {
      observers.forEach((observer, ref) => {
        if (ref.current) observer.unobserve(ref.current);
        observer.disconnect();
      });
    };
  }, [observers]);

  return { register };
};