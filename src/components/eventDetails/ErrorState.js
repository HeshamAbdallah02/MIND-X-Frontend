// frontend/src/components/eventDetails/ErrorState.js
import React from 'react';
import { motion } from 'framer-motion';
import { FiAlertCircle, FiRefreshCw, FiArrowLeft } from 'react-icons/fi';

const ErrorState = ({ error, onRetry, onBack }) => {
  const errorMessage = error?.response?.data?.message || error?.message || 'Something went wrong';
  const statusCode = error?.response?.status;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
      >
        {/* Error Icon */}
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
          <FiAlertCircle className="text-red-500" size={40} />
        </div>

        {/* Error Title */}
        <h1 className="text-3xl font-bold text-black mb-3">
          Oops! Something Went Wrong
        </h1>

        {/* Error Message */}
        <p className="text-[#606161] text-lg mb-6">
          {errorMessage}
        </p>

        {/* Status Code */}
        {statusCode && (
          <p className="text-sm text-[#606161] mb-6">
            Error Code: <span className="font-mono font-semibold">{statusCode}</span>
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onRetry}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FBB859] to-[#81C99C] text-white font-semibold rounded-lg hover:scale-105 transition-transform shadow-md"
          >
            <FiRefreshCw size={18} />
            Try Again
          </button>
          
          <button
            onClick={onBack}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-[#606161] text-[#606161] font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FiArrowLeft size={18} />
            Back to Events
          </button>
        </div>

        {/* Help Text */}
        <p className="text-sm text-[#606161] mt-8">
          If the problem persists, please contact our support team.
        </p>
      </motion.div>
    </div>
  );
};

export default ErrorState;
