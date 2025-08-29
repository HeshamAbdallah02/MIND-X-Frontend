// frontend/src/components/our-story/HeroSection/index.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { useSettings } from '../../../context/BrandSettingsContext';
import { useStoryHero } from '../../../hooks/queries/useStoryHeroData';

const HeroSection = ({ onScrollToNext }) => {
  const { settings } = useSettings();
  const { data: heroData, isLoading, error } = useStoryHero();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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
    if (!isMountedRef.current || !heroData?.images?.length) return;
    
    // Instead of using the jarring isTransitioning state, 
    // let the CSS transitions handle the smooth crossfade
    setCurrentImageIndex((prev) => (prev + 1) % heroData.images.length);
  }, [heroData?.images?.length]);

  // Auto-scroll through background images
  useEffect(() => {
    if (!heroData?.images?.length || heroData.images.length <= 1 || !isMountedRef.current) return;

    timeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        handleNext();
      }
    }, heroData.autoScrollSpeed || 5000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentImageIndex, heroData?.autoScrollSpeed, heroData?.images?.length, handleNext]);

  // Handle scroll to next section
  const handleScrollDown = () => {
    if (onScrollToNext) {
      onScrollToNext();
    }
  };

  // Fallback data for development
  const fallbackData = {
    headline: "Our Story",
    hookLine: "From Day One to Today: Our Journey",
    autoScrollSpeed: 5000,
    showIndicators: false,
    images: [
      {
        _id: 'fallback-1',
        url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
        alt: 'Modern building architecture'
      }
    ]
  };

  const activeHeroData = heroData || fallbackData;
  const heroColors = settings?.storyHeroColors || {
    headlineColor: '#ffffff',
    headlineSize: 'text-5xl md:text-6xl',
    hookLineColor: '#f0f0f0', 
    hookLineSize: 'text-lg md:text-xl',
    overlayColor: 'rgba(0, 0, 0, 0.4)',
    overlayOpacity: 0.4,
    arrowBackground: 'rgba(255, 255, 255, 0.2)',
    arrowColor: '#ffffff',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
    fallbackBackground: '#f5f5f5'
  };

  // Loading state
  if (isLoading) {
    return (
      <section className="relative w-full overflow-hidden bg-black flex items-center justify-center" style={{ height: 'calc(100vh - 64px)' }}>
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#FBB859]"></div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="relative w-full overflow-hidden bg-black flex items-center justify-center" style={{ height: 'calc(100vh - 64px)' }}>
        <div className="text-white text-xl">Failed to load story hero content</div>
      </section>
    );
  }

  // No content state - show fallback
  if (!activeHeroData?.images?.length) {
    return (
      <section 
        className="relative w-full overflow-hidden flex items-center justify-center"
        style={{ 
          backgroundColor: heroColors.fallbackBackground,
          height: 'calc(100vh - 64px)'
        }}
      >
        <div className="text-center text-gray-600">
          <h1 className="text-4xl font-bold mb-4">Our Story</h1>
          <p className="text-lg">Hero content will be configured from the dashboard</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full overflow-hidden bg-black md:h-[calc(100vh-64px)]">
      {/* Desktop: Full viewport background images - UNCHANGED */}
      <div className="hidden md:block absolute inset-0 w-full h-full">
        {activeHeroData.images.map((image, index) => (
          <div
            key={image._id || index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-[2000ms] ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              zIndex: index === currentImageIndex ? 2 : 1
            }}
          >
            <img
              src={image.url}
              alt={image.alt || `Story hero background ${index + 1}`}
              className="w-full h-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
              style={{
                transform: index === currentImageIndex ? 'scale(1)' : 'scale(1.05)',
                transition: 'transform 8000ms ease-out, opacity 2000ms ease-in-out'
              }}
            />
          </div>
        ))}
        
        {/* Desktop Overlay */}
        <div 
          className="absolute inset-0 w-full h-full z-10"
          style={{ 
            backgroundColor: heroColors.overlayColor,
            opacity: heroColors.overlayOpacity
          }}
        />
      </div>

      {/* Mobile: Maintain aspect ratio but show full image */}
      <div className="md:hidden relative w-full aspect-[4/3]">
        {activeHeroData.images.length > 0 && (
          <div className="absolute inset-0 w-full h-full">
            <img
              src={activeHeroData.images[currentImageIndex]?.url}
              alt={activeHeroData.images[currentImageIndex]?.alt || `Story hero background ${currentImageIndex + 1}`}
              className="w-full h-full object-cover transition-all duration-[2000ms] ease-in-out"
              loading="eager"
              style={{
                transform: currentImageIndex >= 0 ? 'scale(1)' : 'scale(1.05)',
                transition: 'transform 3000ms ease-out, opacity 2000ms ease-in-out'
              }}
            />
          </div>
        )}
        
        {/* Mobile Overlay */}
        <div 
          className="absolute inset-0 w-full h-full z-10"
          style={{ 
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.7) 100%)'
          }}
        />

        {/* Mobile Content */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="w-full max-w-sm mx-auto px-6 text-center">
            {/* Mobile Headline */}
            {activeHeroData?.headline && (
              <h1 
                className="text-3xl sm:text-4xl font-bold mb-4 leading-tight text-white"
                style={{
                  textShadow: '2px 2px 8px rgba(0,0,0,0.8)'
                }}
              >
                {activeHeroData.headline}
              </h1>
            )}

            {/* Mobile Hook Line */}
            {activeHeroData?.hookLine && (
              <p 
                className="text-base sm:text-lg leading-relaxed text-white opacity-90"
                style={{
                  textShadow: '1px 1px 6px rgba(0,0,0,0.8)'
                }}
              >
                {activeHeroData.hookLine}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Content Container - UNCHANGED */}
      <div className="hidden md:flex relative w-full h-full items-center justify-center z-20">
        <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Desktop Headline */}
            {activeHeroData?.headline && (
              <h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight"
                style={{
                  color: heroColors.headlineColor,
                  textShadow: heroColors.textShadow
                }}
              >
                {activeHeroData.headline}
              </h1>
            )}

            {/* Desktop Hook Line */}
            {activeHeroData?.hookLine && (
              <p 
                className="text-lg md:text-xl mb-8 md:mb-12 leading-relaxed max-w-2xl mx-auto"
                style={{
                  color: heroColors.hookLineColor,
                  textShadow: heroColors.textShadow
                }}
              >
                {activeHeroData.hookLine}
              </p>
            )}

            {/* Desktop Scroll Down Arrow */}
            <div className="flex justify-center">
              <button
                onClick={handleScrollDown}
                className="p-3 rounded-full transition-all duration-300 hover:scale-110 hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                style={{
                  backgroundColor: heroColors.arrowBackground,
                  color: heroColors.arrowColor
                }}
                aria-label="Scroll to next section"
              >
                <FiChevronDown className="w-6 h-6 animate-bounce" />
              </button>
            </div>

            {/* Desktop Image Indicators */}
            {activeHeroData?.images?.length > 1 && activeHeroData?.showIndicators && (
              <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                  {activeHeroData.images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-500 ease-in-out ${
                        index === currentImageIndex 
                          ? 'bg-white opacity-100 scale-125' 
                          : 'bg-white opacity-50 scale-100'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
