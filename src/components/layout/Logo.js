//frontend/src/components/layout/Logo.js
import React from 'react';

const Logo = ({ imageUrl }) => {
  if (imageUrl) {
    return <img src={imageUrl} alt="MIND-X Logo" className="h-8" />;
  }

  return (
    <div className="flex items-center font-montserrat font-bold text-2xl">
      <span className="text-[#FBB859]">MIND-X</span>
    </div>
  );
};

export default Logo;