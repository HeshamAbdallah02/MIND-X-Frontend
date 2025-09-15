// frontend/src/components/home/Footer/index.js
import React from 'react';
import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa';
import { useSettings } from '../../../context/BrandSettingsContext';
import Logo          from './components/Logo';
import Subscribe     from './components/Subscribe';
import DeveloperCard from './components/DeveloperCard';

const Footer = () => {
  const { settings } = useSettings();
  const c = settings?.footerColors || {};

  return (
    <footer
      className="px-8 pt-16 pb-8"
      style={{ backgroundColor: c.background }}
    >
      <div
        className="
          max-w-[1400px] mx-auto
          grid gap-8

          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-[2fr_1fr_1fr_1.2fr_1.5fr]
        "
      >
        {/* 1 — Brand + Social */}
        <div className="flex flex-col gap-6">
          <Logo />

          <div className="flex flex-col gap-4">
            <h4
              className="text-lg font-semibold"
              style={{ color: c.textColor }}
            >
              Follow us:
            </h4>
            <div className="flex gap-4">
              <a 
                href="https://www.facebook.com/MindxEgy/" 
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: c.linkColor }} 
                className="text-2xl hover:opacity-80 transition-opacity"
                aria-label="Visit our Facebook page"
              >
                <FaFacebook />
              </a>
              <a 
                href="https://www.instagram.com/mind_x199/" 
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: c.linkColor }} 
                className="text-2xl hover:opacity-80 transition-opacity"
                aria-label="Visit our Instagram page"
              >
                <FaInstagram />
              </a>
              {/* <a 
                href="https://youtube.com/@mindxstudentactivities" 
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: c.linkColor }} 
                className="text-2xl hover:opacity-80 transition-opacity"
                aria-label="Visit our YouTube channel"
              >
                <FaYoutube />
              </a> */}
              <a 
                href="https://www.linkedin.com/company/mindxegy" 
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: c.linkColor }} 
                className="text-2xl hover:opacity-80 transition-opacity"
                aria-label="Visit our LinkedIn page"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>

        {/* 2 — Quick Links */}
        <div className="flex flex-col gap-4">
          <h3
            className="text-lg font-semibold"
            style={{ color: c.titleColor }}
          >
            Quick Links
          </h3>
          {['Home','Events','Trainings','Blog'].map(link => (
            <a
              key={link}
              href={link === 'Home' ? '/' : `/${link.toLowerCase()}`}
              className="text-base hover:opacity-80 transition-opacity"
              style={{ color: c.linkColor }}
            >
              {link}
            </a>
          ))}
        </div>

        {/* 3 — Resources */}
        <div className="flex flex-col gap-4">
          <h3
            className="text-lg font-semibold"
            style={{ color: c.titleColor }}
          >
            Hot Topics
          </h3>
          {['FAQs','Support','Privacy Policy','Terms'].map(link => (
            <a
              key={link}
              href={`/${link.replace(/\s+/g,'').toLowerCase()}`}
              className="text-base hover:opacity-80 transition-opacity"
              style={{ color: c.linkColor }}
            >
              {link}
            </a>
          ))}
        </div>

        {/* 4 — Subscribe */}
        <div>
          <Subscribe />
        </div>

        {/* 5 — Developer Card */}
        <div className="flex justify-end">
          <DeveloperCard />
        </div>
      </div>

      <div className="border-t border-white/10 my-8" />

      <div
        className="text-center text-base"
        style={{ color: c.textColor }}
      >
        © 2025 Mind‑X Student Activities. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;