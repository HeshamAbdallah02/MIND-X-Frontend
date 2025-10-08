// frontend/src/components/eventDetails/HeroSection.js
import React, { useState } from 'react';

const HeroSection = ({ event }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Loading Placeholder */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#81C99C]/20 to-[#FBB859]/20 animate-pulse" />
      )}
      
      {/* Event Hero Image */}
      <img
        src={event.heroImage?.url || event.coverImage?.url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920'}
        alt={event.heroImage?.alt || event.coverImage?.alt || event.title?.text}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setImageLoaded(true)}
      />
    </div>
  );
};

export default HeroSection;
