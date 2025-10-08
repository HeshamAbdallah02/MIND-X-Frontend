// frontend/src/components/eventDetails/EventDetailsSkeleton.js
import React from 'react';

const EventDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar Skeleton */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="h-8 w-24 bg-gray-200 animate-pulse rounded" />
            <div className="hidden md:flex items-center space-x-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-6 w-20 bg-gray-200 animate-pulse rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Skeleton */}
      <div className="relative w-full h-[300px] md:h-[400px] bg-gray-200 animate-pulse mt-16" />

      {/* Content Skeleton */}
      <div className="py-16 md:py-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          {/* Title */}
          <div className="h-12 w-3/4 bg-gray-200 animate-pulse rounded mb-6" />

          {/* Meta Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 bg-gray-100 rounded-lg">
                <div className="h-6 w-6 bg-gray-200 animate-pulse rounded mb-2" />
                <div className="h-4 w-16 bg-gray-200 animate-pulse rounded mb-2" />
                <div className="h-6 w-24 bg-gray-200 animate-pulse rounded" />
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="mb-8">
            <div className="h-8 w-48 bg-gray-200 animate-pulse rounded mb-4" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
              <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
              <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded" />
            </div>
          </div>

          {/* Highlights Grid */}
          <div className="mb-8">
            <div className="h-8 w-48 bg-gray-200 animate-pulse rounded mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 bg-gray-100 rounded-lg">
                  <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Speakers Skeleton */}
      <div className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="h-8 w-64 bg-gray-200 animate-pulse rounded mb-12 mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="w-full aspect-square bg-gray-200 animate-pulse" />
                <div className="p-6">
                  <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded mb-2" />
                  <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded mb-4" />
                  <div className="h-3 w-full bg-gray-200 animate-pulse rounded mb-2" />
                  <div className="h-3 w-full bg-gray-200 animate-pulse rounded mb-4" />
                  <div className="h-10 w-48 bg-gray-200 animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsSkeleton;
