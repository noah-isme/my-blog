/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'inter': ['Inter', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: '#1E1E1E',
        accent: '#4E9F3D',
        secondary: '#F7F7F7',
        textPrimary: '#2C2C2C',
        textSecondary: '#5F5F5F',
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
