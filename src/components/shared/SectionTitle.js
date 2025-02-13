import React from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const SectionTitle = React.memo(({ 
  children, 
  className = '', 
  animate = true, // Default parameter instead of defaultProps
  ...props 
}) => {
  const titleRef = React.useRef();
  const { register } = useScrollAnimation();

  React.useEffect(() => {
    register(titleRef, () => {}, { // Empty callback since animation is CSS-driven
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
  }, [register]);

  return (
    <h2 
      ref={titleRef}
      className={`text-3xl md:text-4xl font-semibold text-[#606161] text-center mb-12 
        transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] 
        ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        ${className}`}
      style={{ 
        willChange: 'transform, opacity',
        transitionDelay: '150ms' 
      }}
      {...props}
    >
      {children}
    </h2>
  );
});

export default SectionTitle;