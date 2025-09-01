//frontend/src/components/our-story/OurJourney/index.js
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Timeline from './components/Timeline';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import EmptyState from './components/EmptyState';
import { fetchTimelineData } from '../../../services/timelineAPI';
import { useIntersection } from '../../../hooks/useIntersection';

const OurJourney = () => {
  const [ref, isVisible] = useIntersection({ 
    threshold: 0.1,
    triggerOnce: true 
  });
  
  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['timeline'],
    queryFn: fetchTimelineData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: process.env.NODE_ENV === 'development' ? false : 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    // Use fallback data immediately in development
    placeholderData: process.env.NODE_ENV === 'development' ? {
      sections: [{
        id: 'main',
        title: 'Our Journey',
        subtitle: 'Building the future of education',
        backgroundColor: '#ffffff',
        lineColor: '#E5E5E5',
        nodeColor: '#FBB859',
        textColor: '#1e293b',
        isActive: true,
        order: 0,
      }],
      phases: []
    } : undefined,
  });

  // Extract sections and phases from response
  const sections = data?.sections || [];
  const phases = data?.phases || [];
  
  // Find active section (first active section or fallback)
  const activeSection = sections.find(section => section.isActive) || sections[0];
  
  // Filter phases for active section
  const activePhasesData = phases
    .filter(phase => phase.isActive && phase.sectionId === activeSection?.id)
    .sort((a, b) => a.order - b.order);

  // Loading state
  if (isLoading) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingState />
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorState error={error} onRetry={refetch} />
        </div>
      </section>
    );
  }

  // Empty state
  if (!activeSection || activePhasesData.length === 0) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <EmptyState />
        </div>
      </section>
    );
  }

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="relative py-12 sm:py-16 lg:py-20 bg-white"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {activeSection.title}
          </h2>
          {activeSection.subtitle && (
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              {activeSection.subtitle}
            </p>
          )}
        </motion.div>

        {/* Timeline */}
        <Timeline 
          phases={activePhasesData}
          section={activeSection}
          isVisible={isVisible}
        />
      </div>
    </motion.section>
  );
};

export default OurJourney;
