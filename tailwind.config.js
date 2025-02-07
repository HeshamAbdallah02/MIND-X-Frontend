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
            // Add custom larger sizes
            '7xl': ['4.5rem', { lineHeight: '1' }],     // 72px
            '8xl': ['6rem', { lineHeight: '1' }],       // 96px
            '9xl': ['8rem', { lineHeight: '1' }],       // 128px
            'hero': ['10rem', { lineHeight: '1' }],     // 160px
        },
    },
    },
    plugins: [
    require('@tailwindcss/forms'),
    ],
}