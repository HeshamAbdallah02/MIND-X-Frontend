// frontend/src/components/home/Footer/components/DeveloperCard.js
import React from 'react';
import { FaLinkedin, FaGithub, FaWhatsapp, FaGlobe } from 'react-icons/fa';
import HeshamPhoto from '../assets/Hesham.jpg';

const DeveloperCard = () => (
  <div className="flex items-start gap-3">
    {/* Vertical separator line */}
    <div className="w-px h-64 bg-white/20"></div>

    {/* Developer section */}
    <div className="flex flex-col items-center gap-1 min-w-[280px] w-full">
      {/* "Developed by" heading */}
      <div className="text-lg font-semibold text-[#FBB859] text-center mb-2">
        Developed by
      </div>

      {/* Developer photo - circular */}
      <div className="flex justify-center my-2">
        <img
          src={HeshamPhoto}
          alt="Hesham Abdallah"
          className="w-24 h-24 rounded-full object-cover object-top border-2 border-[#FBB859]/40"
        />
      </div>

      {/* Developer name */}
      <div className="text-base font-medium text-white text-center mt-1">
        Hesham Abdallah
      </div>

      {/* Social links - placeholder hrefs for now */}
      <div className="flex gap-4 justify-center mt-3">
        <a
          href="#"
          target="_blank"
          rel="noreferrer"
          className="text-white/70 hover:text-white text-lg transition-colors"
          title="LinkedIn"
        >
          <FaLinkedin />
        </a>
        <a
          href="#"
          target="_blank"
          rel="noreferrer"
          className="text-white/70 hover:text-white text-lg transition-colors"
          title="Portfolio"
        >
          <FaGlobe />
        </a>
        <a
          href="#"
          target="_blank"
          rel="noreferrer"
          className="text-white/70 hover:text-white text-lg transition-colors"
          title="GitHub"
        >
          <FaGithub />
        </a>
        <a
          href="#"
          target="_blank"
          rel="noreferrer"
          className="text-white/70 hover:text-white text-lg transition-colors"
          title="WhatsApp"
        >
          <FaWhatsapp />
        </a>
      </div>
    </div>
  </div>
);

export default DeveloperCard;