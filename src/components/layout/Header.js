import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useHeaderConfig } from '../../context/HeaderConfigContext';
import Logo from './Logo';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { admin, logout } = useAuth();
  const { config: headerConfig, loading } = useHeaderConfig();
  const location = useLocation();

  // Check if the current route is part of the dashboard
  const isDashboardRoute = location.pathname.startsWith('/dashboard');
  const isAdminLoginPage = location.pathname.match('/admin/login');
  const isDashboard = !!admin;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Define navigation items based on the current route
  const navItems = isDashboardRoute
    ? [
        { name: 'Home', path: '/dashboard' },
        { name: 'Our Story', path: '/dashboard/our-story' },
        { name: 'Events', path: '/dashboard/events' },
        { name: 'Trainings', path: '/dashboard/trainings' },
        { name: 'Crew', path: '/dashboard/crew' },
        { name: 'Daily Life', path: '/dashboard/daily-life' },
        { name: 'Blog', path: '/dashboard/blog' },
      ]
    : [
        { name: 'Home', path: '/' },
        { name: 'Our Story', path: '/our-story' },
        { name: 'Events', path: '/events' },
        { name: 'Trainings', path: '/trainings' },
        { name: 'Crew', path: '/crew' },
        { name: 'Daily Life', path: '/daily-life' },
        { name: 'Blog', path: '/blog' },
      ];

  if (isAdminLoginPage) {
    return null;
  }

  const isActivePath = (path) => {
    if (isDashboardRoute) {
      if (path === '/dashboard' && location.pathname === '/dashboard') {
        return true;
      }
      return location.pathname.startsWith(path) && path !== '/dashboard';
    }
    return location.pathname === path;
  };

  if (loading) {
    return <div className="h-16 bg-[#81C99C]" />;
  }

  return (
    <header
      style={{
        background: isScrolled
          ? `linear-gradient(to right, white, ${headerConfig?.colors?.background || '#81C99C'}E6 25%)`
          : `linear-gradient(to right, white, ${headerConfig?.colors?.background || '#81C99C'} 25%)`,
        '--text-default': headerConfig?.colors?.text?.default || '#606161',
        '--text-hover': headerConfig?.colors?.text?.hover || '#FBB859',
      }}
      className={`fixed w-full top-0 z-50 transition-all duration-300 min-h-[64px] ${
        isScrolled ? 'backdrop-blur-sm shadow-lg' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-16 min-h-[64px]">
          {/* Logo */}
          <div className="flex-shrink-0 transform hover:scale-105 transition-transform duration-200">
            <Link to={isDashboardRoute ? '/dashboard' : '/'}>
              {headerConfig?.logo?.imageUrl ? (
                <img
                  src={headerConfig.logo.imageUrl}
                  alt={headerConfig.logo.altText || 'MIND-X Logo'}
                  className="h-40 object-contain"
                />
              ) : (
                <Logo />
              )}
            </Link>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <nav className="flex space-x-1">
              {navItems.map((item) => {
                const isActive = isActivePath(item.path);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`relative px-3 py-2 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-[var(--text-hover)]'
                        : 'text-[var(--text-default)] hover:text-[var(--text-hover)]'
                    } group`}
                  >
                    {item.name}
                    <span
                      className={`absolute bottom-0 left-0 w-full h-0.5 bg-[var(--text-hover)] transform origin-left transition-transform duration-200 ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>
            {/* Show logout button only on dashboard routes */}
            {isDashboard && isDashboardRoute && (
              <button
                onClick={logout}
                className="ml-6 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
              >
                <span>Logout</span>
              </button>
            )}
          </div>
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{ color: headerConfig?.colors?.text?.default || '#606161' }}
              className="relative inline-flex items-center justify-center w-10 h-10 p-2 rounded-md hover:text-[var(--text-hover)] focus:outline-none focus:ring-2 focus:ring-inset transition-colors duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <div className="absolute w-6 h-6 flex flex-col justify-center items-center">
                <span
                  className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ${
                    isMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'
                  }`}
                />
                <span
                  className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ${
                    isMenuOpen ? 'opacity-0' : 'translate-y-0'
                  }`}
                />
                <span
                  className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ${
                    isMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-16 left-0 right-0 transform transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
      >
        <div
          style={{ backgroundColor: `${headerConfig?.colors?.background}E6` || '#81C99CE6' }}
          className="px-2 pt-2 pb-3 space-y-1 backdrop-blur-sm shadow-lg"
        >
          {navItems.map((item) => {
            const isActive = isActivePath(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActive
                    ? 'text-[var(--text-hover)] bg-[var(--text-default)]/10'
                    : 'text-[var(--text-default)] hover:text-[var(--text-hover)]'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            );
          })}

          {/* Show logout button only on dashboard routes
          {isDashboard && isDashboardRoute && (
            <button
              onClick={logout}
              className="w-full text-left px-3 py-2 mt-2 text-base font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          )} */}
        </div>
      </div>
    </header>
  );
};

export default Header;