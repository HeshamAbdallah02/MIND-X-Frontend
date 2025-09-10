// frontend/src/components/our-story/SeasonsSection/index.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SeasonCard from './components/SeasonCard';
import { useSeasonsData } from './hooks/useSeasonsData';

const SeasonsSection = () => {
  const [expandedCard, setExpandedCard] = useState(null);
  const { data: seasonsData, isLoading, error } = useSeasonsData();

  const handleToggleExpand = (seasonId) => {
    setExpandedCard(expandedCard === seasonId ? null : seasonId);
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Seasons & Board
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Each academic year brings new leadership, fresh ideas, and remarkable achievements.
            </p>
          </div>
          
          {/* Loading Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="h-72 bg-gray-200 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Seasons & Board
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Unable to load seasons data. Please try again later.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-red-800 text-sm">
                {error.message || 'An error occurred while fetching data.'}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Seasons & Board
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Each academic year brings new leadership, fresh ideas, and remarkable achievements.
          </p>
        </motion.div>

        {/* Seasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {seasonsData?.map((season, index) => (
            <motion.div
              key={season.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.2,
                ease: 'easeOut'
              }}
              viewport={{ once: true }}
            >
              <SeasonCard
                season={season}
                isExpanded={expandedCard === season.id}
                onToggleExpand={handleToggleExpand}
              />
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {seasonsData && seasonsData.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Seasons Available
              </h3>
              <p className="text-gray-600">
                Season data will be displayed here once available.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default SeasonsSection;
