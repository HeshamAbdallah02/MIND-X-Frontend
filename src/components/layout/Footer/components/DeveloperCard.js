// frontend/src/components/home/Footer/components/DeveloperCard.js
import React from 'react';
import { FaGlobe, FaFacebook, FaWhatsapp, FaLinkedin } from 'react-icons/fa';
import DawwarLogo from '../assets/Dawwar-Logo.png';

const DeveloperCard = () => (
  <div className="flex items-start gap-3">
    {/* Vertical separator line - made much taller to match other sections */}
    <div className="w-px h-64 bg-white/20"></div>
    
    {/* Developer section with improved vertical layout */}
    <div className="flex flex-col gap-1 min-w-[280px] w-full">
      {/* "Crafted by" text centered but aligned with other headlines */}
      <div className="text-lg font-semibold text-[#FBB859] text-center mb-2">
        Crafted by
      </div>
      
      {/* Company logo centered with minimal 2-3px spacing */}
      <div className="flex justify-center my-2">
        <img
          src={DawwarLogo}
          alt="Dawwar Logo"
          className="w-40 h-auto object-contain"
        />
      </div>
      
      {/* Company social links centered */}
      <div className="flex gap-4 justify-center mt-2">
        <a
          href="https://dawwar.com"
          target="_blank"
          rel="noreferrer"
          className="text-white/70 hover:text-white text-lg transition-colors"
          title="Website"
        >
          <FaGlobe />
        </a>
        <a
          href="https://www.facebook.com/Dawwar.Software"
          target="_blank"
          rel="noreferrer"
          className="text-white/70 hover:text-white text-lg transition-colors"
          title="Facebook"
        >
          <FaFacebook />
        </a>
        <a
          href="https://linkedin.com/company/dawwar"
          target="_blank"
          rel="noreferrer"
          className="text-white/70 hover:text-white text-lg transition-colors"
          title="LinkedIn"
        >
          <FaLinkedin />
        </a>
        <a
          href="https://wa.me/201091655373"
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