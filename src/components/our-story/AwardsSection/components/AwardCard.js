// frontend/src/components/our-story/AwardsSection/components/AwardCard.js
import React from 'react';
import { 
  FaTrophy, 
  FaMedal, 
  FaAward, 
  FaStar, 
  FaBullseye,
  FaCertificate,
  FaCrown,
  FaGem
} from 'react-icons/fa';

const AwardCard = ({ award, animate }) => {
  // Icon selection based on award type
  const getIconComponent = (iconType) => {
    const icons = {
      trophy: FaTrophy,
      medal: FaMedal,
      award: FaAward,
      star: FaStar,
      target: FaBullseye,
      certificate: FaCertificate,
      crown: FaCrown,
      shield: FaGem
    };
    return icons[iconType] || FaTrophy;
  };

  // Color themes based on award type
  const getColorTheme = (type) => {
    const themes = {
      gold: {
        bg: 'from-yellow-400 via-yellow-500 to-yellow-600',
        glow: 'shadow-yellow-500/50',
        icon: 'text-yellow-100',
        accent: 'border-yellow-300'
      },
      silver: {
        bg: 'from-gray-300 via-gray-400 to-gray-500',
        glow: 'shadow-gray-500/50',
        icon: 'text-gray-100',
        accent: 'border-gray-300'
      },
      bronze: {
        bg: 'from-orange-600 via-orange-700 to-orange-800',
        glow: 'shadow-orange-600/50',
        icon: 'text-orange-100',
        accent: 'border-orange-400'
      },
      special: {
        bg: 'from-purple-500 via-purple-600 to-purple-700',
        glow: 'shadow-purple-500/50',
        icon: 'text-purple-100',
        accent: 'border-purple-300'
      },
      achievement: {
        bg: 'from-blue-500 via-blue-600 to-blue-700',
        glow: 'shadow-blue-500/50',
        icon: 'text-blue-100',
        accent: 'border-blue-300'
      }
    };
    return themes[type] || themes.achievement;
  };

  const IconComponent = getIconComponent(award.iconType);
  const theme = getColorTheme(award.type);

  return (
    <div 
      className={`
        group relative overflow-hidden rounded-2xl p-6 h-80
        backdrop-blur-md bg-white/10 border border-white/20
        transform transition-all duration-700 ease-out
        hover:scale-105 hover:rotate-1 hover:bg-white/15
        shadow-lg hover:shadow-2xl
        ${animate ? 'animate-slideInUp' : ''}
      `}
      style={{
        animationDelay: animate ? `${Math.random() * 0.5}s` : '0s'
      }}
    >
      {/* Colored Theme Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.bg} opacity-10 rounded-2xl`}></div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white transform translate-x-8 -translate-y-8"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white transform -translate-x-6 translate-y-6"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex text-white">
        {/* Icon */}
        <div className="flex-shrink-0 mr-4">
          <div className={`p-3 rounded-full bg-white bg-opacity-50 backdrop-blur-sm ${theme.icon}`}>
            <IconComponent size={32} className="drop-shadow-lg" />
          </div>
        </div>
        
        {/* Content Area */}
        <div className="flex-1">
          {/* Title and Date Row */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold group-hover:text-white transition-colors duration-300 flex-1 pr-2">
              {award.title}
            </h3>
            <span 
              className="text-xs font-semibold rounded-full px-2 py-1 flex-shrink-0 text-white"
              style={{ backgroundColor: '#FBB859' }}
            >
              {award.year}
            </span>
          </div>
          
          {/* State Badge */}
          {award.state && (
            <div className="mb-3">
              <span 
                className="inline-block text-xs font-medium text-white px-2 py-1 rounded-full"
                style={{ backgroundColor: award.stateColor || '#3B82F6' }}
              >
                {award.state}
              </span>
            </div>
          )}
          
          {/* Description */}
          <p className="text-sm opacity-90 group-hover:opacity-100 transition-opacity duration-300 leading-relaxed">
            {award.description}
          </p>
          
          {/* Organization */}
          {award.organization && (
            <div className="mt-2 text-xs opacity-80">
              {award.organization}
            </div>
          )}
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 bg-white rounded-2xl"></div>
    </div>
  );
};

export default AwardCard;
