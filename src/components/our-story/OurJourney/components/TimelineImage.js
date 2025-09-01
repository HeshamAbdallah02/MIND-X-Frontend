//frontend/src/components/our-story/OurJourney/components/TimelineImage.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const TimelineImage = ({ imageUrl, imageAlt, isVisible }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.8,
        delay: 0.6
      }
    }
  };

  const placeholderVariants = {
    loading: {
      opacity: [0.3, 0.7, 0.3],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  if (hasError) {
    return null; // Don't render anything if image fails to load
  }

  return (
    <motion.div
      variants={imageVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      className="mt-6 relative overflow-hidden rounded-xl group"
    >
      {/* Loading placeholder */}
      {!isLoaded && (
        <motion.div
          variants={placeholderVariants}
          animate="loading"
          className="w-full h-48 sm:h-56 lg:h-64 bg-gray-200 rounded-xl flex items-center justify-center"
        >
          <div className="text-gray-400">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        </motion.div>
      )}

      {/* Actual image */}
      <img
        src={imageUrl}
        alt={imageAlt}
        className={`w-full h-48 sm:h-56 lg:h-64 object-cover rounded-xl transition-all duration-500 group-hover:scale-105 ${
          isLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          console.warn(`Failed to load timeline image: ${imageUrl}`);
        }}
        loading="lazy"
      />

      {/* Image overlay on hover */}
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          whileHover={{ scale: 1 }}
          className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
};

TimelineImage.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  imageAlt: PropTypes.string.isRequired,
  isVisible: PropTypes.bool.isRequired,
};

export default TimelineImage;
