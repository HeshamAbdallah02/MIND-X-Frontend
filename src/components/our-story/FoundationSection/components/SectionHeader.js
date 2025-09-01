// frontend/src/components/our-story/FoundationSection/components/SectionHeader.js
import React from 'react';

const SectionHeader = ({ isVisible }) => {
  return (
    <div className="text-center max-w-4xl mx-auto">
      {/* Subtitle */}
      <div className={`
        transition-all duration-700 ease-out delay-100
        ${isVisible 
          ? 'opacity-100 transform translate-y-0' 
          : 'opacity-0 transform translate-y-4'
        }
      `}>
        <span 
          className="inline-block px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-full mb-4 sm:mb-6" 
          style={{ backgroundColor: '#FBB859', color: 'white' }}
        >
          Our Foundation Story
        </span>
      </div>

      {/* Main Title */}
      <h2 className={`
        font-bold mb-4 sm:mb-6
        transition-all duration-700 ease-out delay-200
        ${isVisible 
          ? 'opacity-100 transform translate-y-0' 
          : 'opacity-0 transform translate-y-4'
        }
      `}
      style={{ 
        color: '#606161',
        fontSize: 'clamp(2rem, 8vw, 4rem)',
        lineHeight: '1.1'
      }}
      >
        Where
        <span className="relative inline-block mx-2 sm:mx-3">
          <span className="relative z-10" style={{ color: '#FBB859' }}>Dreams</span>
          <span className="absolute inset-0 transform -skew-x-12 rounded-lg" style={{ backgroundColor: 'rgba(251, 184, 89, 0.2)' }}></span>
        </span>
        Met Purpose
      </h2>

      {/* Description */}
      <p className={`
        leading-relaxed max-w-3xl mx-auto
        transition-all duration-700 ease-out delay-300
        ${isVisible 
          ? 'opacity-100 transform translate-y-0' 
          : 'opacity-0 transform translate-y-4'
        }
      `}
      style={{ 
        color: '#606161',
        fontSize: 'clamp(1rem, 3vw, 1.25rem)'
      }}
      >
        Every great movement begins with a single moment of clarity. 
        This is the story of how <span className="font-semibold" style={{ color: '#606161' }}>one simple idea</span> grew into 
        a <span className="font-semibold" style={{ color: '#FBB859' }}>transformative force</span> across Upper Egypt.
      </p>

      {/* Decorative Quote Mark */}
      <div className={`
        mt-6 sm:mt-8 flex justify-center
        transition-all duration-700 ease-out delay-500
        ${isVisible 
          ? 'opacity-100 transform scale-100' 
          : 'opacity-0 transform scale-75'
        }
      `}>
        <div 
          className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-lg" 
          style={{ background: 'linear-gradient(135deg, #FBB859 0%, #81C99C 100%)' }}
        >
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SectionHeader;
