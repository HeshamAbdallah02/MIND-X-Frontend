// frontend/src/components/events/EventCard.js
// Reusable Event Card Component for Past Events Grid
import React from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiUsers } from 'react-icons/fi';

const EventCard = ({ event, index = 0 }) => {
  if (!event) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
    >
      {/* Event Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.coverImage?.url}
          alt={event.coverImage?.alt || event.title?.text}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Event Content */}
      <div className="p-6">
        {/* Event Title */}
        <h3 
          className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-[#FBB859] transition-colors"
          style={{ color: event.title?.color || '#606161' }}
        >
          {event.title?.text}
        </h3>

        {/* Event Meta */}
        <div className="space-y-2 mb-4">
          {/* Date */}
          {event.date?.text && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FiCalendar className="w-4 h-4 text-[#FBB859] flex-shrink-0" />
              <span className="line-clamp-1">{event.date.text}</span>
            </div>
          )}

          {/* Location */}
          {event.location?.venue && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FiMapPin className="w-4 h-4 text-[#FBB859] flex-shrink-0" />
              <span className="line-clamp-1">{event.location.venue}</span>
            </div>
          )}

          {/* Attendees */}
          {event.attendeeCount > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FiUsers className="w-4 h-4 text-[#FBB859] flex-shrink-0" />
              <span>{event.attendeeCount} attended</span>
            </div>
          )}
        </div>

        {/* Description Preview */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {event.description?.text}
        </p>

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {event.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded"
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

        {/* View Details Button */}
        {event.url && (
          <a
            href={event.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm font-semibold text-[#FBB859] hover:text-[#f9a63d] transition-colors group/link"
          >
            View Details
            <svg
              className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        )}
      </div>
    </motion.div>
  );
};

export default EventCard;
