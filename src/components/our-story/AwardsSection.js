//frontend/src/components/our-story/AwardsSection.js
import React from 'react';
import { useIntersection } from '../../hooks/useIntersection';

const awards = [
  {
    icon: "🏆",
    title: "National Robotics Challenge",
    year: "2019",
    description: "Recognized for our innovative approach to automation using AI systems to streamline processes."
  },
  {
    icon: "🎓",
    title: "University Innovation Grant",
    year: "2020",
    description: "Awarded for our proposal to develop low-cost educational sensors using AI and 3D printing."
  },
  {
    icon: "💡",
    title: "Tech for Good Hackathon",
    year: "2021",
    description: "Won for developing an AI-powered solution to help visually impaired individuals navigate public spaces."
  },
  {
    icon: "🌟",
    title: "Ministry of Education Excellence Award",
    year: "2022",
    description: "Recognized for our educational outreach program that introduced robotics to over 1,000 high school students."
  },
  {
    icon: "🌐",
    title: "Global Innovation Award",
    year: "2023",
    description: "Our AI-powered waste sorting device project was recognized at an international level for circular economy innovation."
  },
  {
    icon: "🤖",
    title: "Industry Innovation Partnership",
    year: "2024",
    description: "Our ground-breaking designs received backing from leading tech firms who are now collaborating with us on several key projects."
  }
];

const AwardCard = ({ award, isVisible, index }) => {
  const delay = index * 100 + 200;
  
  return (
    <div 
      className="bg-white p-6 rounded-xl shadow-md transition-all duration-700"
      style={{ 
        opacity: isVisible ? 1 : 0, 
        transform: isVisible ? 'translateY(0)' : 'translateY(2rem)',
        transitionDelay: `${delay}ms`
      }}
    >
      <div className="flex flex-col h-full">
        <div className="text-4xl mb-4">{award.icon}</div>
        <h3 className="text-xl font-bold text-[#606161] mb-2">{award.title}</h3>
        <div className="text-sm text-[#FBB859] font-semibold mb-3">{award.year}</div>
        <p className="text-gray-600 text-sm flex-grow">{award.description}</p>
      </div>
    </div>
  );
};

const AwardsSection = () => {
  const [sectionRef, isVisible] = useIntersection({
    triggerOnce: true,
    rootMargin: '0px 0px -100px 0px'
  });

  return (
    <section 
      ref={sectionRef}
      className="py-16 bg-gray-700"
      data-visible={isVisible.toString()}
    >
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-white mb-16">
          Awards & Recognition
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {awards.map((award, index) => (
            <AwardCard 
              key={award.title} 
              award={award} 
              isVisible={isVisible}
              index={index} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AwardsSection;
