// frontend/src/pages/Home.js
import React from 'react';
import Hero from '../components/home/Hero';
import BrandSection from '../components/home/BrandSection';
import UpcomingEvents from '../components/home/UpcomingEvents';
import StatsSection from '../components/home/StatsSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import SponsorsSection from '../components/home/SponsorsSection';
import Footer from '../components/home/Footer';

const Home = () => {
  return (
    <div>
      <Hero />
      <BrandSection />
      <StatsSection />
      <UpcomingEvents />
      <TestimonialsSection />
      <SponsorsSection />
      <Footer />
    </div>
  );
};

export default Home;