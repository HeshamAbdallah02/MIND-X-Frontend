import React from 'react';
import Hero from '../components/our-story/Hero';
import BeginningSection from '../components/our-story/BeginningSection';
import JourneyTimeline from '../components/our-story/JourneyTimeline';
import AwardsSection from '../components/our-story/AwardsSection';
import SeasonSection from '../components/our-story/SeasonSection';
import JoinCTA from '../components/our-story/JoinCTA';
import Footer from '../components/home/Footer/index';

const OurStory = () => {
  return (
    <div className="bg-white min-h-screen">
      <Hero />
      <BeginningSection />
      <JourneyTimeline />
      <AwardsSection />
      <SeasonSection />
      <JoinCTA />
      <Footer />
    </div>
  );
};

export default OurStory;