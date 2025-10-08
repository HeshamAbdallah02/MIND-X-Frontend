// frontend/src/components/eventDetails/NotFoundState.js
import React from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiArrowLeft, FiCalendar } from 'react-icons/fi';

const NotFoundState = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
      >
        {/* 404 Icon */}
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#81C99C]/20 to-[#FBB859]/20 rounded-full flex items-center justify-center">
          <FiSearch className="text-[#606161]" size={40} />
        </div>

        {/* 404 Title */}
        <h1 className="text-6xl font-bold text-[#FBB859] mb-3">404</h1>
        
        <h2 className="text-2xl font-bold text-black mb-3">
          Event Not Found
        </h2>

        {/* Description */}
        <p className="text-[#606161] text-lg mb-8">
          We couldn't find the event you're looking for. It may have been removed or the link might be incorrect.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onBack}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FBB859] to-[#81C99C] text-white font-semibold rounded-lg hover:scale-105 transition-transform shadow-md"
          >
            <FiArrowLeft size={18} />
            Back to Events
          </button>
          
          <a
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-[#606161] text-[#606161] font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FiCalendar size={18} />
            Browse All Events
          </a>
        </div>

        {/* Decorative Element */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-[#606161]">
            Looking for something specific?
          </p>
          <p className="text-sm text-[#606161] mt-1">
            Check out our{' '}
            <a href="/events" className="text-[#FBB859] hover:underline font-medium">
              upcoming events
            </a>
            {' '}or{' '}
            <a href="/events#past" className="text-[#81C99C] hover:underline font-medium">
              past events
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundState;
