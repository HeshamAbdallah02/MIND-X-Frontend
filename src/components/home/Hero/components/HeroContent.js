// frontend/src/components/home/Hero/components/HeroContent.js
import React from 'react';
import HeroButton from './HeroButton';

const HeroContent = ({ content, isTransitioning }) => {
  if (!content) return null;

  return (
    <div className="relative h-full flex items-center justify-start">
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className={`max-w-2xl transition-opacity duration-300 ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {/* Headline */}
          {content.heading?.text && (
            <h1 
              className={`${content.heading.size} font-bold mb-4 md:leading-tight`}
              style={{ color: content.heading.color }}
            >
              {content.heading.text}
            </h1>
          )}

          {/* Subheading */}
          {content.subheading?.text && (
            <h2 
              className={`${content.subheading.size} mb-4`}
              style={{ color: content.subheading.color }}
            >
              {content.subheading.text}
            </h2>
          )}

          {/* Description */}
          {content.description?.text && (
            <p 
              className={`${content.description.size} mb-8`}
              style={{ color: content.description.color }}
            >
              {content.description.text}
            </p>
          )}

          {/* Button */}
          <HeroButton button={content.button} />
        </div>
      </div>
    </div>
  );
};

export default HeroContent;
