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
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}