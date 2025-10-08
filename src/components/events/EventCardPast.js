// frontend/src/components/events/EventCardPast.js
// Modified Event Card for Past Events - Always shows View Details button
import React from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiUsers, FiArrowRight } from 'react-icons/fi';

// Simple date formatter to avoid date-fns conflicts
const formatEventDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

const EventCardPast = ({ event, index = 0, onClick }) => {
  if (!event) return null;

  const handleClick = () => {
    if (onClick) {
      onClick(event);
    } else {
      // Fallback: Navigate to event details page
      window.location.href = `/events/${event._id}`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer"
      onClick={handleClick}
    >
      {/* Event Image with 16:9 ratio */}
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <img
          src={event.coverImage?.url}
          alt={event.coverImage?.alt || event.title?.text}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Past Event Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-gray-500/90 backdrop-blur-sm rounded-full shadow-lg">
            Past Event
          </span>
        </div>
      </div>

      {/* Event Content */}
      <div className="p-6">
        {/* Event Title - Max 2 lines with ellipsis */}
        <h3 
          className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-[#FBB859] transition-colors min-h-[3.5rem]"
          style={{ color: event.title?.color || '#606161' }}
        >
          {event.title?.text}
        </h3>

        {/* Event Meta Information */}
        <div className="space-y-2 mb-4">
          {/* Date & Time */}
          {event.eventDate && (
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <FiCalendar className="w-4 h-4 text-[#FBB859] flex-shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span>{formatEventDate(event.eventDate)}</span>
                {event.eventTime?.start && (
                  <span className="text-xs text-gray-500">
                    {event.eventTime.start}
                    {event.eventTime.end && ` - ${event.eventTime.end}`}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Location */}
          {event.location?.venue && (
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <FiMapPin className="w-4 h-4 text-[#FBB859] flex-shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="line-clamp-1">{event.location.venue}</span>
                {event.location.address && (
                  <span className="text-xs text-gray-500 line-clamp-1">
                    {event.location.address}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Attendee Count */}
          {event.attendeeCount > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FiUsers className="w-4 h-4 text-[#FBB859] flex-shrink-0" />
              <span>
                {event.attendeeCount} {event.attendeeCount === 1 ? 'attendee' : 'attendees'}
              </span>
            </div>
          )}
        </div>

        {/* Description Preview - Max 2 lines */}
        {event.description?.text && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
            {event.description.text}
          </p>
        )}

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {event.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                {tag}
              </span>
            ))}
            {event.tags.length > 3 && (
              <span className="px-2 py-1 text-xs font-medium text-gray-500">
                +{event.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Highlights */}
        {event.highlights && event.highlights.length > 0 && (
          <div className="mb-4">
            <ul className="text-xs text-gray-600 space-y-1">
              {event.highlights.slice(0, 2).map((highlight, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#81C99C] mt-0.5">✓</span>
                  <span className="line-clamp-1">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* View Details Button - Always present */}
        <div className="pt-4 border-t border-gray-100">
          <button
            onClick={handleClick}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#606161] border-2 border-[#606161] rounded-lg hover:bg-[#606161] hover:text-white transition-all duration-300 group/btn"
          >
            View Details
            <FiArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCardPast;
