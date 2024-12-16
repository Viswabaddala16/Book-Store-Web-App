/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Example
      },
      colors: {
        primary: '#0ea5e9', // Sky-500
        secondary: '#64748b', // Slate-500
      },
    },
  },
  plugins: [],
}