// frontend/src/components/our-story/SeasonsSection/components/BoardMemberGrid.js
import React from 'react';
import BoardMemberAvatar from './BoardMemberAvatar';
import { FiUsers } from 'react-icons/fi';

// Compact sizing to fit 4 avatars per row (but keep leader size unchanged)
const getSizeConfig = (totalMembers) => {
  // Use smaller avatars for members to fit 4 per row, but keep leader large
  if (totalMembers <= 6) {
    return {
      memberSize: 'small', // Use smaller size to fit 4
      leaderSize: 'large', // Keep leader large as originally
      gap: 'gap-2 md:gap-3',
      mobileGap: 'gap-2',
      verticalGap: 'mb-4'
    };
  } else if (totalMembers <= 12) {
    return {
      memberSize: 'small', // Keep small for 4 per row
      leaderSize: 'large', // Keep leader large as originally
      gap: 'gap-1 md:gap-2',
      mobileGap: 'gap-1',
      verticalGap: 'mb-3'
    };
  } else {
    return {
      memberSize: 'extraSmall', // Extra small for many members
      leaderSize: 'large', // Keep leader large as originally
      gap: 'gap-1',
      mobileGap: 'gap-1',
      verticalGap: 'mb-3'
    };
  }
};

// Always aim for 4 per row with smaller avatars when needed
const getOptimalRowDistribution = (memberCount) => {
  // Handle edge cases
  if (memberCount <= 0) return [];
  if (memberCount === 1) return [1];
  if (memberCount === 2) return [2];
  if (memberCount === 3) return [3];
  
  // Always prefer 4 per row when possible
  if (memberCount === 4) return [4];
  if (memberCount === 5) return [4, 1]; // 4 in first row, 1 in second
  if (memberCount === 6) return [4, 2]; // 4 in first row, 2 in second
  if (memberCount === 7) return [4, 3]; // 4 in first row, 3 in second
  if (memberCount === 8) return [4, 4]; // Perfect 4-4 layout
  if (memberCount === 9) return [4, 4, 1]; // 4-4-1 layout
  if (memberCount === 10) return [4, 4, 2]; // 4-4-2 layout
  if (memberCount === 11) return [4, 4, 3]; // 4-4-3 layout
  if (memberCount === 12) return [4, 4, 4]; // Perfect 4-4-4 layout
  
  // For larger counts, distribute in groups of 4
  const distribution = [];
  let remaining = memberCount;
  
  while (remaining > 0) {
    if (remaining >= 4) {
      distribution.push(4);
      remaining -= 4;
    } else {
      distribution.push(remaining);
      remaining = 0;
    }
  }
  
  return distribution;
};

// Helper function to chunk array into rows
const chunkArray = (array, chunkSizes) => {
  const result = [];
  let startIndex = 0;
  
  chunkSizes.forEach(size => {
    result.push(array.slice(startIndex, startIndex + size));
    startIndex += size;
  });
  
  return result;
};

const BoardMemberGrid = ({ boardMembers }) => {
  if (!boardMembers || boardMembers.length === 0) {
    return (
      <div className="text-center py-8">
        <FiUsers className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600">No board members data available</p>
      </div>
    );
  }

  // Identify leader (first member with isLeader flag, or first member with "President" position, or just first member)
  const leader = boardMembers.find(member => member.isLeader) || 
                 boardMembers.find(member => member.position.toLowerCase().includes('president')) ||
                 boardMembers[0];
  const otherMembers = boardMembers.filter(member => member.id !== leader.id);

  // Get dynamic sizing based on total member count
  const sizeConfig = getSizeConfig(boardMembers.length);

  // Get optimal row distribution (always aim for 4 per row)
  const rowDistribution = getOptimalRowDistribution(otherMembers.length);
  const memberRows = chunkArray(otherMembers, rowDistribution);

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center">
        <FiUsers className="w-6 h-6 mr-2 text-blue-600" />
        Board Members
      </h3>

      {/* Leader Section */}
      <div className="flex justify-center mb-8">
        <BoardMemberAvatar
          key={leader.id}
          member={leader}
          size={sizeConfig.leaderSize}
          isLeader={true}
        />
      </div>

      {/* Visual Separator */}
      {otherMembers.length > 0 && (
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            {/* <span className="px-6 py-1 bg-gray-50 text-gray-600 font-medium rounded-full border border-gray-200 shadow-sm">
              Board Members
            </span> */}
          </div>
        </div>
      )}

      {/* Other Board Members in Rows - 4 per row layout */}
      
      {/* Desktop Layout (Large screens) */}
      <div className="hidden lg:block">
        <div className="max-w-full overflow-hidden px-4">
          {memberRows.map((row, rowIndex) => (
            <div 
              key={rowIndex} 
              className={`flex justify-center items-start flex-wrap ${sizeConfig.gap} ${
                rowIndex < memberRows.length - 1 ? sizeConfig.verticalGap : ''
              }`}
            >
              {row.map((member) => (
                <div key={member.id} className="flex-shrink-0">
                  <BoardMemberAvatar
                    member={member}
                    size={sizeConfig.memberSize}
                    isLeader={false}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Tablet Layout (Medium screens) */}
      <div className="hidden md:block lg:hidden">
        <div className="max-w-full overflow-hidden px-3">
          {memberRows.map((row, rowIndex) => (
            <div 
              key={rowIndex} 
              className={`flex justify-center items-start flex-wrap ${sizeConfig.gap} ${
                rowIndex < memberRows.length - 1 ? sizeConfig.verticalGap : ''
              }`}
            >
              {row.map((member) => (
                <div key={member.id} className="flex-shrink-0">
                  <BoardMemberAvatar
                    member={member}
                    size={sizeConfig.memberSize}
                    isLeader={false}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Layout for Better Responsiveness */}
      <div className="block md:hidden">
        <div className="max-w-full overflow-hidden px-2">
          <div className="flex justify-center items-start flex-wrap gap-3">
            {otherMembers.map((member) => (
              <div 
                key={`mobile-${member.id}`} 
                className="flex-shrink-0"
                style={{ 
                  width: 'calc(50% - 0.75rem)' // 2 per row with gap
                }}
              >
                <BoardMemberAvatar
                  member={member}
                  size={sizeConfig.memberSize}
                  isLeader={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardMemberGrid;
