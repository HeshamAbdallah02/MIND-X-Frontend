// frontend/src/components/our-story/AwardsSection/index.js
import React from 'react';
import { useIntersection } from '../../../hooks/useIntersection';
import AwardsGrid from './components/AwardsGrid';
import AwardsBackground from './components/AwardsBackground';
import SectionTitle from '../../shared/SectionTitle';
import { useAwardsSettings } from './hooks/useAwardsData';

const AwardsSection = () => {
  const [sectionRef, isVisible] = useIntersection({
    triggerOnce: true,
    rootMargin: '0px 0px -25% 0px'
  });

  const { data: settings } = useAwardsSettings();
  
  // Default values if settings not loaded
  const sectionTitle = settings?.title || 'Awards & Achievements';
  const sectionSubtitle = settings?.subtitle || 'Celebrating excellence, innovation, and impact through our journey.';
  const subtitleColor = settings?.subtitleColor || '#e5e7eb';

  return (
    <AwardsBackground>
      {/* Top Overlay Blend */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-900 to-transparent z-20 pointer-events-none"></div>
      
      {/* Bottom Overlay Blend */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent z-20 pointer-events-none"></div>
      
      <section 
        ref={sectionRef}
        className="py-20 lg:min-h-screen relative z-10"
        data-visible={isVisible.toString()}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title */}
          <div className="text-center mb-16">
            <SectionTitle 
              animate={isVisible}
              className="mb-4 !text-white"
              style={{ color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
            >
              {sectionTitle}
            </SectionTitle>
            
            {/* Section Subtitle/Hook */}
            <p 
              className={`
                text-lg md:text-xl max-w-3xl mx-auto leading-relaxed
                transition-all duration-700 ease-out
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
              `}
              style={{ 
                color: subtitleColor,
                transitionDelay: '200ms'
              }}
            >
              {sectionSubtitle}
            </p>
          </div>

          {/* Awards Grid */}
          <div 
            className={`
              transition-all duration-700 ease-out
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
            style={{ transitionDelay: '400ms' }}
          >
            <AwardsGrid animate={isVisible} />
          </div>
        </div>
      </section>
    </AwardsBackground>
  );
};

export default AwardsSection;
