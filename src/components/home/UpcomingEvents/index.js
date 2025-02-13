// frontend/src/components/home/UpcomingEvents/index.js
import React from 'react';
import useIntersection from '../../../hooks/useIntersection';
import EventsCarousel from './EventsCarousel';
import SectionTitle from '../../shared/SectionTitle';

const Events = () => {
  const [sectionRef, isVisible] = useIntersection();

  return (
    <section 
      ref={sectionRef}
      className="py-16 bg-white"
      data-visible={isVisible}
    >
      <div className="container mx-auto px-4">
        <SectionTitle animate={isVisible}>Upcoming Events</SectionTitle>
        <EventsCarousel animate={isVisible} />
      </div>
    </section>
  );
};

export default React.memo(Events);