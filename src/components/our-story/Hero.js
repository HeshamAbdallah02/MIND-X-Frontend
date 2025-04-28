//frontend/src/components/our-story/Hero.js
import React from 'react';
import { useIntersection } from '../../hooks/useIntersection';

const Hero = () => {
  const [ref, isVisible] = useIntersection({ 
    threshold: 0.2,
    triggerOnce: true 
  });

  return (
    <div 
      ref={ref}
      className="relative bg-gray-800 text-white h-[500px] flex items-center justify-center"
      data-visible={isVisible.toString()}
    >
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ 
          backgroundImage: `url(${process.env.PUBLIC_URL + '/lovable-uploads/20090ad9-0450-46aa-9ab9-258a84b4af81.png'})`,
          backgroundPosition: 'center 25%'
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 text-center">
        <h1 className="text-5xl font-bold mb-4 transition-all duration-700 opacity-0 translate-y-8" style={{ 
          opacity: isVisible ? 1 : 0, 
          transform: isVisible ? 'translateY(0)' : 'translateY(2rem)',
          transitionDelay: '200ms'
        }}>
          Our Story
        </h1>
        <p className="text-xl max-w-lg mx-auto mb-12 transition-all duration-700 opacity-0 translate-y-8" style={{ 
          opacity: isVisible ? 1 : 0, 
          transform: isVisible ? 'translateY(0)' : 'translateY(2rem)',
          transitionDelay: '400ms'
        }}>
          From Day One to Today: Our Journey
        </p>
        
        {/* Scroll down arrow */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Hero;