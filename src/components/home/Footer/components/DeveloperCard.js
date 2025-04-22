// frontend/src/components/home/Footer/components/DeveloperCard.js
import React from 'react';
import { FaLinkedin, FaGlobe } from 'react-icons/fa';
import DeveloperImage          from '../assets/MyPhoto.jpg';

const DeveloperCard = () => (
  <div className="bg-black/20 rounded-lg p-6 flex items-center gap-4 max-w-[280px] h-40 mt-6">
    <img
      src={DeveloperImage}
      alt="Developer"
      className="w-16 h-22 rounded-lg"
    />
    <div className="flex-1">
      <div className="text-xs text-white/80">DEVELOPED BY</div>
      <div className="text-[#FBB859] font-bold">Hesham Abdallah</div>
      <div className="text-sm text-[#81C99C]/60">Full Stack Developer</div>
      <div className="flex gap-3 mt-2">
        <a
          href="https://linkedin.com/in/hesham-abdalla-6531841ba/"
          target="_blank"
          rel="noreferrer"
          className="text-white text-xl hover:opacity-80 transition-opacity"
        >
          <FaLinkedin />
        </a>
        <a
          href="https://heshamabdallah.vercel.app/"
          target="_blank"
          rel="noreferrer"
          className="text-white text-xl hover:opacity-80 transition-opacity"
        >
          <FaGlobe />
        </a>
      </div>
    </div>
  </div>
);

export default DeveloperCard;