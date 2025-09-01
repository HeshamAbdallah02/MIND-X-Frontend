//frontend/src/components/our-story/OurJourney/components/TimelineHeader.js
import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const TimelineHeader = ({ section, isVisible }) => {
  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        delay: 0.2,
        ease: 'easeOut'
      }
    }
  };

  return (
    <motion.div
      variants={headerVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      className="text-center mb-12 sm:mb-16 lg:mb-20"
    >
      {/* Main Title */}
      <motion.h2 
        className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6"
        style={{ 
          color: section.textColor || '#1e293b',
          fontSize: 'clamp(2rem, 5vw, 4rem)',
          lineHeight: '1.1'
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {section.title || 'Our Journey'}
      </motion.h2>

      {/* Subtitle */}
      {section.subtitle && (
        <motion.p 
          className="text-lg sm:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed"
          style={{ 
            color: section.textColor || '#64748b',
            fontSize: 'clamp(1rem, 3vw, 1.5rem)',
            opacity: 0.8
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 0.8, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {section.subtitle}
        </motion.p>
      )}

      {/* Decorative line */}
      <motion.div 
        className="w-20 sm:w-24 lg:w-32 h-1 mx-auto mt-6 sm:mt-8 rounded-full"
        style={{ backgroundColor: section.nodeColor || '#FBB859' }}
        initial={{ width: 0 }}
        animate={isVisible ? { width: 'clamp(5rem, 8vw, 8rem)' } : { width: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      />
    </motion.div>
  );
};

TimelineHeader.propTypes = {
  section: PropTypes.shape({
    title: PropTypes.string,
    subtitle: PropTypes.string,
    textColor: PropTypes.string,
    nodeColor: PropTypes.string,
  }).isRequired,
  isVisible: PropTypes.bool.isRequired,
};

export default TimelineHeader;
