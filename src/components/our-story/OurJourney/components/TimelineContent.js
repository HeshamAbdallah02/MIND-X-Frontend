//frontend/src/components/our-story/OurJourney/components/TimelineContent.js
import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import YearBadge from './YearBadge';
import Headline from './Headline';
import Description from './Description';
import TimelineImage from './TimelineImage';

const TimelineContent = ({ phase, section, isActive, isVisible }) => {
  const backgroundColor = phase.backgroundColor || '#ffffff';
  const textColor = phase.textColor || section.textColor || '#1e293b';
  const accentColor = phase.accentColor || section.nodeColor || '#FBB859';

  const contentVariants = {
    hidden: { 
      opacity: 0, 
      x: phase.calculatedPosition === 'left' ? 30 : 
         phase.calculatedPosition === 'right' ? -30 : 0,
      y: 20
    },
    visible: { 
      opacity: 1, 
      x: 0,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      variants={contentVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      className="group cursor-pointer"
      style={{ color: textColor }}
    >
      {/* Content Card */}
      <motion.div
        className="relative p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100 backdrop-blur-sm"
        style={{ 
          backgroundColor,
          boxShadow: isActive 
            ? `0 20px 40px rgba(0,0,0,0.12), 0 0 0 2px ${accentColor}20` 
            : '0 10px 25px rgba(0,0,0,0.08)'
        }}
        whileHover={{ 
          y: -5,
          boxShadow: `0 25px 50px rgba(0,0,0,0.15), 0 0 0 2px ${accentColor}30`,
          transition: { duration: 0.3 }
        }}
        layout
      >
        {/* Year Badge (desktop) */}
        <div className="hidden sm:block">
          <YearBadge 
            year={phase.year}
            accentColor={accentColor}
            isActive={isActive}
          />
        </div>

        {/* Headline */}
        <Headline 
          headline={phase.headline}
          textColor={textColor}
          isVisible={isVisible}
          id={`phase-${phase.id}-headline`}
        />

        {/* Description */}
        <Description 
          description={phase.description}
          textColor={textColor}
          isVisible={isVisible}
        />

        {/* Timeline Image */}
        {phase.imageUrl && (
          <TimelineImage 
            imageUrl={phase.imageUrl}
            imageAlt={phase.imageAlt || phase.headline}
            isVisible={isVisible}
          />
        )}

        {/* Accent border (active state) */}
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ 
              background: `linear-gradient(135deg, ${accentColor}20, transparent)`,
              border: `2px solid ${accentColor}30`
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

TimelineContent.propTypes = {
  phase: PropTypes.shape({
    id: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    headline: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    imageAlt: PropTypes.string,
    backgroundColor: PropTypes.string,
    textColor: PropTypes.string,
    accentColor: PropTypes.string,
    calculatedPosition: PropTypes.string,
  }).isRequired,
  section: PropTypes.shape({
    nodeColor: PropTypes.string,
    textColor: PropTypes.string,
  }).isRequired,
  isActive: PropTypes.bool.isRequired,
  isVisible: PropTypes.bool.isRequired,
};

export default TimelineContent;
