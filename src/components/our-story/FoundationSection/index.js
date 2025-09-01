// frontend/src/components/our-story/FoundationSection/index.js
import React from 'react';
import { useIntersection } from '../../../hooks/useIntersection';
import StoryBlock from './components/StoryBlock';
import SectionHeader from './components/SectionHeader';
import { foundationStories } from './data/foundationData';

const FoundationSection = () => {
  const [sectionRef, isVisible] = useIntersection({
    triggerOnce: true,
    rootMargin: '0px 0px -10% 0px'
  });

  return (
    <section 
      ref={sectionRef}
      className="py-12 sm:py-16 lg:py-20 xl:py-32 bg-gradient-to-br from-gray-50 via-white to-orange-50 relative overflow-hidden"
      data-visible={isVisible.toString()}
      style={{ overflowX: 'hidden' }}
    >
      {/* Background Pattern - Hidden on mobile for performance */}
      <div className="absolute inset-0 opacity-5 hidden sm:block">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full blur-3xl" style={{ backgroundColor: '#FBB859' }}></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: '#81C99C' }}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: '#FBB859' }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <SectionHeader isVisible={isVisible} />

        {/* Story Blocks - Mobile-first responsive grid */}
        <div className="mt-12 sm:mt-16 lg:mt-20 space-y-12 sm:space-y-16 lg:space-y-24 xl:space-y-32">
          {foundationStories.map((story, index) => (
            <StoryBlock
              key={story.id}
              story={story}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* Impact Summary */}
        <div className={`
          mt-20 sm:mt-24 lg:mt-32 text-center
          transition-all duration-1000 ease-out
          ${isVisible 
            ? 'opacity-100 transform translate-y-0' 
            : 'opacity-0 transform translate-y-8'
          }
        `}>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl border border-gray-100">
            <h3 
              className="font-bold mb-4 sm:mb-6"
              style={{ 
                color: '#606161',
                fontSize: 'clamp(1.5rem, 4vw, 2rem)'
              }}
            >
              The Foundation of Tomorrow
            </h3>
            <p 
              className="leading-relaxed max-w-3xl mx-auto"
              style={{ 
                color: '#606161',
                fontSize: 'clamp(1rem, 2.5vw, 1.125rem)'
              }}
            >
              From a simple idea to a transformative movement, MIND-X has been built on the belief that 
              <span className="font-semibold" style={{ color: '#FBB859' }}> every young person deserves the opportunity to grow, learn, and thrive</span>. 
              Our foundation isn't just our history—it's the bedrock upon which we continue to build futures.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoundationSection;
