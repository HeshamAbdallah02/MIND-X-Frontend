// frontend/src/components/our-story/SeasonsSection/components/SeasonCard.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiStar } from 'react-icons/fi';
import YearBadge from './YearBadge';
import ExpandToggle from './ExpandToggle';
import BoardMemberGrid from './BoardMemberGrid';
import HighlightsList from './HighlightsList';

const SeasonCard = ({ season, isExpanded, onToggleExpand }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer group"
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      layout
    >
      {/* Image Section with Year Badge */}
      <div className="relative h-48 overflow-hidden">
        {!imageError && season.coverImage ? (
          <img
            src={season.coverImage}
            alt={`${season.theme} - ${season.year}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 flex items-center justify-center">
            <div className="text-center text-white">
              <FiStar className="w-16 h-16 mx-auto mb-4 opacity-80" />
              <p className="text-lg font-semibold">{season.theme}</p>
            </div>
          </div>
        )}
        
        {/* Year Badge - Top Left */}
        <div className="absolute top-4 left-4">
          <YearBadge year={season.year} />
        </div>
      </div>

      {/* White Content Section */}
      <div className="p-6 bg-white relative">
        {/* Season Theme/Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-8">
          {season.theme}
        </h3>
        
        {/* Expand Toggle Button - Bottom Right */}
        <div className="absolute bottom-4 right-4">
          <ExpandToggle
            isExpanded={isExpanded}
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(season.id);
            }}
          />
        </div>

        {/* Board Members and Highlights Info - Bottom */}
        <div className="flex items-center space-x-6 text-gray-600 text-sm absolute bottom-4 left-6">
          <div className="flex items-center">
            <FiUsers className="w-4 h-4 mr-2" />
            <span>{season.boardMembers?.length || 5} Leaders</span>
          </div>
          <div className="flex items-center">
            <FiStar className="w-4 h-4 mr-2" />
            <span>{season.highlights?.length || 3} Achievements</span>
          </div>
        </div>
      </div>
      
      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ 
              height: { duration: 0.3, ease: 'easeInOut' },
              opacity: { duration: 0.2, delay: isExpanded ? 0.1 : 0 }
            }}
            className="overflow-hidden"
          >
            <div className="p-8 bg-white space-y-8">
              {/* Board Members Section */}
              {season.boardMembers && season.boardMembers.length > 0 && (
                <BoardMemberGrid boardMembers={season.boardMembers} />
              )}
              
              {/* Highlights Section */}
              {season.highlights && season.highlights.length > 0 && (
                <HighlightsList highlights={season.highlights} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SeasonCard;
