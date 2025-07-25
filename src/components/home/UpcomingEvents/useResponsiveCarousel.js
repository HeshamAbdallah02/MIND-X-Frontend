// frontend/src/components/home/UpcomingEvents/useResponsiveCarousel.js
import { useState, useEffect } from 'react';

/**
 * Custom hook for managing responsive carousel behavior
 */
function useResponsiveCarousel() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if we're on mobile initially
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    checkMobile();

    // Add resize listener
    window.addEventListener('resize', checkMobile);

    // Clean up
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Always navigate by 1 for natural movement
  const getNavIncrement = () => 1;

  return {
    isMobile,
    getNavIncrement
  };
}

export default useResponsiveCarousel;
