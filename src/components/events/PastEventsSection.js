// frontend/src/components/events/PastEventsSection.js
// Main component for displaying past events with search and grid view
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiX, FiLoader } from 'react-icons/fi';
import { usePastEvents } from '../../services/featuredEventService';
import EventCardPast from './EventCardPast';
import { useNavigate } from 'react-router-dom';

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const PastEventsSection = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Debounce search term
  const debouncedSearch = useDebounce(searchTerm, 300);
  
  // Fetch past events (no categories)
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = usePastEvents(debouncedSearch, []);

  // Flatten pages data
  const events = data?.pages?.flatMap(page => page.events) || [];
  const totalEvents = data?.pages?.[0]?.pagination?.total || 0;

  // Handle event card click
  const handleEventClick = (event) => {
    navigate(`/events/${event._id}`);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#606161] mb-4">
            Explore Past Events
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse through our archive of amazing events and discover what we've accomplished together.
          </p>
          {totalEvents > 0 && (
            <p className="mt-2 text-sm text-gray-500">
              {totalEvents} {totalEvents === 1 ? 'event' : 'events'} found
            </p>
          )}
        </motion.div>

        {/* Controls Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-2xl mx-auto">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search past events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-4 rounded-xl border-2 border-gray-200 focus:border-[#FBB859] focus:ring-2 focus:ring-[#FBB859]/20 outline-none transition-all text-gray-700 placeholder-gray-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Clear search"
                >
                  <FiX className="w-5 h-5 text-gray-400" />
                </button>
              )}
            </div>
          </div>

        </motion.div>

        {/* Content Area - Grid View */}
        <GridView
          events={events}
          isLoading={isLoading}
          isError={isError}
          error={error}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          onEventClick={handleEventClick}
          searchTerm={debouncedSearch}
          refetch={refetch}
        />
      </div>
    </section>
  );
};

// Grid View Component
const GridView = ({
  events,
  isLoading,
  isError,
  error,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  onEventClick,
  searchTerm,
  refetch
}) => {
  if (isLoading) {
    return <GridSkeleton />;
  }

  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <FiX className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h3>
        <p className="text-gray-600 mb-6">{error?.message || 'Failed to load events'}</p>
        <button
          onClick={() => refetch()}
          className="px-6 py-3 bg-[#FBB859] text-white rounded-lg hover:bg-[#f9a63d] transition-colors font-semibold"
        >
          Try Again
        </button>
      </motion.div>
    );
  }

  if (events.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <FiSearch className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          {searchTerm ? 'No events match your search' : 'No past events yet'}
        </h3>
        <p className="text-gray-600">
          {searchTerm
            ? 'Try adjusting your search'
            : 'Check back soon for upcoming events!'}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {events.map((event, index) => (
          <EventCardPast
            key={event._id}
            event={event}
            index={index}
            onClick={onEventClick}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasNextPage && (
        <div className="text-center">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-8 py-3 bg-[#FBB859] text-white rounded-lg hover:bg-[#f9a63d] transition-all duration-300 font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
          >
            {isFetchingNextPage ? (
              <>
                <FiLoader className="w-5 h-5 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More Events'
            )}
          </button>
        </div>
      )}
    </motion.div>
  );
};

// Grid Loading Skeleton
const GridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
          <div className="bg-gray-200 h-48" />
          <div className="p-6">
            <div className="h-6 bg-gray-200 rounded mb-3" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
            <div className="h-4 bg-gray-200 rounded mb-2" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PastEventsSection;
