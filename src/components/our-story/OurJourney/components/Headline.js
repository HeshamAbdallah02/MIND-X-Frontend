//frontend/src/components/our-story/OurJourney/components/Headline.js
import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const Headline = ({ headline, textColor, isVisible, id }) => {
  const headlineVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.2
      }
    }
  };

  return (
    <motion.h3
      id={id}
      variants={headlineVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 leading-tight"
      style={{ 
        color: textColor,
        fontSize: 'clamp(1.25rem, 4vw, 2rem)'
      }}
    >
      {headline}
    </motion.h3>
  );
};

Headline.propTypes = {
  headline: PropTypes.string.isRequired,
  textColor: PropTypes.string.isRequired,
  isVisible: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
};

export default Headline;
