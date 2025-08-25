// frontend/src/components/home/SponsorsSection/LogoScroller.js
import React, { useRef, useEffect, useCallback, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

const LogoScroller = ({ items = [], speed = 80 }) => {
  // Duplicate items for seamless scrolling
  const duplicatedItems = useMemo(() => {
    if (!items.length) return [];
    return [...items, ...items, ...items];
  }, [items]);

  const containerRef = useRef(null);
  const scrollerRef = useRef(null);
  const [scrollerWidth, setScrollerWidth] = useState(0);
  const animationRef = useRef({});
  const scrollPositionRef = useRef(0);
  const isPausedRef = useRef(false);
  const frameRef = useRef(null);

  // Measure container width and calculate total scroller width
  const measureWidths = useCallback(() => {
    if (!containerRef.current || !scrollerRef.current || items.length === 0) return;
    const firstChild = scrollerRef.current.firstElementChild;
    if (firstChild) {
      const itemWidth = firstChild.offsetWidth + 128; // Updated to match mx-16 (64px margin each side = 128px total)
      setScrollerWidth(itemWidth * items.length);
    }
  }, [items.length]);

  useEffect(() => {
    measureWidths();
    const resizeObserver = new ResizeObserver(() => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(measureWidths);
    });
    const currentContainer = containerRef.current;
    if (currentContainer) {
      resizeObserver.observe(currentContainer);
    }
    return () => {
      resizeObserver.disconnect();
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [measureWidths, items]);

  // Animation loop
  const animateScroll = useCallback(() => {
    if (!scrollerRef.current || !scrollerWidth) return;
    const timestamp = performance.now();
    const pixelsPerMS = speed / 1000;

    if (!animationRef.current.lastTimestamp) {
      animationRef.current.lastTimestamp = timestamp;
      animationRef.current.frameId = requestAnimationFrame(animateScroll);
      return;
    }

    const elapsed = Math.min(timestamp - animationRef.current.lastTimestamp, 16);
    animationRef.current.lastTimestamp = timestamp;

    if (!isPausedRef.current) {
      scrollPositionRef.current += pixelsPerMS * elapsed;
      scrollPositionRef.current = scrollPositionRef.current % scrollerWidth;

      const pixelPosition = Math.round(scrollPositionRef.current * 10) / 10;
      scrollerRef.current.style.transform = `translate3d(-${pixelPosition}px, 0, 0)`;
    }

    animationRef.current.frameId = requestAnimationFrame(animateScroll);
  }, [scrollerWidth, speed]);

  useEffect(() => {
    if (!scrollerRef.current || items.length === 0 || !scrollerWidth) return;
    if (animationRef.current.frameId) {
      cancelAnimationFrame(animationRef.current.frameId);
    }
    animationRef.current = { frameId: null, lastTimestamp: null };
    animationRef.current.frameId = requestAnimationFrame(animateScroll);
    return () => {
      if (animationRef.current.frameId) {
        cancelAnimationFrame(animationRef.current.frameId);
      }
    };
  }, [animateScroll, items.length, scrollerWidth]);

  // Pause on document hidden
  useEffect(() => {
    const handleDocVisibility = () => {
      isPausedRef.current = document.hidden;
      if (!document.hidden && animationRef.current) {
        animationRef.current.lastTimestamp = null;
      }
    };
    document.addEventListener('visibilitychange', handleDocVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleDocVisibility);
    };
  }, []);

  // Pause on hover or touch
  useEffect(() => {
    const handleMouseEnter = () => {
      isPausedRef.current = true;
    };
    const handleMouseLeave = () => {
      isPausedRef.current = false;
      animationRef.current.lastTimestamp = null;
    };

    const scroller = scrollerRef.current;
    if (scroller) {
      scroller.addEventListener('mouseenter', handleMouseEnter);
      scroller.addEventListener('mouseleave', handleMouseLeave);
      scroller.addEventListener('touchstart', handleMouseEnter);
      scroller.addEventListener('touchend', handleMouseLeave);
    }

    return () => {
      if (scroller) {
        scroller.removeEventListener('mouseenter', handleMouseEnter);
        scroller.removeEventListener('mouseleave', handleMouseLeave);
        scroller.removeEventListener('touchstart', handleMouseEnter);
        scroller.removeEventListener('touchend', handleMouseLeave);
      }
    };
  }, []);

  // Render items
  const renderLogoItem = useCallback(({ scrollKey, ...item }, index) => {
    return (
      <div
        key={scrollKey || `${item._id}-${index}`}
        className="logo-scroller-item group mx-16 flex-shrink-0 w-32 h-32 flex items-center justify-center"
      >
        <a
          href={item.website}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-full flex items-center justify-center"
        >
          {item.logo?.url && (
            <img
              src={item.logo.url}
              alt={item.name}
              className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
          )}
          <div
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap px-3 py-1 rounded-md shadow-lg text-sm"
            style={{
              backgroundColor: '#ffffff',
              color: '#606161'
            }}
          >
            {item.name}
          </div>
        </a>
      </div>
    );
  }, []);

  return (
    <div ref={containerRef} className="overflow-hidden relative w-full">
      <div
        ref={scrollerRef}
        className="logo-scroller-track"
        style={{ animationDuration: `${speed}s` }}
      >
        {duplicatedItems.map((item, index) => renderLogoItem(item, index))}
      </div>
    </div>
  );
};

LogoScroller.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      website: PropTypes.string.isRequired,
      logo: PropTypes.shape({
        url: PropTypes.string.isRequired,
        alt: PropTypes.string
      }).isRequired
    })
  ).isRequired,
  speed: PropTypes.number
};

export default React.memo(LogoScroller);