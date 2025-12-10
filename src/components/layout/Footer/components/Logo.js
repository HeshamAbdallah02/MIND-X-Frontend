// frontend/src/components/home/Footer/components/Logo.js
import React from 'react';
import { useSettings } from '../../../../context/BrandSettingsContext';
import DefaultLogo     from '../assets/default-logo.png';

const Logo = () => {
  const { settings } = useSettings();
  const url    = settings?.footerLogo?.url  || DefaultLogo;
  const alt    = settings?.footerLogo?.alt  || 'MIND‑X Logo';
  const slogan = settings?.footerSlogan     || '';

  return (
    <div className="text-left mb-6">
      <img
        src={url}
        alt={alt}
        className="w-[200px] h-auto"
      />
      {slogan && (
        <p className="mt-4 text-base text-white tracking-widest">
          {slogan}
        </p>
      )}
    </div>
  );
};

export default Logo;