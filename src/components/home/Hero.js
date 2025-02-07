//frontend/src/components/home/Hero.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [contents, setContents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(0);
  const videoRefs = useRef({});

  useEffect(() => {
    fetchHeroContents();
  }, []);

  const fetchHeroContents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/hero');
      setContents(response.data);
    } catch (error) {
      console.error('Error fetching hero contents:', error);
    }
  };

  const handleNext = useCallback(() => {
    setIsTransitioning(true);
    const videoElement = videoRefs.current[contents[currentIndex]._id];
    if (videoElement) {
      videoElement.pause();
    }
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % contents.length);
      setIsTransitioning(false);
    }, 300);
  }, [currentIndex, contents]);

  useEffect(() => {
    if (contents.length === 0) return;
  
    const content = contents[currentIndex];
    let timeout;
  
    if (content.mediaType === 'image') {
      timeout = setTimeout(() => {
        handleNext();
      }, content.displayDuration);
    }
  
    return () => clearTimeout(timeout);
  }, [currentIndex, contents, handleNext]);

  useEffect(() => {
    if (contents.length === 0) return;
    
    const currentContent = contents[currentIndex];
    if (currentContent.mediaType === 'video') {
      const videoElement = videoRefs.current[currentContent._id];
      if (videoElement) {
        videoElement.currentTime = 0;
        videoElement.play().catch(error => {
          console.error('Error playing video:', error);
        });
      }

      // Pause other videos
      Object.entries(videoRefs.current).forEach(([id, video]) => {
        if (id !== currentContent._id && video) {
          video.pause();
        }
      });
    }
  }, [currentIndex, contents]);

  const handleDotClick = (index) => {
    if (index === currentIndex) return;
    setIsTransitioning(true);
    const videoElement = videoRefs.current[contents[currentIndex]._id];
    if (videoElement) {
      videoElement.pause();
    }
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 300);
  };

  const handleVideoEnd = () => {
    handleNext();
  };

  const renderMedia = (content) => {
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
              onEnded={handleVideoEnd}
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
              alt={content.heading.text}
              className="w-full h-full object-cover"
              loading="eager"
              onLoad={() => {
                // Move to next slide after GIF duration
                setTimeout(() => {
                  handleNext();
                }, content.displayDuration || 5000); // Default 5 seconds if not specified
              }}
              onError={(e) => {
                console.error('GIF error:', e);
                e.target.src = 'fallback-image-url.jpg';
              }}
            />
          </div>
        );
      case 'image':
        return (
          <div className="absolute inset-0 w-full h-full">
            <img
              src={content.mediaUrl}
              alt={content.heading.text}
              className="w-full h-full object-cover"
              loading="eager"
              onError={(e) => {
                console.error('Image error:', e);
                e.target.src = 'fallback-image-url.jpg';
              }}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const renderButton = (button) => {
    if (!button?.text) return null;

    const buttonStyle = {
      backgroundColor: button.backgroundColor,
      color: button.textColor,
    };

    if (button.action.type === 'scroll') {
      return (
        <button
          onClick={() => {
            const element = document.querySelector(button.action.target);
            element?.scrollIntoView({ behavior: 'smooth' });
          }}
          style={buttonStyle}
          className="px-6 py-3 rounded-md font-medium transition-transform hover:scale-105"
        >
          {button.text}
        </button>
      );
    }

    return (
      <Link
        to={button.action.target}
        style={buttonStyle}
        className="px-6 py-3 rounded-md font-medium transition-transform hover:scale-105"
      >
        {button.text}
      </Link>
    );
  };

  if (contents.length === 0) return null;

  return (
    <section className="relative h-[calc(100vh-64px)] overflow-hidden bg-black">
      {/* Media and overlay */}
      <div className="absolute inset-0">
        <div 
          className={`transition-opacity duration-300 ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {renderMedia(contents[currentIndex])}
        </div>
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4">
          <div 
            className={`max-w-2xl transition-opacity duration-300 ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <h1 
              className={`${contents[currentIndex].heading.size} font-bold mb-4 md:leading-tight`}
              style={{ 
                color: contents[currentIndex].heading.color}}
            >
              {contents[currentIndex].heading.text}
            </h1>

            {contents[currentIndex].subheading?.text && (
              <h2 
                className={`${contents[currentIndex].subheading.size} mb-4`}
                style={{ color: contents[currentIndex].subheading.color }}
              >
                {contents[currentIndex].subheading.text}
              </h2>
            )}

            {contents[currentIndex].description?.text && (
              <p 
                className={`${contents[currentIndex].description.size} mb-8`}
                style={{ color: contents[currentIndex].description.color }}
              >
                {contents[currentIndex].description.text}
              </p>
            )}

            {renderButton(contents[currentIndex].button)}
          </div>
        </div>
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {contents.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-[#FBB859] w-6' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;