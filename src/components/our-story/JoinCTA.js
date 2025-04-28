//frontend/src/components/our-story/JoinCTA.js
import React from 'react';
import { useIntersection } from '../../hooks/useIntersection';

const JoinCTA = () => {
  const [sectionRef, isVisible] = useIntersection({
    triggerOnce: true,
    rootMargin: '0px 0px -100px 0px'
  });

  return (
    <section 
      ref={sectionRef}
      className="py-16 bg-gradient-to-r from-[#FBB859] to-[#F9A826]"
      data-visible={isVisible.toString()}
    >
      <div 
        className="container mx-auto px-6 text-center transition-all duration-700"
        style={{ 
          opacity: isVisible ? 1 : 0, 
          transform: isVisible ? 'translateY(0)' : 'translateY(2rem)'
        }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Join Our Journey
        </h2>
        <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
          Discover opportunities to engage in our tech & AI world while exploring your passions. The future awaits!
        </p>
        <button className="bg-white text-[#F9A826] px-8 py-3 rounded-full font-bold text-lg hover:bg-white/90 transition-colors shadow-lg">
          Become Our Member
        </button>
      </div>
    </section>
  );
};

export default JoinCTA;
