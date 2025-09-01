//frontend/src/components/our-story/OurJourney/hooks/useScrollProgress.js
import { useState, useEffect, useRef, useCallback } from 'react';

export const useScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const timelineRef = useRef(null);
  const lastProgressRef = useRef(0);

  const handleScroll = useCallback(() => {
    if (!timelineRef.current) return;

    const element = timelineRef.current;
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Calculate how much of the timeline is visible
    const elementTop = rect.top;
    const elementHeight = rect.height;
    
    // Timeline starts being "active" when it's 80% visible from bottom
    const startOffset = windowHeight * 0.8;
    
    let newProgress = 0;
    
    if (elementTop <= startOffset && elementTop + elementHeight >= 0) {
      // Calculate progress (0 to 1)
      const visibleHeight = Math.min(
        startOffset - elementTop, 
        elementHeight,
        windowHeight + elementHeight
      );
      newProgress = Math.max(0, Math.min(1, visibleHeight / elementHeight));
    } else if (elementTop > startOffset) {
      newProgress = 0;
    } else {
      newProgress = 1;
    }

    // Only update if change is significant (>1% change) to prevent infinite loops
    const progressDiff = Math.abs(lastProgressRef.current - newProgress);
    if (progressDiff > 0.01) {
      lastProgressRef.current = newProgress;
      setScrollProgress(newProgress);
    }
  }, []);

  useEffect(() => {
    // Throttle scroll events for performance
    let throttleTimer = null;
    const throttledScroll = () => {
      if (throttleTimer) return;
      throttleTimer = setTimeout(() => {
        handleScroll();
        throttleTimer = null;
      }, 16); // ~60fps
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    // Initial calculation
    setTimeout(handleScroll, 100); // Delay initial calculation to avoid issues

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      window.removeEventListener('resize', handleScroll);
      if (throttleTimer) {
        clearTimeout(throttleTimer);
      }
    };
  }, [handleScroll]);

  return { scrollProgress, timelineRef };
};
