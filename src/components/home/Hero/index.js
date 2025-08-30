// frontend/src/components/home/Hero/index.js
import React from 'react';
import { useHeroLogic } from './hooks/useHeroLogic';
import HeroBackground from './components/HeroBackground';
import HeroContent from './components/HeroContent';
import HeroNavigation from './components/HeroNavigation';

const Hero = () => {
  const {
    contents,
    isLoading,
    error,
    currentIndex,
    isTransitioning,
    videoRefs,
    handleDotClick,
    handleVideoEnd
  } = useHeroLogic();

  if (isLoading) {
    return (
      <section className="relative h-[calc(100vh-64px)] overflow-hidden bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading hero content...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative h-[calc(100vh-64px)] overflow-hidden bg-black flex items-center justify-center">
        <div className="text-white text-xl">Error loading hero content</div>
      </section>
    );
  }

  if (!contents.length) {
    return (
      <section className="relative h-[calc(100vh-64px)] overflow-hidden bg-black flex items-center justify-center">
        <div className="text-white text-xl">No hero content available</div>
      </section>
    );
  }

  const currentContent = contents[currentIndex];

  return (
    <section className="relative h-[calc(100vh-64px)] overflow-hidden bg-black">
      {/* Background Media */}
      <HeroBackground
        content={currentContent}
        isTransitioning={isTransitioning}
        videoRefs={videoRefs}
        onVideoEnd={handleVideoEnd}
      />

      {/* Content Overlay */}
      <HeroContent 
        content={currentContent} 
        isTransitioning={isTransitioning}
      />

      {/* Navigation Dots */}
      <HeroNavigation
        contents={contents}
        currentIndex={currentIndex}
        onDotClick={handleDotClick}
      />
    </section>
  );
};

export default Hero;
