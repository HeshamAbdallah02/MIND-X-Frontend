// frontend/src/components/events/FeaturedEventSection.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiCalendar, 
  FiClock, 
  FiMapPin, 
  FiUsers, 
  FiAlertCircle 
} from 'react-icons/fi';
import { useFeaturedEvent } from '../../services/featuredEventService';
import FeaturedEventSkeleton from './FeaturedEventSkeleton';

const FeaturedEventSection = () => {
  const { data: event, isLoading, error, refetch } = useFeaturedEvent();

  // Loading state
  if (isLoading) {
    return <FeaturedEventSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <section className="relative w-full bg-gray-50 flex items-center justify-center py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md mx-4"
        >
          <FiAlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Unable to Load Event
          </h3>
          <p className="text-gray-600 mb-6">
            We couldn't fetch the featured event. Please try again.
          </p>
          <button
            onClick={() => refetch()}
            className="px-6 py-3 bg-[#FBB859] text-white rounded-lg font-semibold hover:bg-[#f9a63d] transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Try Again
          </button>
        </motion.div>
      </section>
    );
  }

  // No upcoming events state
  if (!event) {
    return (
      <section className="relative w-full bg-gray-50 flex items-center justify-center py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-md mx-4"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <FiCalendar className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-3">
            No Upcoming Events
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Stay tuned! We're planning exciting events. Check out our past events below or follow us for updates.
          </p>
          <button
            onClick={() => {
              const pastEventsSection = document.getElementById('past-events');
              pastEventsSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-6 py-3 bg-[#81C99C] text-white rounded-lg font-semibold hover:bg-[#6fb889] transition-all duration-300 shadow-md hover:shadow-lg"
          >
            View Past Events
          </button>
        </motion.div>
      </section>
    );
  }

  // Main featured event display
  return (
    <section className="relative w-full bg-gray-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="grid md:grid-cols-2 gap-0">
            {/* Left Side - Image */}
            <div className="relative h-64 md:h-auto">
              {/* Featured Badge */}
              <div className="absolute top-6 left-6 z-10">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#FBB859] text-white rounded-full text-sm font-semibold shadow-lg">
                  ⭐ Featured Event
                </span>
              </div>

              {/* Event Image */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent">
                <img
                  src={event.coverImage?.url}
                  alt={event.coverImage?.alt || event.title?.text}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right Side - Details */}
            <div className="p-8 md:py-10 md:px-12 lg:py-12 lg:px-16 flex flex-col justify-center bg-white min-h-[calc(100vh-64px)]">
              {/* Event Title */}
              <h3 
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ color: event.title?.color || '#606161' }}
              >
                {event.title?.text}
              </h3>

              {/* Event Meta Info - Two Column Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {/* Date */}
                {event.date?.text && (
                  <div className="flex items-start gap-3">
                    <FiCalendar className="w-5 h-5 text-[#FBB859] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">
                      {event.date.text}
                    </span>
                  </div>
                )}

                {/* Time */}
                {event.eventTime && event.eventTime.start && (
                  <div className="flex items-start gap-3">
                    <FiClock className="w-5 h-5 text-[#FBB859] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      {event.eventTime.start}
                    </span>
                  </div>
                )}

                {/* Location */}
                {event.location && (event.location.venue || event.location.address) && (
                  <div className="flex items-start gap-3">
                    <FiMapPin className="w-5 h-5 text-[#FBB859] mt-0.5 flex-shrink-0" />
                    <div className="text-gray-700">
                      {event.location.venue && (
                        <div className="font-medium">{event.location.venue}</div>
                      )}
                      {event.location.address && (
                        <div className="text-sm text-gray-600">{event.location.address}</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Attendee Count */}
                {event.attendeeCount > 0 && (
                  <div className="flex items-start gap-3">
                    <FiUsers className="w-5 h-5 text-[#FBB859] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      {event.attendeeCount}
                      {event.maxAttendees && `/${event.maxAttendees}`} registered
                    </span>
                  </div>
                )}
              </div>

              {/* Price Info */}
              {event.price && (event.price.regular || event.price.student) && (
                <div className="mb-4">
                  <div className="text-gray-700">
                    <span className="text-2xl font-bold" style={{ color: '#606161' }}>
                      {event.price.currency || '$'}{event.price.regular}
                    </span>
                    {event.price.student && (
                      <span className="text-sm ml-2">
                        (Students: {event.price.currency || '$'}{event.price.student})
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Early Bird Pricing */}
              {event.earlyBirdPrice && event.earlyBirdPrice.amount && (
                <div className="mb-6">
                  <span className="inline-block px-3 py-1 bg-[#FBB859] text-white text-sm font-semibold rounded-full">
                    Early Bird: {event.price?.currency || '$'}{event.earlyBirdPrice.amount}
                    {event.earlyBirdPrice.deadline && 
                      ` (until ${new Date(event.earlyBirdPrice.deadline).toLocaleDateString()})`
                    }
                  </span>
                </div>
              )}

              {/* Description Preview */}
              <p 
                className="text-gray-600 mb-6 line-clamp-3"
                style={{ color: event.description?.color || '#606161' }}
              >
                {event.description?.text}
              </p>

              {/* Event Highlights */}
              {event.highlights && event.highlights.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Event Highlights:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {event.highlights.slice(0, 4).map((highlight, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-[#FBB859] text-lg">●</span>
                        <span className="text-sm text-gray-700">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Registration Progress Bar */}
              {event.maxAttendees && event.attendeeCount > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      Registration Progress
                    </span>
                    <span className="text-sm font-bold text-[#FBB859]">
                      {Math.round((event.attendeeCount / event.maxAttendees) * 100)}% full
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#FBB859] h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min((event.attendeeCount / event.maxAttendees) * 100, 100)}%`
                      }}
                    />
                  </div>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Register Button */}
                {event.registrationLink && (
                  <a
                    href={event.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#FBB859] text-white rounded-lg font-semibold hover:bg-[#f9a63d] transition-all duration-300 shadow-md hover:shadow-lg group"
                  >
                    Register Now
                  </a>
                )}

                {/* View Details Button - Always present */}
                <button
                  onClick={() => {
                    window.location.href = `/events/${event._id}`;
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#606161] text-[#606161] rounded-lg font-semibold hover:bg-[#606161] hover:text-white transition-all duration-300 group"
                >
                  View Details
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
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
                </button>
              </div>

              {/* Countdown Timer */}
              {event.eventDate && (
                <CountdownTimer targetDate={event.eventDate} />
              )}
            </div>
          </div>
        </motion.div>
      </section>
  );
};

// Countdown Timer Component
const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  function calculateTimeLeft(target) {
    const difference = new Date(target) - new Date();
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  // Only show if event is within 30 days
  if (timeLeft.days > 30) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-6 pt-6 border-t border-gray-200"
    >
      <div className="text-center">
        <p className="text-sm font-medium text-gray-600 mb-3">Event Starts In</p>
        <div className="grid grid-cols-4 gap-3">
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div key={unit} className="bg-gray-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-[#FBB859]">
                {String(value).padStart(2, '0')}
              </div>
              <div className="text-xs text-gray-600 uppercase mt-1">
                {unit}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturedEventSection;
