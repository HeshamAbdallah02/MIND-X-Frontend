// frontend/src/components/shared/SectionTitle.js
import React from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const SectionTitle = React.memo(({ children, className = '' }) => {
  const ref = useScrollAnimation((isVisible) => {}, { 
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  return (
    <h2 
      ref={ref}
      className={`text-3xl md:text-4xl font-semibold text-[#606161] text-center mb-12 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] ${className}`}
      style={{ 
        willChange: 'transform, opacity',
        transitionDelay: '150ms' 
      }}
    >
      {children}
    </h2>
  );
});

export default SectionTitle;