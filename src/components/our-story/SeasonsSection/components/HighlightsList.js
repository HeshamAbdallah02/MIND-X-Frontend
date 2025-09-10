// frontend/src/components/our-story/SeasonsSection/components/HighlightsList.js
import React from 'react';
import { FiStar } from 'react-icons/fi';

const HighlightsList = ({ highlights }) => {
  if (!highlights || highlights.length === 0) {
    return (
      <div className="text-center py-6">
        <FiStar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600">No highlights data available</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <FiStar className="w-6 h-6 mr-2 text-yellow-600" />
        Season Highlights
      </h3>
      <ul className="space-y-4">
        {highlights.map((highlight, index) => (
          <li key={index} className="flex items-start">
            {/* Custom golden bullet point */}
            <div className="flex-shrink-0 w-3 h-3 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mt-2 mr-4 shadow-sm"></div>
            <p className="text-gray-700 leading-relaxed text-base">
              {highlight}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HighlightsList;
