// frontend/src/components/eventDetails/OverviewSection.js
import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiCalendar, 
  FiClock, 
  FiMapPin, 
  FiUsers,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';

const OverviewSection = ({ event }) => {
  // Calculate if event is past
  const isPast = new Date(event.eventDate) < new Date();
  
  // Calculate registration percentage
  const registrationPercentage = event.maxAttendees 
    ? Math.round((event.attendeeCount / event.maxAttendees) * 100)
    : null;

  // Determine registration status
  const getRegistrationStatus = () => {
    if (isPast) {
      return {
        text: `${event.attendeeCount} Attended`,
        color: 'text-[#606161]',
        icon: FiUsers
      };
    }
    if (event.attendeeCount >= event.maxAttendees) {
      return {
        text: 'Event Full',
        color: 'text-red-500',
        icon: FiAlertCircle
      };
    }
    const spotsLeft = event.maxAttendees - event.attendeeCount;
    return {
      text: `${spotsLeft} spots left`,
      color: 'text-[#81C99C]',
      icon: FiCheckCircle
    };
  };

  const registrationStatus = getRegistrationStatus();
  const StatusIcon = registrationStatus.icon;

  return (
    <div className="py-16 md:py-20">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Event Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
            {event.title?.text}
          </h1>

          {/* Meta Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Date */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <FiCalendar className="text-[#FBB859] flex-shrink-0 mt-1" size={24} />
              <div>
                <p className="text-sm text-[#606161] mb-1">Date</p>
                <p className="font-semibold text-black">{event.date?.text}</p>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <FiClock className="text-[#FBB859] flex-shrink-0 mt-1" size={24} />
              <div>
                <p className="text-sm text-[#606161] mb-1">Time</p>
                <p className="font-semibold text-black">
                  {event.eventTime?.start}
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <FiMapPin className="text-[#81C99C] flex-shrink-0 mt-1" size={24} />
              <div>
                <p className="text-sm text-[#606161] mb-1">Location</p>
                <p className="font-semibold text-black">{event.location?.venue}</p>
                {event.location?.address && (
                  <p className="text-sm text-[#606161] mt-1">{event.location.address}</p>
                )}
              </div>
            </div>

            {/* Attendance */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <StatusIcon className={`${registrationStatus.color} flex-shrink-0 mt-1`} size={24} />
              <div>
                <p className="text-sm text-[#606161] mb-1">
                  {isPast ? 'Attendance' : 'Registration'}
                </p>
                <p className="font-semibold text-black">
                  {event.attendeeCount}
                  {event.maxAttendees && `/${event.maxAttendees}`}
                </p>
                <p className={`text-sm ${registrationStatus.color} font-medium mt-1`}>
                  {registrationStatus.text}
                </p>
              </div>
            </div>
          </div>

          {/* Registration Progress Bar (if upcoming) */}
          {!isPast && registrationPercentage !== null && (
            <div className="mb-8 p-4 bg-gradient-to-r from-[#FBB859]/10 to-[#81C99C]/10 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-[#606161]">Registration Progress</span>
                <span className="text-sm font-bold text-[#FBB859]">{registrationPercentage}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${registrationPercentage}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  viewport={{ once: true }}
                  className="h-full bg-gradient-to-r from-[#FBB859] to-[#81C99C]"
                />
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">About This Event</h2>
            <p className="text-[#606161] text-lg leading-relaxed whitespace-pre-line">
              {event.description?.text}
            </p>
          </div>

          {/* Highlights */}
          {event.highlights && event.highlights.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-black mb-4">Event Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {event.highlights.map((highlight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3 p-4 bg-gradient-to-r from-[#FBB859]/5 to-[#81C99C]/5 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <FiCheckCircle className="text-[#81C99C] flex-shrink-0 mt-0.5" size={20} />
                    <p className="text-[#606161] font-medium">{highlight}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default OverviewSection;
