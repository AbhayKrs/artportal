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
      'caviar': 'CaviarDreams',
      'josefinlight': 'JosefinSansLight',
      'josefinregular': 'JosefinSansRegular'
    },
    colors: {
      darkNavHeader: '#1a1a1c',
      darkNavBg: '#1d1d1f',
      ...colors
    },

    extend: {},
  },
  plugins: [
    require('@tailwindcss/custom-forms')
  ]
}
// #2b2b2b