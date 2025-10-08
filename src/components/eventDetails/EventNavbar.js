// frontend/src/components/eventDetails/EventNavbar.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useHeaderConfig } from '../../context/HeaderConfigContext';
import Logo from '../layout/Logo';

const EventNavbar = ({ sections, activeSection, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { config: headerConfig, loading } = useHeaderConfig();

  // Handle scroll for navbar background blur
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on section navigation
  const handleNavigate = (sectionId) => {
    onNavigate(sectionId);
    setIsMobileMenuOpen(false);
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  if (loading) {
    return <div className="h-16 bg-[#81C99C]" />;
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        background: isScrolled
          ? `linear-gradient(to right, white, ${headerConfig?.colors?.background || '#81C99C'}E6 25%)`
          : `linear-gradient(to right, white, ${headerConfig?.colors?.background || '#81C99C'} 25%)`,
        '--text-default': headerConfig?.colors?.text?.default || '#606161',
        '--text-hover': headerConfig?.colors?.text?.hover || '#FBB859',
      }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 min-h-[64px] ${
        isScrolled ? 'backdrop-blur-sm shadow-lg' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-16 min-h-[64px]">
          {/* Logo - Same as main Header */}
          <div className="flex-shrink-0 relative group">
            <Link 
              to="/" 
              className="inline-block relative h-16 w-40 hover:scale-105 transition-transform duration-200"
            >
              {headerConfig?.logo?.imageUrl ? (
                <img
                  src={headerConfig.logo.imageUrl}
                  alt={headerConfig.logo.altText || 'MIND-X Logo'}
                  className="h-full w-full object-contain object-left p-2 pointer-events-none"
                />
              ) : (
                <div className="h-full flex items-center justify-start">
                  <Logo />
                </div>
              )}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleNavigate(section.id)}
                className={`relative px-3 py-2 text-sm font-medium transition-all duration-200 group ${
                  activeSection === section.id
                    ? 'text-[var(--text-hover)]'
                    : 'text-[var(--text-default)] hover:text-[var(--text-hover)]'
                }`}
              >
                {section.label}
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-[var(--text-hover)] transform origin-left transition-transform duration-200 ${
                    activeSection === section.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{ color: headerConfig?.colors?.text?.default || '#606161' }}
              className="relative inline-flex items-center justify-center w-10 h-10 p-2 rounded-md hover:text-[var(--text-hover)] focus:outline-none focus:ring-2 focus:ring-inset transition-colors duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <div className="absolute w-6 h-6 flex flex-col justify-center items-center">
                <span
                  className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ${
                    isMobileMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'
                  }`}
                />
                <span
                  className={`absolute h-0.5 w-6 bg-current transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span
                  className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ${
                    isMobileMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden z-40"
              style={{ top: '64px' }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-16 bottom-0 w-64 shadow-xl md:hidden overflow-y-auto z-50"
              style={{ 
                background: `linear-gradient(to bottom, white, ${headerConfig?.colors?.background || '#81C99C'}10)` 
              }}
            >
              <div className="py-4">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => handleNavigate(section.id)}
                    className={`w-full px-6 py-3 text-left font-medium transition-colors ${
                      activeSection === section.id
                        ? 'text-[var(--text-hover)] bg-[var(--text-hover)]/10 border-l-4 border-[var(--text-hover)]'
                        : 'text-[var(--text-default)] hover:bg-[var(--text-hover)]/5 hover:text-[var(--text-hover)]'
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default EventNavbar;
