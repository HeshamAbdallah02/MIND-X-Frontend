// frontend/src/components/home/Hero/hooks/useHeroLogic.js
import { useState, useEffect, useRef, useCallback } from 'react';
import { useHeroContents } from '../../../../hooks/queries/useHeroData';

export const useHeroLogic = () => {
  const { data: contents = [], isLoading, error } = useHeroContents();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRefs = useRef({});
  const timeoutRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleNext = useCallback(() => {
    if (!isMountedRef.current) return;
    
    setIsTransitioning(true);
    const videoElement = videoRefs.current[contents[currentIndex]?._id];
    if (videoElement) {
      videoElement.pause();
    }
    
    timeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setCurrentIndex((prev) => (prev + 1) % contents.length);
        setIsTransitioning(false);
      }
    }, 300);
  }, [currentIndex, contents]);

  useEffect(() => {
    if (contents.length === 0 || !isMountedRef.current) return;
  
    const content = contents[currentIndex];
    
    if (content?.mediaType === 'image') {
      timeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          handleNext();
        }
      }, 5000);
    }
  
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIndex, contents, handleNext]);

  const handleDotClick = useCallback((index) => {
    if (index === currentIndex || isTransitioning) return;

    setIsTransitioning(true);
    const videoElement = videoRefs.current[contents[currentIndex]?._id];
    if (videoElement) {
      videoElement.pause();
    }

    timeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setCurrentIndex(index);
        setIsTransitioning(false);
      }
    }, 300);
  }, [currentIndex, contents, isTransitioning]);

  const handleVideoEnd = useCallback(() => {
    handleNext();
  }, [handleNext]);

  return {
    contents,
    isLoading,
    error,
    currentIndex,
    isTransitioning,
    videoRefs,
    handleNext,
    handleDotClick,
    handleVideoEnd,
    isMountedRef,
    timeoutRef
  };
};
