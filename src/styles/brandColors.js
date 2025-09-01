// frontend/src/styles/brandColors.js
// MIND-X Brand Colors Reference

export const brandColors = {
  // Primary Colors
  primary: {
    golden: '#FBB859',        // 50% usage - Main accents, highlights, CTAs
    mintGreen: '#81C99C',     // 25% usage - Supporting elements, secondary text
    gray: '#606161'           // 25% usage - Body text, subtle elements
  },

  // Color Usage Guidelines
  usage: {
    headings: {
      main: '#606161',        // Primary headings
      accent: '#FBB859',      // Accent words in headings
      secondary: '#81C99C'    // Secondary headings
    },
    text: {
      body: '#606161',        // Main body text
      highlight: '#FBB859',   // Emphasized text
      quotes: '#81C99C'       // Quote highlights
    },
    interactive: {
      primary: '#FBB859',     // Primary buttons, links
      hover: '#81C99C',       // Hover states
      focus: '#FBB859'        // Focus states
    },
    backgrounds: {
      gradient1: 'linear-gradient(135deg, #FBB859 0%, #FFD700 100%)',     // Golden gradient
      gradient2: 'linear-gradient(135deg, #81C99C 0%, #A8E6CF 100%)',     // Mint gradient
      gradient3: 'linear-gradient(135deg, #FBB859 0%, #81C99C 100%)',     // Blend gradient
      gradient4: 'linear-gradient(135deg, #FBB859 0%, #81C99C 50%, #FBB859 100%)' // Rich blend
    }
  },

  // Utility Functions
  withOpacity: (color, opacity) => `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
  
  // Common Combinations
  combinations: {
    goldenBg: 'rgba(251, 184, 89, 0.1)',
    mintBg: 'rgba(129, 201, 156, 0.1)',
    grayBg: 'rgba(96, 97, 97, 0.1)'
  }
};

export default brandColors;
