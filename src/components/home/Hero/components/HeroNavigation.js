// frontend/src/components/home/Hero/HeroNavigation.js
import React from 'react';

const HeroNavigation = ({ 
  contents, 
  currentIndex, 
  onDotClick 
}) => {
  if (!contents.length || contents.length <= 1) return null;

  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
      {contents.map((_, index) => (
        <button
          key={index}
          onClick={() => onDotClick(index)}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            index === currentIndex 
              ? 'bg-[#FBB859] w-6' 
              : 'bg-white/50 hover:bg-white/75'
          }`}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default HeroNavigation;
