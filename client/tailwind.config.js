const colors = require("tailwindcss/colors");

module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
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