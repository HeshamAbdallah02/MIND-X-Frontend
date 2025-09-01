//frontend/src/components/our-story/OurJourney/components/Description.js
import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const Description = ({ description, textColor, isVisible }) => {
  const descriptionVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.4
      }
    }
  };

  // Function to render HTML content safely
  const renderDescription = () => {
    // Basic HTML support for rich text
    if (description.includes('<') && description.includes('>')) {
      return (
        <div 
          dangerouslySetInnerHTML={{ __html: description }}
          className="prose prose-sm sm:prose lg:prose-lg max-w-none"
        />
      );
    }
    
    // Plain text with paragraph breaks
    return description.split('\n').map((paragraph, index) => (
      <p key={index} className="mb-3 last:mb-0">
        {paragraph}
      </p>
    ));
  };

  return (
    <motion.div
      variants={descriptionVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      className="text-base sm:text-lg leading-relaxed"
      style={{ 
        color: textColor,
        opacity: 0.9,
        fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)',
        lineHeight: '1.7'
      }}
    >
      {renderDescription()}
    </motion.div>
  );
};

Description.propTypes = {
  description: PropTypes.string.isRequired,
  textColor: PropTypes.string.isRequired,
  isVisible: PropTypes.bool.isRequired,
};

export default Description;
