//frontend/src/components/our-story/JourneyTimeline.js
import React from 'react';
import { useIntersection } from '../../hooks/useIntersection';

const timelineEvents = [
  {
    year: '2019',
    title: 'First Major Partnership',
    description: 'Secured our first corporate partnership with a leading robotics company, marking a milestone for the organization.',
    image: null
  },
  {
    year: '2020',
    title: 'First Robotics Workshop',
    description: 'Hosted our inaugural workshop with 50+ attendees, introducing basic robotics concepts and hands-on activities.',
    image: '/lovable-uploads/20090ad9-0450-46aa-9ab9-258a84b4af81.png'
  },
  {
    year: '2021',
    title: 'Digital Transformation',
    description: 'Pivoted to fully virtual programming during global challenges, reaching 4x more participants across 15 countries.',
    image: null
  },
  {
    year: '2022',
    title: 'Innovation Award',
    description: 'Received the prestigious Regional Innovation Excellence Award for our STEM education initiatives.',
    image: null
  },
  {
    year: '2023',
    title: 'Expansion Phase',
    description: 'Opened our new regional hub and launched our flagship "Future Innovation" program for underserved communities.',
    image: null
  },
  {
    year: '2024',
    title: 'Global Impact',
    description: 'Currently serving over 10,000 participants annually through 70 programs and initiatives across 4 continents.',
    image: null
  }
];

const TimelineEvent = ({ event, index, isVisible }) => {
  const delay = index * 100 + 200;
  
  return (
    <div className="relative flex items-center justify-between mb-24 last:mb-0">
      {/* Timeline line */}
      <div className="absolute left-[19px] h-full border-l-2 border-[#FBB859]/50 -z-10"></div>
      
      {/* Year dot */}
      <div className="flex flex-col items-center mr-8">
        <div className="w-10 h-10 rounded-full bg-[#FBB859] flex items-center justify-center text-white font-bold z-10">
          <div 
            className="w-6 h-6 rounded-full bg-white transition-transform duration-500"
            style={{
              transform: isVisible ? 'scale(0)' : 'scale(1)'
            }}
          ></div>
        </div>
      </div>
      
      {/* Content */}
      <div className={`flex-1 transition-all duration-700`} style={{ 
        opacity: isVisible ? 1 : 0, 
        transform: isVisible ? 'translateX(0)' : 'translateX(2rem)',
        transitionDelay: `${delay}ms`
      }}>
        {/* Year */}
        <div className="text-[#FBB859] font-bold text-lg mb-1">{event.year}</div>
        
        {/* Title */}
        <h3 className="text-2xl font-bold text-[#606161] mb-3">{event.title}</h3>
        
        {/* Description & Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-gray-700">{event.description}</div>
          
          {event.image && (
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img 
                src={event.image} 
                alt={event.title} 
                className="w-full h-60 object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const JourneyTimeline = () => {
  const [sectionRef, isVisible] = useIntersection({
    triggerOnce: true,
    rootMargin: '0px 0px -100px 0px'
  });

  return (
    <section 
      ref={sectionRef}
      className="py-16 bg-gray-50"
      data-visible={isVisible.toString()}
    >
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-[#606161] mb-16">
          Our Journey
        </h2>
        
        <div className="max-w-3xl mx-auto">
          {timelineEvents.map((event, index) => (
            <TimelineEvent 
              key={event.year} 
              event={event} 
              index={index} 
              isVisible={isVisible} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default JourneyTimeline;
