// frontend/src/components/home/Events/EventsCarousel.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import EventCard from './EventCard';
import NavigationButton from './NavigationButton';
import useEventData from './hooks/useEventData';
import useResponsiveCarousel from './useResponsiveCarousel';

const EventsCarousel = ({ animate }) => {
  const { events, loading } = useEventData();
  const { isMobile, getNavIncrement } = useResponsiveCarousel();
  const [virtualIndex, setVirtualIndex] = useState(2); // Start at original items
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [autoScrollPaused, setAutoScrollPaused] = useState(false);
  const containerRef = useRef(null);
  const isTransitioning = useRef(false);
  const intervalRef = useRef(null);
  const isMountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Clone events for infinite loop (front: 2 items, back: 2 items)
  const totalEvents = events?.length || 0;
  const clonedEvents = totalEvents > 0 ? [
    ...events.slice(-2),
    ...events,
    ...events.slice(0, 2)
  ] : [];

  // Normalized index calculation
  // const normalizedIndex = useCallback((index) => {
  //   return ((index - 2) % totalEvents + totalEvents) % totalEvents;
  // }, [totalEvents]);

  // Handle index reset after transition
  const handleTransitionEnd = () => {
    if (!totalEvents) return;
    
    if (virtualIndex <= 1) {
      setTransitionEnabled(false);
      setVirtualIndex(virtualIndex + totalEvents);
    } else if (virtualIndex >= clonedEvents.length - 2) {
      setTransitionEnabled(false);
      setVirtualIndex(virtualIndex - totalEvents);
    }
    isTransitioning.current = false;
  };

  // Navigation handler with momentum effect
  const navigate = useCallback((direction) => {
    if (totalEvents < 3 || isTransitioning.current || !isMountedRef.current) return;
    
    isTransitioning.current = true;
    setTransitionEnabled(true);
    const increment = getNavIncrement();
    setVirtualIndex(prev => direction === 'next' ? prev + increment : prev - increment);
  }, [totalEvents, getNavIncrement]);

  // Optimized auto-scroll with proper cleanup
  useEffect(() => {
    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (totalEvents < 3 || autoScrollPaused) return;
    
    intervalRef.current = setInterval(() => {
      if (isMountedRef.current) {
        navigate('next');
      }
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [navigate, totalEvents, autoScrollPaused, isMobile]);

  // Reset transition after index jump
  useEffect(() => {
    if (!transitionEnabled) {
      requestAnimationFrame(() => {
        setTransitionEnabled(true);
      });
    }
  }, [transitionEnabled]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!events?.length) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] px-4">
        <div className="text-center space-y-4 max-w-lg mx-auto text-[#606161]">
          <h3 className="text-2xl font-semibold mb-2">
            Stay Tuned for Exciting Events!
          </h3>
          <p className="text-lg">
            We're crafting amazing experiences for you. 
            <span className="block mt-1 text-[#FBB859]">
              Something incredible is coming soon.
            </span>
          </p>
          <div className="text-sm mt-4 py-2 px-4 rounded-lg inline-block bg-[#81C99C] text-white">
            Join our community to be the first to know!
          </div>
        </div>
      </div>
    );
  }

    return (
        <div 
          className="relative px-4 group events-carousel"
          onMouseEnter={() => setAutoScrollPaused(true)}
          onMouseLeave={() => setAutoScrollPaused(false)}
          ref={containerRef}
        >
            {totalEvents > 3 && (
                <>
                    <NavigationButton direction="prev" onClick={() => navigate('prev')} />
                    <NavigationButton direction="next" onClick={() => navigate('next')} />
                </>
            )}
            
            <div className="overflow-hidden">
                <div
                    className="flex transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
                    style={{
                        transform: isMobile ? `translateX(calc(-${virtualIndex * 100}%))` : `translateX(calc(-${virtualIndex * (100 / 3)}%))`,
                        transition: transitionEnabled ? 'transform 400ms cubic-bezier(0.25,0.1,0.25,1)' : 'none',
                        willChange: 'transform'
                    }}
                    onTransitionEnd={handleTransitionEnd}
                >
                    {clonedEvents.map((event, index) => (
                        <div
                            key={`${event._id}-${index}`}
                            className="w-full md:w-1/3 px-2 flex-shrink-0"
                        >
                            <EventCard 
                                event={event} 
                                className="hover:shadow-xl hover:z-10" 
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EventsCarousel;