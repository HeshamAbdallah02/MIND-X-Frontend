// frontend/src/components/our-story/AwardsSection/components/AwardsBackground.js
import React, { useState, useEffect, useRef } from 'react';
import { useAwardsSettings } from '../hooks/useAwardsData';

const AwardsBackground = ({ children }) => {
  const { data: settings } = useAwardsSettings();
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef(null);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.pageYOffset;
      const sectionElement = sectionRef.current;
      
      if (sectionElement) {
        const sectionRect = sectionElement.getBoundingClientRect();
        const sectionTop = scrollPosition + sectionRect.top;
        const sectionHeight = sectionRect.height;
        
        // Only apply parallax when section is in viewport
        if (scrollPosition < sectionTop + sectionHeight && scrollPosition + window.innerHeight > sectionTop) {
          // Calculate parallax offset (slower movement than scroll)
          const parallaxSpeed = 0.3; // Subtle parallax effect
          const yPos = (scrollPosition - sectionTop) * parallaxSpeed;
          setScrollY(yPos);
        }
      }
    };

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial calculation
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const backgroundImage = settings?.backgroundImage?.url || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop&crop=center';
  const showOverlay = settings?.backgroundImage?.overlay !== undefined ? settings.backgroundImage.overlay : true;
  const overlayOpacity = settings?.backgroundImage?.opacity || 0.3;

  return (
    <div ref={sectionRef} className="relative overflow-hidden">
      {/* Background Image with Parallax */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            transform: `translateY(${scrollY}px)`,
            willChange: 'transform'
          }}
        >
          <img
            src={backgroundImage}
            alt="Awards section background"
            className="w-full h-full object-cover scale-110" // Scale up to prevent white gaps during parallax
            loading="lazy"
          />
        </div>
      )}

      {/* Background Overlay */}
      {showOverlay && (
        <div 
          className="absolute inset-0 bg-gray-900"
          style={{
            opacity: overlayOpacity,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AwardsBackground;
