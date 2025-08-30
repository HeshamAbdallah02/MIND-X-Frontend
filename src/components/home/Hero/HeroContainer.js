// frontend/src/components/home/Hero/HeroContainer.js
import React from 'react';
import { useHeroLogic } from './hooks/useHeroLogic';
import HeroBackground from './components/HeroBackground';
import HeroContent from './components/HeroContent';
import HeroNavigation from './components/HeroNavigation';

const HeroContainer = () => {
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
      <section className="relative w-full h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading hero content...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative w-full h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg text-red-600">Error loading hero content</div>
      </section>
    );
  }

  if (!contents.length) {
    return (
      <section className="relative w-full h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg text-gray-600">No hero content available</div>
      </section>
    );
  }

  const currentContent = contents[currentIndex];

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background Media */}
      <HeroBackground
        content={currentContent}
        isTransitioning={isTransitioning}
        videoRefs={videoRefs}
        onVideoEnd={handleVideoEnd}
      />

      {/* Content Overlay */}
      <HeroContent content={currentContent} />

      {/* Navigation Dots */}
      <HeroNavigation
        contents={contents}
        currentIndex={currentIndex}
        onDotClick={handleDotClick}
      />
    </section>
  );
};

export default HeroContainer;
