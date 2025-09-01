//frontend/src/components/our-story/OurJourney/components/ErrorState.js
import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const ErrorState = ({ error, onRetry }) => {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-2xl mx-auto text-center py-16"
    >
      {/* Error icon */}
      <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
        <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      {/* Error message */}
      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        Failed to Load Timeline
      </h3>
      
      <p className="text-gray-600 mb-8 leading-relaxed">
        We're having trouble loading the timeline content. This might be due to a network issue or server problem.
      </p>

      {/* Technical details (if available) */}
      {error?.message && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-left">
          <h4 className="text-sm font-medium text-red-800 mb-2">Technical Details:</h4>
          <p className="text-sm text-red-700 font-mono">{error.message}</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <motion.button
          onClick={onRetry}
          className="px-6 py-3 bg-[#FBB859] text-white rounded-lg font-medium hover:bg-[#F1A94E] transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Try Again
        </motion.button>
        
        <motion.button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Reload Page
        </motion.button>
      </div>

      {/* Contact support */}
      <p className="text-sm text-gray-500 mt-8">
        If the problem persists, please{' '}
        <a href="mailto:support@mind-x.org" className="text-[#81C99C] hover:underline">
          contact our support team
        </a>
      </p>
    </motion.div>
  );
};

ErrorState.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  onRetry: PropTypes.func.isRequired,
};

export default ErrorState;
