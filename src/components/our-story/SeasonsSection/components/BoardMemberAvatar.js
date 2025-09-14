// frontend/src/components/our-story/SeasonsSection/components/BoardMemberAvatar.js
import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const BoardMemberAvatar = ({ 
  member, 
  size = 'normal', // 'small', 'normal', 'medium', or 'large'
  isLeader = false 
}) => {
  const [imageError, setImageError] = useState(false);

  // Debug log to check member data
  console.log('BoardMemberAvatar - Member data:', {
    name: member.name,
    profileUrl: member.profileUrl,
    avatar: member.avatar,
    fullMember: member
  });

  const handleImageError = () => {
    setImageError(true);
  };

  // Generate initials from name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Size configurations with flexible text wrapping - including extraSmall for 4-per-row
  const sizeConfig = {
    extraSmall: {
      container: 'w-10 h-10 md:w-12 md:h-12',
      text: 'text-xs',
      nameSize: 'text-xs leading-tight',
      positionSize: 'text-[9px] leading-tight',
      maxWidth: 'w-14 md:w-16'
    },
    small: {
      container: 'w-12 h-12 md:w-14 md:h-14',
      text: 'text-xs md:text-sm',
      nameSize: 'text-xs leading-tight',
      positionSize: 'text-[10px] leading-tight',
      maxWidth: 'w-16 md:w-18'
    },
    normal: {
      container: 'w-16 h-16 md:w-20 md:h-20',
      text: 'text-base md:text-lg',
      nameSize: 'text-sm leading-tight',
      positionSize: 'text-xs leading-tight',
      maxWidth: 'w-20 md:w-24'
    },
    medium: {
      container: 'w-18 h-18 md:w-22 md:h-22',
      text: 'text-lg md:text-xl',
      nameSize: 'text-sm md:text-base leading-tight',
      positionSize: 'text-xs md:text-sm leading-tight',
      maxWidth: 'w-22 md:w-26'
    },
    large: {
      container: 'w-20 h-20 md:w-24 md:h-24',
      text: 'text-lg md:text-xl',
      nameSize: 'text-base font-bold leading-tight',
      positionSize: 'text-sm leading-tight',
      maxWidth: 'w-24 md:w-28'
    }
  };

  const config = sizeConfig[size];

  return (
    <div className={`flex flex-col items-center text-center relative mx-auto ${config.maxWidth}`}
         style={{ 
           minHeight: 'fit-content' // Allow natural height expansion for text
         }}>
      <div className="relative"> {/* Wrapper for avatar and badge positioning */}
        {member.profileUrl ? (
          <a
            href={member.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`block ${config.container} rounded-full overflow-hidden bg-gray-200 mb-2 shadow-md hover:shadow-lg transition-all duration-200 relative hover:scale-105 flex-shrink-0 cursor-pointer`}
            title={`Visit ${member.name}'s profile`}
          >
            {!imageError && (member.avatar?.url || member.avatar) ? (
              <img
                src={member.avatar?.url || member.avatar}
                alt={member.name}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold ${config.text}`}>
                {getInitials(member.name)}
              </div>
            )}
          </a>
        ) : (
          <div className={`${config.container} rounded-full overflow-hidden bg-gray-200 mb-2 shadow-md hover:shadow-lg transition-all duration-200 relative hover:scale-105 flex-shrink-0`}>
            {!imageError && (member.avatar?.url || member.avatar) ? (
              <img
                src={member.avatar?.url || member.avatar}
                alt={member.name}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold ${config.text}`}>
                {getInitials(member.name)}
              </div>
            )}
          </div>
        )}
        
        {/* Leader Badge - Positioned outside avatar container */}
        {isLeader && (
          <div className="absolute -top-1 -right-1 w-7 h-7 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-xl border-2 border-white z-20">
            <FaStar className="w-3.5 h-3.5 text-white drop-shadow-sm" />
          </div>
        )}
      </div>
      
      <h4 className={`${config.nameSize} text-gray-900 mb-1 ${isLeader ? 'font-bold' : 'font-semibold'} text-center`}
          style={{
            wordBreak: isLeader ? 'normal' : 'break-word', // Leader: keep on one line
            overflowWrap: isLeader ? 'normal' : 'break-word', // Leader: keep on one line
            hyphens: isLeader ? 'none' : 'auto', // Leader: no hyphenation
            lineHeight: '1.2',
            whiteSpace: isLeader ? 'nowrap' : 'normal' // Leader: force single line
          }}>
        {member.name}
      </h4>
      <p className={`${config.positionSize} text-gray-600 ${isLeader ? 'font-medium' : ''} text-center`}
         style={{
           wordBreak: isLeader ? 'normal' : 'break-word', // Leader: keep on one line
           overflowWrap: isLeader ? 'normal' : 'break-word', // Leader: keep on one line
           hyphens: isLeader ? 'none' : 'auto', // Leader: no hyphenation
           lineHeight: '1.2',
           whiteSpace: isLeader ? 'nowrap' : 'normal' // Leader: force single line
         }}>
        {member.position}
      </p>
    </div>
  );
};

export default BoardMemberAvatar;
