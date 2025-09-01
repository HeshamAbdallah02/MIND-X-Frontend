//frontend/src/components/our-story/OurJourney/components/YearBadge.js
import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const YearBadge = ({ year, accentColor, isActive }) => {
  const badgeVariants = {
    hidden: { scale: 0, rotate: -45 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
        delay: 0.3
      }
    }
  };

  return (
    <motion.div
      variants={badgeVariants}
      initial="hidden"
      animate="visible"
      className="inline-flex items-center justify-center mb-4"
    >
      <div
        className="px-4 py-2 rounded-full text-sm font-bold shadow-lg border-2 border-white"
        style={{ 
          backgroundColor: accentColor,
          color: '#ffffff',
          boxShadow: isActive 
            ? `0 8px 20px ${accentColor}40, 0 4px 10px rgba(0,0,0,0.1)` 
            : `0 4px 12px ${accentColor}30, 0 2px 6px rgba(0,0,0,0.1)`
        }}
      >
        {year}
      </div>
    </motion.div>
  );
};

YearBadge.propTypes = {
  year: PropTypes.string.isRequired,
  accentColor: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
};

export default YearBadge;
