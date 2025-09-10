// frontend/src/components/our-story/SeasonsSection/components/YearBadge.js
import React from 'react';

const badgeColors = {
  '2020/21': '#FBB859',  // Golden
  '2021/22': '#81C99C',  // Mint Green
  '2022/23': '#606161',  // Dark Gray
  '2023/24': '#FBB859',  // Cycle back to Golden
  '2024/25': '#81C99C',  // Cycle back to Mint Green
};

const YearBadge = ({ year, className = '' }) => {
  const backgroundColor = badgeColors[year] || '#606161'; // Default to dark gray

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-white text-sm font-semibold shadow-sm ${className}`}
      style={{ backgroundColor }}
    >
      {year}
    </span>
  );
};

export default YearBadge;
