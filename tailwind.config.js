/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3a185c", // dark purple
        },
        secondary: {
          DEFAULT: "#7c3aed", // soft purple
        },
        tertiary: {
          DEFAULT: "#fbbf24", // gold/yellow accent
        },
      },
      fontFamily: {
        sans: ["Inter", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
