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
    iconColor = '#81C99C',
    numberColor = '#FBB859',
    textPrimary = '#FFFFFF'
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
      <div className="container mx-auto pt-10 pb-14">
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
            className="grid gap-2"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(160px, 100%), 1fr)',
              '@media (minWidth: 640px)': {
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(160px, 50%), 1fr)'
              },
              '@media (minWidth: 1024px)': {
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(160px, calc(100%/3)), 1fr)'
              },
              '@media (minWidth: 1280px)': {
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))'
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
                  className="text-center p-2 flex flex-col items-center"
                  variants={itemVariants}
                >
                  {IconComponent && (
                    <div className="mb-1" style={{ color: iconColor }}> 
                      <IconComponent className="w-12 h-12" /> 
                    </div>
                  )}
                  <span 
                    className="text-4xl font-bold"
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
                          className="text-lg font-medium"
                          style={{ color: textPrimary }}
                        >
                          {stat.label}
                        </h3>
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