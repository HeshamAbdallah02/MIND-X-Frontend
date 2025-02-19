// frontend/src/components/home/TestimonialsSection/TestimonialCard.js
import React from 'react';
import { motion } from 'framer-motion';
import { FaQuoteRight } from 'react-icons/fa';

const TestimonialCard = ({ testimonial, isActive, colors, showFeedback = true }) => {
  const handleImageClick = () => {
    if (isActive && testimonial.profileUrl) {
      window.open(testimonial.profileUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative group">
        <div 
          className={`
            rounded-full overflow-hidden border-4 
            transition-all duration-300 
            ${isActive ? 'w-40 h-40' : 'w-28 h-28'}
            ${isActive && testimonial.profileUrl ? 'cursor-pointer' : ''}
          `}
          style={{ 
            borderColor: isActive ? colors.circleBorderColor : colors.circleBorderColor + '100',
            transform: isActive ? 'scale(1)' : 'scale(0.95)'
          }}
          onClick={handleImageClick}
          role={isActive && testimonial.profileUrl ? 'link' : undefined}
          aria-label={isActive && testimonial.profileUrl ? `Visit ${testimonial.name}'s profile` : undefined}
        >
          <img
            src={testimonial.image.url}
            alt={testimonial.image.alt || testimonial.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        {isActive && (
          <motion.div 
            className="absolute -bottom-3 left-1/2 -translate-x-1/2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
              style={{ 
                backgroundColor: colors.quoteIconBackground,
                color: colors.quoteIconColor
              }}
            >
              <FaQuoteRight className="text-sm" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Only show name under inactive cards */}
      {!isActive && (
        <motion.p
          className="text-sm mt-2"
          style={{ 
            color: colors.nameColor,
            opacity: 0.7
          }}
        >
          {testimonial.name}
        </motion.p>
      )}
    </div>
  );
};

export default React.memo(TestimonialCard);