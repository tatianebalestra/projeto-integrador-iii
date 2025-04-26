/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yellow: {
          light: '#FFED4A',
          DEFAULT: '#F2D024',
          dark: '#E3B008',
        },
        orange: {
          light: '#FDBA74',
          DEFAULT: '#F97316',
          dark: '#EA580C',
        },
        blue: {
          light: '#93C5FD',
          DEFAULT: '#3B82F6',
          dark: '#1D4ED8',
        },
        primary: '#F97316', // Orange as primary
        secondary: '#3B82F6', // Blue as secondary
        accent: '#F2D024', // Yellow as accent
      },
    },
  },
  plugins: [],
}