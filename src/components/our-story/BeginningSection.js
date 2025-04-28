// frontend/src/components/our-story/BeginningSection.js
import React from 'react';
import { useIntersection } from '../../hooks/useIntersection';

const BeginningSection = () => {
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
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-[#606161]">
              The Beginning of MIND-X
            </h2>
            <p className="text-gray-700">
              It all began in 2018, when a group of passionate students at the University of Technology came together with a shared vision: to create a platform where innovation is nurtured yet amplified. 
              Empowered with fierce passion for innovation.
            </p>
            <p className="text-gray-700">
              What began as informal meetings in the university's engineering lab quickly evolved into regular workshops, hackathons, and robotics events. These knowledge-rich and lively foundations of what would become MIND-X were planted with excitement.
            </p>
            <p className="text-gray-700">
              The founding team - Sophia Chen, Ahmad Al-Arabi, Mikhail Novitskiy, and Priya Sharma - established MIND-X with a clear mission: to forge a multidisciplinary collaborative platform where students from various backgrounds could develop cutting-edge solutions to real-world problems.
            </p>
          </div>

          <div className="transition-all duration-700" style={{ 
            opacity: isVisible ? 1 : 0, 
            transform: isVisible ? 'translateY(0)' : 'translateY(2rem)',
            transitionDelay: '300ms'
          }}>
            <div className="bg-gray-100 p-8 rounded-xl">
              <div className="text-5xl font-bold text-[#606161]">2018</div>
              <div className="mt-4">
                <p className="text-gray-700 font-medium">
                  Started with 12 founding members from 5 different academic disciplines
                </p>
                <div className="flex mt-2">
                  <div className="h-1 w-1/2 bg-[#FBB859] rounded-full mr-1"></div>
                  <div className="h-1 w-1/2 bg-[#FBB859] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeginningSection;