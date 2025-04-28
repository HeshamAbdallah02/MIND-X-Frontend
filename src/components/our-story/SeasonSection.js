//frontend/src/components/our-story/SeasonSection.js
import React from 'react';
import { useIntersection } from '../../hooks/useIntersection';

const seasons = [
  {
    year: "2019/2020 Season",
    theme: "Powering Our Future",
    highlights: [
      "Established our core curriculum",
      "Robotics workshops conducted", 
      "First robotics project completed"
    ],
    image: "/lovable-uploads/20090ad9-0450-46aa-9ab9-258a84b4af81.png"
  },
  {
    year: "2020/2021 Season",
    theme: "Remote Revolution",
    highlights: [
      "Successful virtual workshops series",
      "Developed online learning platform",
      "Held virtual hackathon event"
    ],
    image: "/lovable-uploads/20090ad9-0450-46aa-9ab9-258a84b4af81.png"
  },
  {
    year: "2023/2024 Season",
    theme: "Global Footprint",
    highlights: [
      "International partnerships established",
      "5 major events executed",
      "Industry-driven research projects"
    ],
    image: "/lovable-uploads/20090ad9-0450-46aa-9ab9-258a84b4af81.png"
  }
];

const SeasonCard = ({ season, isVisible, index }) => {
  const delay = index * 200 + 200;

  return (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-700"
      style={{ 
        opacity: isVisible ? 1 : 0, 
        transform: isVisible ? 'translateY(0)' : 'translateY(2rem)',
        transitionDelay: `${delay}ms`
      }}
    >
      <div className="h-48 overflow-hidden">
        <img 
          src={season.image} 
          alt={season.year} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#606161] mb-1">{season.year}</h3>
        <div className="text-[#FBB859] font-medium mb-4">{season.theme}</div>
        
        <ul className="space-y-2">
          {season.highlights.map((highlight, i) => (
            <li key={i} className="flex items-start">
              <span className="text-[#81C99C] mr-2">•</span>
              <span className="text-gray-700">{highlight}</span>
            </li>
          ))}
        </ul>
        
        <div className="mt-6">
          <button className="text-[#81C99C] hover:text-[#65A17E] flex items-center text-sm font-medium">
            View Board Members
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const SeasonSection = () => {
  const [sectionRef, isVisible] = useIntersection({
    triggerOnce: true,
    rootMargin: '0px 0px -100px 0px'
  });

  return (
    <section 
      ref={sectionRef}
      className="py-16 bg-white"
      data-visible={isVisible.toString()}
    >
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-[#606161] mb-16">
          Our Seasons & Board
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {seasons.map((season, index) => (
            <SeasonCard 
              key={season.year} 
              season={season} 
              isVisible={isVisible}
              index={index} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SeasonSection;
