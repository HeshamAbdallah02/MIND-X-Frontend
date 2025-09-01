//frontend/src/components/our-story/OurJourney/components/TimelinePhase.js
import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { useIntersection } from '../../../../hooks/useIntersection';
import TimelineNode from './TimelineNode';
import TimelineContent from './TimelineContent';

const TimelinePhase = React.memo(({ 
  phase, 
  index, 
  section, 
  isActive, 
  onActivate, 
  totalPhases 
}) => {
  const [ref, isVisible] = useIntersection({ 
    threshold: 0.3,
    triggerOnce: false 
  });

  // Add ref to prevent multiple activations
  const hasActivated = React.useRef(false);

  // Activate phase when it becomes visible - optimized to prevent loops
  React.useEffect(() => {
    if (isVisible && !hasActivated.current) {
      hasActivated.current = true;
      onActivate();
    } else if (!isVisible) {
      hasActivated.current = false;
    }
  }, [isVisible]); // eslint-disable-line react-hooks/exhaustive-deps

  const phaseVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        delay: index * 0.2,
        ease: 'easeOut'
      }
    }
  };

  // Position-based styling
  const getPositionClasses = () => {
    const position = phase.calculatedPosition;
    
    if (position === 'center') {
      return 'flex flex-col items-center text-center pl-12 sm:pl-0';
    }
    
    if (position === 'left') {
      return 'sm:flex sm:flex-row-reverse sm:text-right pl-12 sm:pl-0 sm:pr-1/2';
    }
    
    if (position === 'right') {
      return 'sm:flex sm:flex-row sm:text-left pl-12 sm:pl-1/2 sm:pl-0';
    }
    
    return 'flex flex-col items-center text-center pl-12 sm:pl-0';
  };

  const getContentClasses = () => {
    const position = phase.calculatedPosition;
    
    if (position === 'left') {
      return 'sm:mr-8 lg:mr-12';
    }
    
    if (position === 'right') {
      return 'sm:ml-8 lg:ml-12';
    }
    
    return '';
  };

  return (
    <motion.div
      ref={ref}
      variants={phaseVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      className={`relative ${getPositionClasses()}`}
      role="article"
      aria-labelledby={`phase-${phase.id}-headline`}
    >
      {/* Timeline Node */}
      <TimelineNode 
        phase={phase}
        section={section}
        isActive={isActive}
        isVisible={isVisible}
        index={index}
      />

      {/* Phase Content */}
      <div className={`flex-1 ${getContentClasses()}`}>
        <TimelineContent 
          phase={phase}
          section={section}
          isActive={isActive}
          isVisible={isVisible}
        />
      </div>
    </motion.div>
  );
});

TimelinePhase.propTypes = {
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
    calculatedPosition: PropTypes.oneOf(['left', 'right', 'center']),
  }).isRequired,
  index: PropTypes.number.isRequired,
  section: PropTypes.shape({
    lineColor: PropTypes.string,
    nodeColor: PropTypes.string,
    textColor: PropTypes.string,
  }).isRequired,
  isActive: PropTypes.bool.isRequired,
  onActivate: PropTypes.func.isRequired,
  totalPhases: PropTypes.number.isRequired,
};

export default TimelinePhase;
