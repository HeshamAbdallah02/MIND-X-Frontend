// frontend/src/components/DynamicCTA.js
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchActiveCTA } from '../services/ctaService';

const DynamicCTA = ({ className = '' }) => {
  const { data: cta, isLoading, error } = useQuery({
    queryKey: ['active-cta'],
    queryFn: fetchActiveCTA,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    onError: (error) => {
      console.error('Error fetching active CTA:', error);
    }
  });

  // Don't render anything if loading, error, or no CTA
  if (isLoading || error || !cta) {
    return null;
  }

  const handleButtonClick = () => {
    if (cta.buttonUrl) {
      // Check if it's an external URL
      if (cta.buttonUrl.startsWith('http://') || cta.buttonUrl.startsWith('https://')) {
        window.open(cta.buttonUrl, '_blank', 'noopener,noreferrer');
      } else {
        // Internal URL - use window.location for client-side routing
        window.location.href = cta.buttonUrl;
      }
    }
  };

  return (
    <section 
      className={`py-16 text-white ${className}`}
      style={{ backgroundColor: cta.backgroundColor }}
    >
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-6">
          {cta.title}
        </h2>
        
        <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
          {cta.description}
        </p>
        
        <button
          onClick={handleButtonClick}
          className="px-8 py-4 bg-white text-lg font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50"
          style={{ color: cta.backgroundColor }}
        >
          {cta.buttonText}
        </button>
      </div>
    </section>
  );
};

export default DynamicCTA;
