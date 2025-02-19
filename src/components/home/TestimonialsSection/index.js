// frontend/src/components/home/TestimonialsSection/index.js
import React from 'react';
import useIntersection from '../../../hooks/useIntersection';
import TestimonialsCarousel from './TestimonialsCarousel';
import SectionTitle from '../../shared/SectionTitle';
import { useSettings } from '../../../context/BrandSettingsContext';

const TestimonialsSection = () => {
    const [sectionRef, isVisible] = useIntersection();
    const { settings } = useSettings();
    const colors = settings?.testimonialsColors || {};
  
    return (
      <section 
        ref={sectionRef}
        className="py-20 min-h-screen"
        style={{ backgroundColor: colors.sectionBackground }}
        data-visible={isVisible}
      >
        <div className="container mx-auto">
          <SectionTitle 
            animate={isVisible}
            style={{ color: colors.titleColor }}
          >
            User Experiences and Testimonials
          </SectionTitle>
          <TestimonialsCarousel animate={isVisible} />
        </div>
      </section>
    );
  };

export default React.memo(TestimonialsSection);