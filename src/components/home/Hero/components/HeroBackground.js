// frontend/src/components/home/Hero/components/HeroBackground.js
import React from 'react';

const HeroBackground = ({ 
  content, 
  isTransitioning, 
  videoRefs, 
  onVideoEnd,
  onNext
}) => {
  if (!content) return null;

  const renderMedia = () => {
    switch (content.mediaType) {
      case 'video':
        return (
          <div className="absolute inset-0 w-full h-full">
            <video
              ref={el => videoRefs.current[content._id] = el}
              className="w-full h-full object-cover"
              src={content.mediaUrl}
              autoPlay
              muted
              loop={false}
              onEnded={onVideoEnd}
              playsInline
              preload="metadata"
              onError={(e) => {
                console.error('Video error:', e.target.error);
              }}
            >
              <source src={content.mediaUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        );
      
      case 'gif':
        return (
          <div className="absolute inset-0 w-full h-full">
            <img
              src={content.mediaUrl}
              alt={content.heading?.text}
              className="w-full h-full object-cover"
              loading="eager"
              onLoad={() => {
                // This logic would need to be handled in the parent component
                // for proper state management
              }}
              onError={(e) => {
                console.error('GIF error:', e);
                e.target.src = 'fallback-image-url.jpg';
              }}
            />
          </div>
        );
      
      case 'image':
      default:
        return (
          <div className="absolute inset-0 w-full h-full">
            <img
              src={content.mediaUrl}
              alt={content.heading?.text}
              className="w-full h-full object-cover"
              loading="eager"
              onError={(e) => {
                console.error('Image error:', e);
                e.target.src = 'fallback-image-url.jpg';
              }}
            />
          </div>
        );
    }
  };

  return (
    <div className="absolute inset-0">
      <div 
        className={`transition-opacity duration-300 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {renderMedia()}
      </div>
      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
};

export default HeroBackground;
