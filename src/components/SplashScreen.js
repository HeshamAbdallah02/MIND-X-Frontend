// frontend/src/components/SplashScreen.js
import React from 'react';
import Lottie from 'lottie-react';
import animationData from './Animation - 1745861765023.json';

const SplashScreen = ({ progress }) => (
  <div
    className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center"
    role="status"
    aria-live="polite"
    aria-label="Application loading screen"
  >
    {/* Animation container with responsive sizing */}
    <div 
      className="
        w-[min(75vw,400px)] h-[min(75vw,400px)]
        md:w-[min(60vw,500px)] md:h-[min(60vw,500px)]
        lg:w-[min(50vw,600px)] lg:h-[min(50vw,600px)]
        relative overflow-visible
        @container/splash
      "
    >
      <Lottie
        animationData={animationData}
        loop
        autoplay
        className="w-full h-full"
        rendererSettings={{
          preserveAspectRatio: 'xMidYMid meet',
          progressiveLoad: true // Better for large animations
        }}
        style={{
          willChange: 'transform, opacity', // Optimize animations
          touchAction: 'none' // Prevent scroll interference
        }}
        aria-hidden="true"
      />
    </div>

    {/* Responsive progress bar */}
    {typeof progress === 'number' && (
      <div 
        className="
          w-[75vw] max-w-[300px] 
          md:w-[60vw] md:max-w-[400px]
          lg:w-[50vw] lg:max-w-[500px]
          mt-[5vmin] h-[1.2vmin] min-h-[6px]
          bg-gray-100/50 rounded-full
          overflow-hidden
          @[400px]/splash:mt-8
        "
      >
        <div
          className="
            h-full bg-[#FBB859] rounded-full
            transition-all duration-500 ease-out-quad
          "
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label="Loading progress"
        >
          {/* Screen reader-only updates */}
          <span className="sr-only">
            {progress}% of resources loaded
          </span>
        </div>
      </div>
    )}

    {/* Optional: Reduced motion alternative */}
    <style>{`
      @media (prefers-reduced-motion: reduce) {
        .animation-container > div {
          animation: none !important;
        }
        .lottie-animation {
          animation: pulse 2s infinite;
        }
      }
    `}</style>
  </div>
);

export default SplashScreen;