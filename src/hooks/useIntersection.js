import { useEffect, useRef, useState } from 'react';

const useIntersection = (options = {}) => {
  const ref = useRef();
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, {
      rootMargin: '0px 0px -15% 0px',
      threshold: 0.15,
      ...options
    });

    if (ref.current) observer.observe(ref.current);
    
    return () => observer.disconnect();
  }, [options]);

  return [ref, isIntersecting];
};

export default useIntersection;