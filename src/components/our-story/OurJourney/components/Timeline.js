//frontend/src/components/our-story/OurJourney/components/Timeline.js
import React, { useState, memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { useIntersection } from '../../../../hooks/useIntersection';

const Timeline = ({ phases, section, isVisible }) => {
  if (phases.length === 0) {
    return null;
  }

  return (
    <div className="timeline-container max-w-6xl mx-auto py-8 sm:py-12 relative">
      {/* Timeline line - positioned on the left side */}
      <div className="absolute left-8 w-0.5 bg-gray-300 top-0 bottom-0" 
           style={{ backgroundColor: '#FBB859', height: '100%', minHeight: '500px' }} />
      
      {/* Timeline items */}
      <div className="space-y-8 sm:space-y-12 lg:space-y-16">
        {phases.map((phase, index) => (
          <TimelineItem 
            key={phase.id}
            phase={phase}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

const TimelineItem = memo(({ phase, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [ref, isVisible] = useIntersection({ 
    threshold: 0.3,
    triggerOnce: true // Only animate once
  });

  const handleToggle = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: 'easeOut'
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={itemVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      className="timeline-item relative flex items-start"
    >
      {/* Timeline node - positioned on the left line */}
      <div className="absolute left-8 transform -translate-x-1/2 z-10">
        <div className={`
          timeline-node w-8 h-8 rounded-full transition-all duration-300
          ${isExpanded 
            ? 'border-4 border-white shadow-lg bg-white' 
            : 'border-4 border-white shadow-lg'
          }
        `} style={{ backgroundColor: isExpanded ? 'white' : '#FBB859' }}>
          {/* Donut ring when expanded */}
          {isExpanded ? (
            <motion.div
              className="absolute inset-0 rounded-full border-4 bg-white"
              style={{ borderColor: '#FBB859' }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            />
          ) : (
            /* Solid circle when collapsed */
            <div className="absolute inset-0 rounded-full" style={{ backgroundColor: '#FBB859' }} />
          )}
          
          {/* Subtle pulse animation only on first render */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: '#FBB859' }}
            initial={{ scale: 1, opacity: 0.6 }}
            animate={isVisible ? { scale: 1.5, opacity: 0 } : { scale: 1, opacity: 0.6 }}
            transition={{ duration: 1.5, delay: index * 0.1 + 0.5 }}
          />
        </div>
      </div>

      {/* Content area - all content goes to the right of the line */}
      <div className="ml-16 w-full">
        <div className="timeline-content max-w-3xl">
          <TimelineContent 
            phase={phase} 
            isExpanded={isExpanded}
            onToggle={handleToggle}
          />
        </div>
      </div>
    </motion.div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison - only re-render if phase id or index changes
  return (
    prevProps.phase.id === nextProps.phase.id &&
    prevProps.index === nextProps.index &&
    prevProps.phase.headline === nextProps.phase.headline &&
    prevProps.phase.description === nextProps.phase.description
  );
});const TimelineContent = ({ phase, isExpanded, onToggle }) => {
  const hasLongDescription = phase.description.length > 80; // Reduced threshold for truncation
  const hasExpandableContent = hasLongDescription || phase.imageUrl;
  
  return (
    <div className="py-4">
      {/* Year badge */}
      <span className="inline-block px-3 py-1 text-sm font-bold text-white rounded-full mb-3"
            style={{ backgroundColor: '#FBB859' }}>
        {phase.year}
      </span>

      {/* Title - not clickable */}
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 leading-tight">
        {phase.headline}
      </h3>

      {/* Description with preview */}
      <div className="text-gray-600" style={{ color: '#606161' }}>
        <p className={`leading-relaxed ${!isExpanded && hasLongDescription ? 'overflow-hidden' : ''}`}>
          {!isExpanded && hasLongDescription 
            ? `${phase.description.substring(0, 80)}...` 
            : phase.description
          }
        </p>
        
        {/* Expanded content */}
        <AnimatePresence mode="wait">
          {isExpanded && phase.imageUrl && (
            <motion.div
              key={`${phase.id}-image`} // Important for AnimatePresence
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              <img 
                src={phase.imageUrl} 
                alt={phase.imageAlt}
                className="w-full max-w-2xl h-48 object-cover rounded-lg shadow-sm"
                loading="lazy"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Additional expandable content if needed */}
        <AnimatePresence mode="wait">
          {isExpanded && phase.expandableContent && (
            <motion.div
              key={`${phase.id}-content`} // Important for AnimatePresence
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mt-4 p-4 bg-gray-50 rounded-lg"
            >
              <p className="text-gray-700 text-sm">
                {phase.expandableContent}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Show more/less button */}
        {hasExpandableContent && (
          <button
            onClick={onToggle}
            className="hover:bg-orange-50 text-sm font-medium mt-3 flex items-center gap-1 transition-colors px-2 py-1 rounded"
            style={{ color: '#FBB859' }}
            aria-label={isExpanded ? 'Show less content' : 'Show more content'}
          >
            {isExpanded ? (
              <>
                Show less 
                <span className="text-xs font-bold">⌃</span>
              </>
            ) : (
              <>
                Show more 
                <span className="text-xs font-bold">⌄</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

Timeline.propTypes = {
  phases: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      year: PropTypes.string.isRequired,
      headline: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      imageUrl: PropTypes.string,
      imageAlt: PropTypes.string,
      expandable: PropTypes.bool,
    })
  ).isRequired,
  section: PropTypes.shape({
    lineColor: PropTypes.string,
    nodeColor: PropTypes.string,
    textColor: PropTypes.string,
  }).isRequired,
  isVisible: PropTypes.bool.isRequired,
};

TimelineItem.propTypes = {
  phase: PropTypes.shape({
    id: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    headline: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    imageAlt: PropTypes.string,
    expandable: PropTypes.bool,
    expandableContent: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

TimelineContent.propTypes = {
  phase: PropTypes.shape({
    year: PropTypes.string.isRequired,
    headline: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    imageAlt: PropTypes.string,
    expandable: PropTypes.bool,
    expandableContent: PropTypes.string,
  }).isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default Timeline;
