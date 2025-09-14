import React, { useRef } from 'react';
import HeroSection from '../components/our-story/HeroSection';
import FoundationSection from '../components/our-story/FoundationSection';
import OurJourney from '../components/our-story/OurJourney';
import AwardsSection from '../components/our-story/AwardsSection';
import SeasonsSection from '../components/our-story/SeasonsSection';
import DynamicCTA from '../components/DynamicCTA';
import Footer from '../components/home/Footer/index';

const OurStory = () => {
  const beginningRef = useRef(null);

  const handleScrollToNext = () => {
    if (beginningRef.current) {
      beginningRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="w-full overflow-x-hidden">
      <HeroSection onScrollToNext={handleScrollToNext} />
      <div ref={beginningRef}>
        <FoundationSection />
      </div>
      <OurJourney />
      <AwardsSection />
      <SeasonsSection />
      <DynamicCTA />
      <Footer />
    </div>
  );
};

export default OurStory;