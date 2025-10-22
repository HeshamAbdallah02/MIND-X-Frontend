// frontend/src/components/eventDetails/RegisterSection.js
import React from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiClock, FiUsers, FiDollarSign } from 'react-icons/fi';

const RegisterSection = ({ registration, price, registrationLink, maxAttendees, attendeeCount }) => {
  // Calculate spots remaining
  const spotsAvailable = registration?.spots?.available || (maxAttendees ? maxAttendees - attendeeCount : null);
  const totalSpots = registration?.spots?.total || maxAttendees;
  const spotsPercentage = spotsAvailable && totalSpots ? ((spotsAvailable / totalSpots) * 100) : 100;

  // Default values
  const headline = registration?.headline || 'Register for This Event';
  const description = registration?.description || 'Secure your spot and join us for an amazing experience!';
  const buttonText = registration?.buttonText || 'Register Now';
  const isFree = registration?.isFree !== undefined ? registration.isFree : (price?.regular === 0 || !price?.regular);
  const benefits = registration?.benefits || [
    'Access to all sessions and workshops',
    'Networking opportunities with industry experts',
    'Certificate of participation',
    'Event materials and resources'
  ];

  return (
    <div className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-black mb-4">{headline}</h2>
          <p className="text-[#606161] text-lg max-w-3xl mx-auto">{description}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Registration Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Price Card */}
            <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
              <div className="flex items-start gap-3 mb-4">
                <FiDollarSign className="text-[#FBB859] mt-1" size={24} />
                <div>
                  <h3 className="text-xl font-bold text-black mb-2">
                    {isFree ? 'Free Event' : 'Event Pricing'}
                  </h3>
                  {!isFree && price && (
                    <div className="space-y-2">
                      {price.regular && (
                        <p className="text-2xl font-bold text-[#FBB859]">
                          {price.currency}{price.regular}
                          <span className="text-sm text-[#606161] font-normal ml-2">Regular Price</span>
                        </p>
                      )}
                      {price.student && (
                        <p className="text-lg text-[#606161]">
                          {price.currency}{price.student}
                          <span className="text-sm ml-2">Student Price</span>
                        </p>
                      )}
                    </div>
                  )}
                  {isFree && (
                    <p className="text-[#606161]">No registration fee required</p>
                  )}
                </div>
              </div>
            </div>

            {/* Availability */}
            {spotsAvailable && totalSpots && (
              <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
                <div className="flex items-start gap-3 mb-4">
                  <FiUsers className="text-[#FBB859] mt-1" size={24} />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-black mb-2">Spots Available</h3>
                    <p className="text-[#606161] mb-3">
                      <span className="text-2xl font-bold text-black">{spotsAvailable}</span>
                      <span className="text-sm ml-2">of {totalSpots} spots remaining</span>
                    </p>
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          spotsPercentage > 50 ? 'bg-[#81C99C]' : 
                          spotsPercentage > 25 ? 'bg-[#FBB859]' : 'bg-red-500'
                        }`}
                        style={{ width: `${spotsPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Registration Deadline */}
            {registration?.deadline && (
              <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
                <div className="flex items-start gap-3">
                  <FiClock className="text-[#FBB859] mt-1" size={24} />
                  <div>
                    <h3 className="text-xl font-bold text-black mb-2">Registration Deadline</h3>
                    <p className="text-[#606161]">
                      {new Date(registration.deadline).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Right Column - Benefits */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#FBB859]/10 to-[#81C99C]/10 rounded-lg p-8 border-2 border-[#FBB859]/20"
          >
            <h3 className="text-2xl font-bold text-black mb-6">What's Included</h3>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + (index * 0.1) }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-[#81C99C] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FiCheck className="text-white" size={14} />
                  </div>
                  <p className="text-[#606161] leading-relaxed">{benefit}</p>
                </motion.div>
              ))}
            </div>

            {/* Register Button */}
            <motion.a
              href={registrationLink || '#'}
              target={registrationLink ? '_blank' : '_self'}
              rel={registrationLink ? 'noopener noreferrer' : ''}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-8 w-full bg-[#FBB859] hover:bg-[#FBB859]/90 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-lg"
            >
              {buttonText}
              <span className="text-2xl">→</span>
            </motion.a>

            {spotsAvailable && spotsPercentage < 25 && (
              <p className="mt-4 text-center text-red-600 text-sm font-medium">
                ⚠️ Limited spots remaining - Register now!
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RegisterSection;
