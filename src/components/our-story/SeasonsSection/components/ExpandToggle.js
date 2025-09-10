// frontend/src/components/our-story/SeasonsSection/components/ExpandToggle.js
import React from 'react';
import { motion } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';

const ExpandToggle = ({ isExpanded, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-full bg-black bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 transition-all duration-200 group ${className}`}
      aria-label={isExpanded ? 'Collapse season details' : 'Expand season details'}
    >
      <motion.div
        animate={{ rotate: isExpanded ? 180 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <FiChevronDown className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-200" />
      </motion.div>
    </button>
  );
};

export default ExpandToggle;
