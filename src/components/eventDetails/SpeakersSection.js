// frontend/src/components/eventDetails/SpeakersSection.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaLinkedin } from 'react-icons/fa';
import { FiUser, FiExternalLink } from 'react-icons/fi';

const SpeakerCard = ({ speaker, index }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
    >
      {/* Speaker Image */}
      <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-[#81C99C]/20 to-[#FBB859]/20">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 animate-pulse bg-gray-200" />
        )}
        
        {imageError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <FiUser className="text-gray-400" size={64} />
          </div>
        ) : (
          <img
            src={speaker.image}
            alt={speaker.name}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}
      </div>

      {/* Speaker Info */}
      <div className="p-4">
        {/* Name */}
        <h3 className="text-base font-semibold text-black mb-1 group-hover:text-[#FBB859] transition-colors">
          {speaker.name}
        </h3>

        {/* Position */}
        <p className="text-[#81C99C] font-medium mb-2 text-sm">
          {speaker.position}
        </p>

        {/* Bio */}
        {speaker.bio && (
          <p className="text-[#606161] text-xs leading-relaxed mb-3 line-clamp-2">
            {speaker.bio}
          </p>
        )}

        {/* LinkedIn Button */}
        {speaker.linkedin && (
          <a
            href={speaker.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-white text-[#0A66C2] border border-[#E0E0E0] rounded-lg hover:bg-[#E8F3FF] transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md cursor-pointer"
          >
            <FaLinkedin size={16} />
            <span>LinkedIn</span>
            <FiExternalLink size={16} />
          </a>
        )}
      </div>
    </motion.div>
  );
};

const SpeakersSection = ({ speakers, headline }) => {
  // Handle empty speakers
  if (!speakers || speakers.length === 0) {
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
            <h2 className="text-3xl font-bold text-black mb-4">Meet Our Speakers</h2>
            <div className="max-w-lg mx-auto p-8 bg-white rounded-xl shadow-md">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#81C99C]/20 to-[#FBB859]/20 rounded-full flex items-center justify-center">
                <FiUser className="text-[#606161]" size={32} />
              </div>
              <p className="text-[#606161] text-lg">
                Speaker information coming soon...
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

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
          <h2 className="text-3xl font-bold text-black mb-4">Meet Our Speakers</h2>
          
          {/* Section Headline */}
          {headline && (
            <p className="text-[#606161] text-lg max-w-3xl mx-auto">
              {headline}
            </p>
          )}
        </motion.div>

        {/* Speakers Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {speakers.map((speaker, index) => (
            <SpeakerCard key={index} speaker={speaker} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpeakersSection;
