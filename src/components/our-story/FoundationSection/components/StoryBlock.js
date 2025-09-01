// frontend/src/components/our-story/FoundationSection/components/StoryBlock.js
import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const StoryBlock = ({ story, index, isVisible }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isEven = index % 2 === 0;
  
  // Animation delays based on index
  const baseDelay = 200 + (index * 100); // Reduced delays for mobile

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div className={`
      grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center
      ${isEven ? 'lg:grid-flow-row' : 'lg:grid-flow-row-dense'}
    `}>
      {/* Visual Element */}
      <div className={`
        ${isEven ? 'lg:order-1' : 'lg:order-2'}
        transition-all duration-700 ease-out
        ${!prefersReducedMotion && isVisible 
          ? 'opacity-100 transform translate-y-0 translate-x-0' 
          : prefersReducedMotion && isVisible
          ? 'opacity-100'
          : `opacity-0 ${!prefersReducedMotion ? 'transform translate-y-4' : ''}`
        }
      `}
      style={{ transitionDelay: `${baseDelay}ms` }}
      >
        <div className="relative">
          {/* Main Visual */}
          <div 
            className="w-full min-h-[280px] sm:min-h-[320px] lg:min-h-[380px] xl:min-h-[400px] rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 flex items-center justify-center overflow-hidden relative transform transition-all duration-300 ease-out hover:scale-[1.02] lg:hover:scale-105 hover:-translate-y-1 lg:hover:-translate-y-2"
            style={{
              ...story.bgStyle,
              willChange: window.innerWidth > 1024 ? 'transform' : 'auto',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 4px 10px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.08), 0 4px 10px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)';
            }}
          >
            {/* Background Pattern - Colorful and subtle */}
            <div className="absolute inset-0 opacity-8">
              <div className="absolute top-6 right-6 w-12 sm:w-16 lg:w-20 h-12 sm:h-16 lg:h-20 border-2 border-white/40 rounded-full"></div>
              <div className="absolute bottom-6 left-6 w-8 sm:w-12 lg:w-16 h-8 sm:h-12 lg:h-16 border-2 border-white/30 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 border border-white/20 rounded-full opacity-60"></div>
              {/* Additional decorative dots */}
              <div className="absolute top-1/4 left-1/4 w-2 sm:w-3 h-2 sm:h-3 bg-white/20 rounded-full"></div>
              <div className="absolute bottom-1/4 right-1/4 w-3 sm:w-4 h-3 sm:h-4 bg-white/25 rounded-full"></div>
            </div>
            
            {/* Icon */}
            <div className="relative z-10 text-center">
              <div 
                className="mb-3 sm:mb-4 transform transition-all duration-300 ease-out hover:rotate-6 hover:scale-110"
                style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)' }}
              >
                {story.icon}
              </div>
              <div className="text-white/90 font-semibold" style={{ fontSize: 'clamp(0.875rem, 2vw, 1.125rem)' }}>
                {story.phase}
              </div>
            </div>
          </div>

          {/* Year Badge */}
          <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 bg-white rounded-full px-4 sm:px-6 py-2 sm:py-3 shadow-lg border-2 sm:border-4 border-gray-50">
            <span 
              className="font-bold" 
              style={{ 
                color: '#FBB859',
                fontSize: 'clamp(1.125rem, 3vw, 1.5rem)'
              }}
            >
              {story.year}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={`
        ${isEven ? 'lg:order-2' : 'lg:order-1'}
        transition-all duration-700 ease-out
        ${!prefersReducedMotion && isVisible 
          ? 'opacity-100 transform translate-y-0 translate-x-0' 
          : prefersReducedMotion && isVisible
          ? 'opacity-100'
          : `opacity-0 ${!prefersReducedMotion ? 'transform translate-y-4' : ''}`
        }
      `}
      style={{ transitionDelay: `${baseDelay + 100}ms` }}
      >
        {/* Story Title */}
        <h3 
          className="font-bold mb-3 sm:mb-4" 
          style={{ 
            color: '#606161',
            fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
            lineHeight: '1.2'
          }}
        >
          {story.title}
        </h3>

        {/* Hook Line */}
        <p 
          className="font-semibold mb-4 sm:mb-6 leading-relaxed" 
          style={{ 
            color: '#FBB859',
            fontSize: 'clamp(1rem, 3vw, 1.25rem)'
          }}
        >
          {story.hook}
        </p>

        {/* Main Content */}
        <div 
          className="prose prose-sm sm:prose lg:prose-lg leading-relaxed" 
          style={{ color: '#606161', fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}
        >
          <p className="mb-4">{story.content}</p>
          
          {/* Expandable Additional Content */}
          {story.additionalContent && (
            <div className={`
              overflow-hidden transition-all duration-500 ease-out
              ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
            `}>
              <div className="pt-4 border-t border-gray-200">
                <p style={{ color: '#606161' }}>{story.additionalContent}</p>
              </div>
            </div>
          )}
        </div>

        {/* Key Highlights */}
        {story.highlights && (
          <div className="mt-4 sm:mt-6 flex flex-wrap gap-2 sm:gap-3">
            {story.highlights.map((highlight, idx) => (
              <span 
                key={idx}
                className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full"
                style={{ 
                  backgroundColor: idx % 2 === 0 ? 'rgba(251, 184, 89, 0.1)' : 'rgba(129, 201, 156, 0.1)',
                  color: idx % 2 === 0 ? '#FBB859' : '#81C99C'
                }}
              >
                {highlight}
              </span>
            ))}
          </div>
        )}

        {/* Expand Button - Touch-friendly */}
        {story.additionalContent && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 sm:mt-6 inline-flex items-center font-semibold transition-all duration-200 hover:translate-x-1 min-h-[44px] px-2 py-2 -mx-2"
            style={{ color: '#FBB859', fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
            onMouseEnter={(e) => e.target.style.color = '#81C99C'}
            onMouseLeave={(e) => e.target.style.color = '#FBB859'}
          >
            {isExpanded ? 'Read Less' : 'Read More'}
            {isExpanded ? (
              <FiChevronUp className="ml-2 w-5 h-5" />
            ) : (
              <FiChevronDown className="ml-2 w-5 h-5" />
            )}
          </button>
        )}

        {/* Impact Numbers - Simple stats without cards */}
        {story.stats && (
          <div className="mt-4 sm:mt-6 lg:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
            {story.stats.map((stat, idx) => (
              <div 
                key={idx} 
                className="text-center group transition-all duration-300 hover:scale-110"
              >
                <div 
                  className="font-bold mb-1 sm:mb-2 transition-transform duration-300" 
                  style={{ 
                    color: idx % 2 === 0 ? '#81C99C' : '#FBB859', // Brand green for even, brand gold for odd
                    fontSize: 'clamp(1.5rem, 6vw, 2.5rem)',
                    lineHeight: '1.1',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {stat.number}
                </div>
                <div 
                  className="font-medium leading-tight" 
                  style={{ 
                    color: '#4A5568', // Elegant dark gray for better readability
                    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryBlock;
