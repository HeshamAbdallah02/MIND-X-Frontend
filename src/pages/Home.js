//frontend/src/pages/Home.js
import React from 'react';
import Hero from '../components/home/Hero';
import BrandSection from '../components/home/BrandSection';
import UpcomingEvents from '../components/home/UpcomingEvents';
import StatsSection from '../components/home/StatsSection';
import TestimonialsSection from '../components/home/TestimonialsSection';

const Home = () => {
  return (
    <div>
      <Hero />
      <BrandSection />
      <StatsSection />
      <UpcomingEvents />
      <TestimonialsSection />
      {/* Other sections will go here */}
    </div>
  );
};

export default Home;