//frontend/src/components/our-story/OurJourney/components/TimelineContainer.js
import React from 'react';
import PropTypes from 'prop-types';

const TimelineContainer = ({ children }) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-6xl mx-auto">
        {children}
      </div>
    </div>
  );
};

TimelineContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TimelineContainer;
