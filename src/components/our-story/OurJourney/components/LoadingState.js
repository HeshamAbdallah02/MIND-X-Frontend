//frontend/src/components/our-story/OurJourney/components/LoadingState.js
import React from 'react';
import { motion } from 'framer-motion';

const LoadingState = () => {
  const skeletonVariants = {
    loading: {
      opacity: [0.3, 0.7, 0.3],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header skeleton */}
      <div className="text-center mb-16">
        <motion.div
          variants={skeletonVariants}
          animate="loading"
          className="h-12 bg-gray-200 rounded-lg w-64 mx-auto mb-4"
        />
        <motion.div
          variants={skeletonVariants}
          animate="loading"
          className="h-6 bg-gray-200 rounded-lg w-96 mx-auto"
          style={{ animationDelay: '0.2s' }}
        />
      </div>

      {/* Timeline skeleton */}
      <div className="relative space-y-16">
        {/* Timeline line */}
        <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 sm:transform sm:-translate-x-0.5" />

        {/* Timeline items */}
        {[1, 2, 3, 4].map((item, index) => (
          <div key={item} className="relative flex items-center pl-12 sm:pl-0">
            {/* Node skeleton */}
            <motion.div
              variants={skeletonVariants}
              animate="loading"
              className="absolute left-4 sm:left-1/2 sm:transform sm:-translate-x-1/2 w-4 h-4 bg-gray-200 rounded-full"
              style={{ animationDelay: `${index * 0.1}s` }}
            />

            {/* Content skeleton */}
            <div className={`flex-1 ${index % 2 === 0 ? 'sm:pr-1/2 sm:mr-8' : 'sm:pl-1/2 sm:ml-8'}`}>
              <motion.div
                variants={skeletonVariants}
                animate="loading"
                className="bg-white p-8 rounded-2xl shadow-lg border"
                style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
              >
                {/* Year badge skeleton */}
                <div className="h-8 w-16 bg-gray-200 rounded-full mb-4" />
                
                {/* Title skeleton */}
                <div className="h-8 bg-gray-200 rounded-lg w-3/4 mb-4" />
                
                {/* Description skeleton */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                  <div className="h-4 bg-gray-200 rounded w-4/6" />
                </div>

                {/* Image skeleton (occasionally) */}
                {index % 3 === 0 && (
                  <div className="h-48 bg-gray-200 rounded-xl mt-6" />
                )}
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingState;
