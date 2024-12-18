const colors = require("tailwindcss/colors");

module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    screens: {
      'xs': '425px',
      'sm': '768px',
      'md': '1024px',
      'lg': '1440px',
      'xl': '1920px'
    },
    fontFamily: {
      'montserrat': 'Montserrat',
    },
    colors: {
      darkBg: '#1a1a1c',
      ...colors
    },
    extend: {
      minHeight: {
        'show': 'calc(100vh - 2.5rem)'
      },
    },
  },
  plugins: []
}