//frontend/src/components/our-story/OurJourney/components/TimelineNode.js
import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const TimelineNode = ({ phase, section, isActive, isVisible, index }) => {
  const nodeColor = section.nodeColor || '#FBB859';
  const lineColor = section.lineColor || '#e2e8f0';

  const nodeVariants = {
    hidden: { 
      scale: 0, 
      opacity: 0,
      rotate: -180
    },
    visible: { 
      scale: 1, 
      opacity: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
        delay: index * 0.1 + 0.5
      }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.2, 1],
      opacity: [0.7, 0.3, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <div className="absolute left-4 sm:left-1/2 sm:transform sm:-translate-x-1/2 z-20">
      {/* Outer pulse ring (only for active phase) */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ 
            backgroundColor: nodeColor,
            width: '2rem',
            height: '2rem',
            left: '-0.5rem',
            top: '-0.5rem'
          }}
          variants={pulseVariants}
          animate="pulse"
        />
      )}

      {/* Main node */}
      <motion.div
        variants={nodeVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        className="relative w-4 h-4 rounded-full border-4 bg-white cursor-pointer group"
        style={{ 
          borderColor: isActive ? nodeColor : lineColor,
          boxShadow: isActive 
            ? `0 0 20px ${nodeColor}40, 0 4px 12px rgba(0,0,0,0.15)` 
            : '0 2px 8px rgba(0,0,0,0.1)'
        }}
        whileHover={{ 
          scale: 1.2,
          boxShadow: `0 0 25px ${nodeColor}60, 0 6px 16px rgba(0,0,0,0.2)`
        }}
        whileTap={{ scale: 0.9 }}
      >
        {/* Inner dot */}
        <motion.div
          className="absolute inset-1 rounded-full"
          style={{ backgroundColor: isActive ? nodeColor : 'transparent' }}
          initial={{ scale: 0 }}
          animate={{ scale: isActive ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Year badge (mobile) */}
        <div className="sm:hidden absolute -right-16 -top-1 bg-white px-2 py-1 rounded-lg shadow-md border">
          <span 
            className="text-xs font-bold"
            style={{ color: nodeColor }}
          >
            {phase.year}
          </span>
        </div>
      </motion.div>

      {/* Connecting line to content (desktop) */}
      <div className="hidden sm:block absolute top-2 w-8 h-0.5 bg-gray-200">
        <motion.div
          className="h-full"
          style={{ backgroundColor: nodeColor }}
          initial={{ width: '0%' }}
          animate={{ width: isVisible ? '100%' : '0%' }}
          transition={{ duration: 0.6, delay: index * 0.1 + 0.8 }}
        />
      </div>
    </div>
  );
};

TimelineNode.propTypes = {
  phase: PropTypes.shape({
    year: PropTypes.string.isRequired,
  }).isRequired,
  section: PropTypes.shape({
    nodeColor: PropTypes.string,
    lineColor: PropTypes.string,
  }).isRequired,
  isActive: PropTypes.bool.isRequired,
  isVisible: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
};

export default TimelineNode;
