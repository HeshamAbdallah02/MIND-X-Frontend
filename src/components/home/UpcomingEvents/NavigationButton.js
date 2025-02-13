// frontend/src/components/home/Events/NavigationButton.js
import React from 'react';

const NavigationButton = ({ direction, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`
        absolute top-1/2 -translate-y-1/2
        ${direction === 'prev' ? '-left-6' : '-right-6'}
        w-10 h-10 rounded-full
        bg-white/95 shadow-lg backdrop-blur-sm
        hover:bg-[#81C99C20]
        transition-all duration-200
        z-20
        flex items-center justify-center
        group
        active:scale-95
        ${className}
      `}
      aria-label={direction === 'prev' ? 'Previous' : 'Next'}
    >
      <div className="absolute inset-0 rounded-full opacity-10 group-hover:opacity-20 transition-opacity bg-gradient-to-r from-[#81C99C] to-transparent" />
      <svg
        className={`
          w-5 h-5
          text-gray-600/90
          transition-transform duration-200
          ${direction === 'prev' ? '-translate-x-px' : 'translate-x-px'}
          group-hover:scale-125
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
    </button>
  );
};

export default NavigationButton;