//frontend/src/components/home/TestimonialsSection/TestimonialsCarousel.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TestimonialCard from './TestimonialCard';
import useTestimonialData from './hooks/useTestimonialData';
import { useSettings } from '../../../context/BrandSettingsContext';
import TestimonialNavigationButton from './NavigationButton';

const TestimonialsCarousel = ({ animate }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { testimonials, loading } = useTestimonialData();
    const { settings } = useSettings();
    const colors = settings?.testimonialsColors || {};
  
    useEffect(() => {
      if (testimonials.length > 0) {
        const timer = setInterval(() => {
          setCurrentIndex(prev => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
      }
    }, [testimonials.length]);
  
    if (loading || !testimonials.length) return null;
  
    const getCardStyle = (index) => {
        const total = testimonials.length;
        const diff = ((index - currentIndex + total) % total);
        
        // Adjusted y values to move inactive cards upward
        const positions = {
          0: { x: 0, y: 0, scale: 1, opacity: 1, zIndex: 5 },          // Center stays at current position
          1: { x: 250, y: 55, scale: 0.7, opacity: 0.7, zIndex: 4 },  // Right 1 moves up
          2: { x: 400, y: 90, scale: 0.5, opacity: 0.5, zIndex: 3 },  // Right 2 moves up more
          [total - 1]: { x: -250, y: 55, scale: 0.7, opacity: 0.7, zIndex: 4 },  // Left 1 moves up
          [total - 2]: { x: -400, y: 90, scale: 0.5, opacity: 0.5, zIndex: 3 },  // Left 2 moves up more
        };
      
        return positions[diff] || { x: 0, y: 0, scale: 0, opacity: 0, zIndex: 1 };
    };
  
    return (
        <div className="mt-20">
          <div className="relative
            h-[250px]
            sm:h-[300px]
            md:h-[400px]
            lg:h-[500px]
            overflow-hidden
            px-16
          ">
            {/* Profile Pictures Carousel */}
            <div className="absolute w-full top-0 left-1/2 -translate-x-1/2 px-4">
              {testimonials.map((testimonial, index) => {
                const style = getCardStyle(index);
                const isActive = index === currentIndex;
    
                return (
                  <motion.div
                    key={testimonial._id}
                    className={
                      `absolute left-1/2
                      ${!isActive ? 'hidden sm:block' : ''}`
                    }
                    initial={false}
                    animate={{
                      x: `calc(${style.x}px - 50%)`,
                      y: style.y, 
                      scale: style.scale,
                      opacity: style.opacity,
                      zIndex: style.zIndex,
                    }}
                    transition={{
                      duration: 0.5,
                      ease: "easeInOut"
                    }}
                  >
                    <TestimonialCard
                      testimonial={testimonial}
                      isActive={isActive}
                      colors={colors}
                      showFeedback={false}
                    />
                  </motion.div>
                );
              })}
            </div>
    
            {/* Static Feedback Container with Navigation */}
            <div className="absolute w-full top-[175px] left-1/2 -translate-x-1/2">
              {/* Navigation Buttons */}
              {testimonials.length > 1 && (
                <>
                  <TestimonialNavigationButton 
                    direction="prev" 
                    onClick={() => setCurrentIndex(prev => 
                      prev === 0 ? testimonials.length - 1 : prev - 1
                    )} 
                  />
                  <TestimonialNavigationButton 
                    direction="next" 
                    onClick={() => setCurrentIndex(prev => 
                      (prev + 1) % testimonials.length
                    )} 
                  />
                </>
              )}
    
              <motion.div
                className="text-center"
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center"
                  >
                    <h3 
                      className="text-2xl font-bold mb-1"
                      style={{ color: colors.nameColor }}
                    >
                      {testimonials[currentIndex].name}
                    </h3>
                    <p 
                      className="text-sm font-medium uppercase tracking-wide mb-3"
                      style={{ color: colors.positionColor }}
                    >
                      {testimonials[currentIndex].position}
                    </p>
                    <div 
                      className="mt-6 p-6 rounded-xl relative before:content-[''] before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:-translate-y-3 before:w-6 before:h-6 before:rotate-45"
                      style={{ 
                        backgroundColor: colors.feedbackBackground,
                        border: `2px solid ${colors.feedbackBorderColor}`,
                        boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
                        maxWidth: '500px',
                        margin: '0 auto'
                      }}
                    >
                      <p 
                        className="text-lg leading-relaxed"
                        style={{ color: colors.feedbackTextColor }}
                      >
                        {testimonials[currentIndex].feedback}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>
    );
};

export default React.memo(TestimonialsCarousel);