//frontend/src/components/home/TestimonialsSection/NavigationButton.js
import React from 'react';

const TestimonialNavigationButton = ({ direction, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        absolute -translate-y-1/2
        ${direction === 'prev' ? '-left-0' : '-right-0'}
        w-14 h-14
        flex items-center justify-center
        group
        transition-all duration-300
        hover:scale-110
        focus:outline-none
        z-20
      `}
      aria-label={direction === 'prev' ? 'Previous testimonial' : 'Next testimonial'}
    >
      <div className="relative w-full h-full">
        {/* Outer circle */}
        <div 
          className={`
            absolute inset-0 rounded-full 
            border-2 border-[#FBB859] 
            opacity-20 
            group-hover:opacity-40
            transition-opacity duration-300
          `}
        />
        {/* Inner circle */}
        <div 
          className={`
            absolute inset-2 rounded-full 
            bg-white shadow-lg
            group-hover:shadow-xl
            transition-all duration-300
          `}
        />
        {/* Arrow */}
        <svg
          className={`
            absolute inset-0 m-auto
            w-6 h-6
            text-[#FBB859]
            transition-transform duration-300
            ${direction === 'prev' ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}
          `}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          {direction === 'prev' ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          )}
        </svg>
      </div>
    </button>
  );
};

export default React.memo(TestimonialNavigationButton);