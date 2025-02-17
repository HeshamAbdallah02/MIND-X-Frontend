// frontend/src/components/home/StatsSection/index.js
import React from 'react';
import useIntersection from '../../../hooks/useIntersection';
import SectionTitle from '../../shared/SectionTitle';
import { motion } from 'framer-motion';
import useStatsData from './hooks/useStatsData';
import { useSettings } from '../../../context/BrandSettingsContext';
import CountUp from 'react-countup';
import { 
  FaUsers, FaChalkboardTeacher, FaChartLine, FaAward, 
  FaBriefcase, FaBook, FaBrain, FaClock, FaGlobe,
  FaGraduationCap, FaHandshake, FaLaptopCode, 
  FaMicroscope, FaMoneyBillAlt, FaRocket, 
  FaTrophy, FaUniversity, FaChartPie
} from 'react-icons/fa';

const icons = {
  FaUsers, FaChalkboardTeacher, FaChartLine, FaAward, 
  FaBriefcase, FaBook, FaBrain, FaClock, FaGlobe,
  FaGraduationCap, FaHandshake, FaLaptopCode, 
  FaMicroscope, FaMoneyBillAlt, FaRocket, 
  FaTrophy, FaUniversity, FaChartPie
};

const StatsSection = () => {
  const [sectionRef, isVisible] = useIntersection({ threshold: 0.1 });
  const { stats, loading } = useStatsData();
  const { settings } = useSettings();

  // Destructure color settings with fallbacks
  const {
    sectionBackground = '#606161',
    titleColor = '#FFFFFF',
    cardBackground = 'rgba(251, 184, 89, 0.1)',
    iconColor = '#81C99C',
    numberColor = '#FBB859',
    textPrimary = '#FFFFFF',
    textSecondary = 'rgba(255, 255, 255, 0.8)'
  } = settings?.statsColors || {};

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section 
      ref={sectionRef}
      style={{ backgroundColor: sectionBackground }}
      className="py-16"
      data-visible={isVisible}
    >
      <div className="container mx-auto px-4 pt-14 pb-20">
        <SectionTitle 
          animate={isVisible}
          style={{ color: titleColor }}
        >
          Statistics & Numbers
        </SectionTitle>
        
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div 
              className="animate-spin rounded-full h-8 w-8 border-b-2"
              style={{ borderColor: iconColor }}
            />
          </div>
        ) : (
          <motion.div
            className="grid gap-6"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr)',
              '@media (min-width: 640px)': {
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 50%), 1fr)'
              },
              '@media (min-width: 1024px)': {
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, calc(100%/3)), 1fr)'
              },
              '@media (min-width: 1280px)': {
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))'
              }
            }}
            variants={containerVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
          >
            {stats?.map((stat, index) => {
              const IconComponent = icons[stat.icon];
              
              return (
                <motion.div
                  key={stat._id || index}
                  className="text-center p-6 rounded-xl backdrop-blur-lg hover:shadow-xl transition-all"
                  style={{
                    background: cardBackground,
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
                  }}
                  variants={itemVariants}
                >
                  <div className="flex flex-col items-center">
                    {IconComponent && (
                      <div className="mb-4" style={{ color: iconColor }}>
                        <IconComponent className="w-12 h-12" />
                      </div>
                    )}
                    <span 
                      className="text-5xl font-bold mb-2"
                      style={{ color: numberColor }}
                    >
                      <CountUp
                        start={0}
                        end={isVisible ? stat.number : 0}
                        duration={2.5}
                        suffix="+"
                        enableScrollSpy={false}
                        decimals={stat.number % 1 !== 0 ? 1 : 0}
                        formattingFn={(value) => 
                          Number.isInteger(value) ? 
                          value.toLocaleString() : 
                          value.toFixed(1)
                        }
                        easingFn={(t, b, c, d) => c * Math.sin(t/d * (Math.PI/2)) + b}
                      />
                    </span>
                    <h3 
                      className="text-xl font-semibold"
                      style={{ color: textPrimary }}
                    >
                      {stat.label}
                    </h3>
                    {stat.description && (
                      <p 
                        className="mt-2"
                        style={{ color: textSecondary }}
                      >
                        {stat.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {!loading && (!stats || stats.length === 0) && (
          <div className="text-center py-12" style={{ color: textPrimary }}>
            <p className="text-xl">Our impact speaks volumes</p>
            <p className="mt-2" style={{ color: iconColor }}>
              Numbers coming soon!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default React.memo(StatsSection);