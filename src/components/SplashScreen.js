// frontend/src/components/SplashScreen.js
import React from 'react';
import Lottie from 'lottie-react';
import animationData from './Animation - 1745861765023.json';

const SplashScreen = ({ progress }) => (
  <div
    className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center"
    role="status"
    aria-live="polite"
    aria-label="Loading application..."
  >
    <div
      className="relative w-[min(60vw,400px)] h-[min(60vw,400px)] overflow-visible"
      // you can keep animate-pulse or remove if you don’t want the glow
      // className="relative w-[min(60vw,400px)] h-[min(60vw,400px)] overflow-visible animate-pulse"
    >
      <Lottie
        animationData={animationData}
        loop
        autoplay
        className="w-full h-full"
        rendererSettings={{
          // 'slice' would zoom/crop; 'meet' will letterbox instead
          preserveAspectRatio: 'xMidYMid meet'
        }}
      />
    </div>

    {typeof progress === 'number' && (
      <div className="w-48 mt-8 bg-gray-100 rounded-full h-2.5">
        <div
          className="bg-[#FBB859] h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>
    )}
  </div>
);

export default SplashScreen;