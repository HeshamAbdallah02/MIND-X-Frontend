// frontend/src/components/home/BrandSection/index.js
import React from 'react';
import { useIntersection } from '../../../hooks/useIntersection';
import { motion } from 'framer-motion';
import { useSettings } from '../../../context/BrandSettingsContext';

const BrandSection = () => {
  const [sectionRef, isVisible] = useIntersection({
    triggerOnce: true,
    rootMargin: '0px 0px -25% 0px'
  });
  const { settings } = useSettings();

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.section
      ref={sectionRef}
      className="py-20 bg-white"
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="container mx-auto px-4">
        {/* Logo */}
        <motion.div 
          className="flex justify-center mb-8"
          variants={itemVariants}
        >
          <img 
            src={settings?.logo?.url} 
            alt="MIND-X Logo" 
            className="h-40 w-auto"
          />
        </motion.div>

        {/* Tagline */}
        <motion.h2 
          className="text-center text-2xl mb-12"
          variants={itemVariants}
        >
          <span className="text-[#FBB859]">M</span>essengers of 
          <span className="text-[#FBB859]"> I</span>nspiration
          a<span className="text-[#FBB859]">n</span>d
          <span className="text-[#FBB859]"> D</span>evelopment
        </motion.h2>

        {/* Acronym Explanation */}
        <motion.div 
          className="text-center mb-16"
          variants={itemVariants}
        >
          <p className="text-xl mb-2">
            <span className="text-[#FBB859]">MIND</span>
            <span className="text-[#606161]"> embodies the power of thought</span>
          </p>
          <p className="text-lg text-[#606161]">
            <span className="text-[#FBB859]">X</span> symbolizes the vibrant, 
            ever-evolving human spirit—the dynamic variable in life's grand equation.
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div 
            className="bg-opacity-10 bg-[#FBB859] rounded-lg p-8"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            style={{
              backgroundColor: settings?.missionBgColor || '#FBB859',
              color: settings?.missionTextColor || '#606161'
            }}
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <span className="text-[#FBB859] mr-2">⚡</span>
              Mission
            </h3>
            <p>{settings?.missionText || "To inspire and empower individuals through innovative development solutions, fostering growth and positive change in communities worldwide."}</p>
          </motion.div>

          <motion.div 
            className="bg-opacity-10 bg-[#81C99C] rounded-lg p-8"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            style={{
              backgroundColor: settings?.visionBgColor || '#81C99C',
              color: settings?.visionTextColor || '#606161'
            }}
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <span className="text-[#81C99C] mr-2">👁️</span>
              Vision
            </h3>
            <p>{settings?.visionText || "To be the catalyst for transformative change, creating a world where inspiration and development go hand in hand, nurturing the unlimited potential of the human spirit."}</p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default React.memo(BrandSection);