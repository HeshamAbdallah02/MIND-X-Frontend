// frontend/src/components/eventDetails/ScheduleSection.js
import React from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin } from 'react-icons/fi';

const ScheduleSection = ({ schedule, headline }) => {
  // Handle empty schedule
  if (!schedule || schedule.length === 0) {
    return (
      <div className="py-16 md:py-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <FiCalendar className="text-[#FBB859]" size={32} />
              <h2 className="text-3xl font-bold text-black">Schedule Overview</h2>
            </div>
            <p className="text-[#606161] text-lg">Schedule details coming soon...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  // Badge color mapping based on type
  const getBadgeStyles = (type) => {
    const styles = {
      keynote: {
        duration: 'bg-red-100 text-red-600',
        type: 'bg-red-500 text-white'
      },
      session: {
        duration: 'bg-blue-100 text-blue-600',
        type: 'bg-blue-500 text-white'
      },
      workshop: {
        duration: 'bg-purple-100 text-purple-600',
        type: 'bg-purple-500 text-white'
      },
      break: {
        duration: 'bg-gray-100 text-gray-600',
        type: 'bg-gray-500 text-white'
      },
      networking: {
        duration: 'bg-blue-100 text-blue-600',
        type: 'bg-blue-400 text-white'
      }
    };
    return styles[type] || styles.session;
  };

  // Timeline dot color based on type
  const getDotColor = (type) => {
    const colors = {
      keynote: 'bg-red-500',
      session: 'bg-gray-400',
      workshop: 'bg-purple-500',
      break: 'bg-gray-400',
      networking: 'bg-blue-400'
    };
    return colors[type] || 'bg-gray-400';
  };

  return (
    <div className="py-16 md:py-20">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          {/* Section Title */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <FiCalendar className="text-[#FBB859]" size={32} />
            <h2 className="text-3xl font-bold text-black">Schedule Overview</h2>
          </div>
          
          {/* Section Headline */}
          {headline && (
            <p className="text-[#606161] text-lg max-w-3xl mx-auto">
              {headline}
            </p>
          )}
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[29px] top-0 bottom-0 w-0.5 bg-gray-200" />

          {/* Schedule Items */}
          <div className="space-y-0">
            {schedule.map((item, index) => {
              const badgeStyles = getBadgeStyles(item.type);
              const dotColor = getDotColor(item.type);

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="relative pl-16 pb-8 last:pb-0"
                >
                  {/* Timeline dot */}
                  <div className={`absolute left-[22px] top-[6px] w-4 h-4 ${dotColor} rounded-full border-4 border-white shadow-md z-10`} />

                  {/* Content Card */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
                    {/* Time and Title */}
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl font-bold text-black">{item.time}</span>
                          {item.duration && (
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${badgeStyles.duration}`}>
                              {item.duration}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-semibold text-black mb-2">
                          {item.title}
                        </h3>
                        {item.speaker && (
                          <p className="text-sm text-[#606161] italic">{item.speaker}</p>
                        )}
                      </div>
                      
                      {/* Type Badge */}
                      <div className={`px-4 py-1.5 rounded-lg text-sm font-medium ${badgeStyles.type} whitespace-nowrap self-start`}>
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </div>
                    </div>

                    {/* Description */}
                    {item.description && (
                      <p className="text-[#606161] mb-4 leading-relaxed">
                        {item.description}
                      </p>
                    )}

                    {/* Location */}
                    {item.location && (
                      <div className="flex items-center gap-2 text-[#606161]">
                        <FiMapPin className="text-[#81C99C]" size={16} />
                        <span className="text-sm font-medium">{item.location}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleSection;
