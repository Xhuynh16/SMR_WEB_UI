/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts,scss}'],
  theme: {
    extend: {
      colors: {
        primary: '#1a73e8',
        secondary: '#e8f0fe',
      },
      width: {
        'sidebar-expanded': '250px',
        'sidebar-collapsed': '64px',
      },
    },
  },
  plugins: [],
}