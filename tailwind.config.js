/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
      },
      fontSize: {
        '7xl': ['4.5rem', { lineHeight: '1' }],     // 72px
        '8xl': ['6rem', { lineHeight: '1' }],       // 96px
        '9xl': ['8rem', { lineHeight: '1' }],       // 128px
        'hero': ['10rem', { lineHeight: '1' }],     // 160px
      },
      transitionTimingFunction: {
        'ease-out-quad': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      containers: {
        'splash': '20rem',
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { backgroundPosition: '0% center' },
          '50%': { backgroundPosition: '200% center' },
        },
        fadeSlideIn: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      animation: {
        shimmer: 'shimmer 3s ease-in-out infinite',
        fadeSlideIn: 'fadeSlideIn 0.5s ease',
        fadeIn: 'fadeIn 0.2s ease',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}