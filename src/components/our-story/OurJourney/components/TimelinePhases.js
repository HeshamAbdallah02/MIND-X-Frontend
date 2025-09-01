//frontend/src/components/our-story/OurJourney/components/TimelinePhases.js
import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import TimelinePhase from './TimelinePhase';

const TimelinePhases = React.memo(({ phases, section, activePhaseId, onPhaseActivate }) => {
  // Memoize the callback to prevent unnecessary re-renders - optimized version
  const memoizedOnActivate = useCallback((phaseId) => {
    if (activePhaseId !== phaseId) {
      onPhaseActivate(phaseId);
    }
  }, [activePhaseId, onPhaseActivate]);

  const containerVariants = {
    visible: {
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  // Determine layout positions for desktop - memoized to prevent recalculations
  const phasesWithPositions = useMemo(() => {
    return phases.map((phase, index) => {
      let position = phase.position;
      
      // Auto-calculate position if not explicitly set
      if (!position || position === 'auto') {
        if (window.innerWidth < 640) {
          position = 'center'; // Mobile: always center
        } else {
          position = index % 2 === 0 ? 'left' : 'right'; // Alternating for tablet/desktop
        }
      }
      
      return { ...phase, calculatedPosition: position };
    });
  }, [phases]);

  return (
    <motion.div 
      className="relative space-y-12 sm:space-y-16 lg:space-y-20"
      variants={containerVariants}
    >
      {phasesWithPositions.map((phase, index) => (
        <TimelinePhase
          key={phase.id}
          phase={phase}
          index={index}
          section={section}
          isActive={activePhaseId === phase.id}
          onActivate={() => memoizedOnActivate(phase.id)}
          totalPhases={phases.length}
        />
      ))}
    </motion.div>
  );
});

TimelinePhases.propTypes = {
  phases: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      year: PropTypes.string.isRequired,
      headline: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      imageUrl: PropTypes.string,
      imageAlt: PropTypes.string,
      backgroundColor: PropTypes.string,
      textColor: PropTypes.string,
      accentColor: PropTypes.string,
      position: PropTypes.oneOf(['left', 'right', 'center']),
      isActive: PropTypes.bool.isRequired,
      order: PropTypes.number.isRequired,
    })
  ).isRequired,
  section: PropTypes.shape({
    lineColor: PropTypes.string,
    nodeColor: PropTypes.string,
    textColor: PropTypes.string,
  }).isRequired,
  activePhaseId: PropTypes.string,
  onPhaseActivate: PropTypes.func.isRequired,
};

export default TimelinePhases;
