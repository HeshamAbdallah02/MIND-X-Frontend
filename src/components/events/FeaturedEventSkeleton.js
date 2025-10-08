// frontend/src/components/events/FeaturedEventSkeleton.js
import React from 'react';

const FeaturedEventSkeleton = () => {
  return (
    <section className="relative w-full bg-gray-50">
      <div>
        <div className="grid md:grid-cols-2 gap-0">
          {/* Left Side - Image Skeleton */}
          <div className="relative h-64 md:h-auto bg-gray-200 animate-pulse">
              {/* Featured Badge Skeleton */}
              <div className="absolute top-6 left-6 z-10">
                <div className="h-8 w-36 bg-gray-300 rounded-full" />
              </div>
            </div>

            {/* Right Side - Details Skeleton */}
            <div className="p-8 md:py-10 md:px-12 lg:py-12 lg:px-16 flex flex-col justify-center bg-white space-y-6 min-h-[calc(100vh-64px)]">

              {/* Title Skeleton */}
              <div className="space-y-3">
                <div className="h-8 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
              </div>

              {/* Meta Info Skeleton */}
              <div className="space-y-3">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-gray-200 rounded animate-pulse flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 rounded w-2/3 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Skeleton */}
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />

              {/* Description Skeleton */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse" />
              </div>

              {/* Highlights Skeleton */}
              <div className="space-y-3">
                <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse mt-1" />
                      <div className="h-4 bg-gray-200 rounded flex-1 animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Bar Skeleton */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 animate-pulse" />
              </div>

              {/* Buttons Skeleton */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 h-12 bg-gray-200 rounded-lg animate-pulse" />
                <div className="flex-1 h-12 bg-gray-200 rounded-lg animate-pulse" />
              </div>

              {/* Countdown Skeleton */}
              <div className="pt-6 border-t border-gray-200">
                <div className="text-center space-y-3">
                  <div className="h-4 w-32 bg-gray-200 rounded mx-auto animate-pulse" />
                  <div className="grid grid-cols-4 gap-3">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="bg-gray-50 rounded-lg p-3">
                        <div className="h-8 bg-gray-200 rounded animate-pulse mb-2" />
                        <div className="h-3 bg-gray-200 rounded animate-pulse" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
};

export default FeaturedEventSkeleton;
