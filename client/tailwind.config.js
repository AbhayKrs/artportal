const colors = require("tailwindcss/colors");

module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      'xs': '360px',
      'sm': '640px',
      'md': '768px',
      'lg': '1280px',
      'xl': '1920px'
    },
    fontFamily: {
      'antipasto': 'AntipastoProRegular',
      'caviar': 'CaviarDreams'
    },
    colors: {
      darkNavBg: '#1d1d1f',
      ...colors
    },
    extend: {},
  },
  plugins: [],
}
// #2b2b2b