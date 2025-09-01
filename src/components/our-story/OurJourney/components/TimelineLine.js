//frontend/src/components/our-story/OurJourney/components/TimelineLine.js
import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const TimelineLine = ({ section, scrollProgress, totalPhases }) => {
  const lineColor = section.lineColor || '#e2e8f0';
  const activeLineColor = section.nodeColor || '#FBB859';

  return (
    <>
      {/* Base Timeline Line */}
      <div 
        className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 sm:transform sm:-translate-x-0.5 z-0"
        style={{ backgroundColor: lineColor }}
      />
      
      {/* Animated Progress Line */}
      <motion.div 
        className="absolute left-4 sm:left-1/2 top-0 w-0.5 sm:transform sm:-translate-x-0.5 z-10"
        style={{ 
          backgroundColor: activeLineColor,
          boxShadow: `0 0 10px ${activeLineColor}40`
        }}
        initial={{ height: '0%' }}
        animate={{ 
          height: `${Math.min(scrollProgress * 100, 100)}%`,
        }}
        transition={{ 
          duration: 0.3,
          ease: 'easeOut'
        }}
      />

      {/* Progress indicator (desktop only) */}
      <motion.div
        className="hidden lg:block fixed right-8 top-1/2 transform -translate-y-1/2 w-2 h-20 rounded-full bg-white/20 backdrop-blur-sm z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: scrollProgress > 0.1 ? 1 : 0 }}
      >
        <motion.div
          className="w-full rounded-full"
          style={{ backgroundColor: activeLineColor }}
          initial={{ height: '0%' }}
          animate={{ height: `${Math.min(scrollProgress * 100, 100)}%` }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </>
  );
};

TimelineLine.propTypes = {
  section: PropTypes.shape({
    lineColor: PropTypes.string,
    nodeColor: PropTypes.string,
  }).isRequired,
  scrollProgress: PropTypes.number.isRequired,
  totalPhases: PropTypes.number.isRequired,
};

export default TimelineLine;
