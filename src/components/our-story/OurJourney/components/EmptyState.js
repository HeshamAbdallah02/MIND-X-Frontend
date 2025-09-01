//frontend/src/components/our-story/OurJourney/components/EmptyState.js
import React from 'react';
import { motion } from 'framer-motion';

const EmptyState = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-2xl mx-auto text-center py-16"
    >
      {/* Empty state illustration */}
      <div className="w-24 h-24 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center">
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
        </svg>
      </div>

      {/* Empty state content */}
      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        Timeline Coming Soon
      </h3>
      
      <p className="text-gray-600 mb-8 leading-relaxed">
        We're currently working on putting together our journey timeline. 
        Check back soon to see the milestones and achievements that have shaped MIND-X.
      </p>

      {/* Call to action */}
      <div className="space-y-4">
        <motion.div
          className="inline-flex items-center px-6 py-3 bg-[#FBB859]/10 text-[#FBB859] rounded-lg font-medium"
          whileHover={{ scale: 1.05 }}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Coming Soon
        </motion.div>
        
        <p className="text-sm text-gray-500">
          In the meantime, explore our other sections to learn more about MIND-X
        </p>
      </div>
    </motion.div>
  );
};

export default EmptyState;
