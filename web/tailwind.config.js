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
      'nunito': 'Nunito',
    },
    colors: {
      darkBg: '#1a1a1c',
      ...colors
    },
    extend: {
      fontSize: {
        xs: ['0.75rem', '0.75rem'],
        sm: ['0.875rem', '0.875rem'],
        lg: ['1rem', '1rem'],
        xl: ['1.125rem', '1.125rem'],
        "2xl": ['1.5rem', '1.5rem'],
        "3xl": ['1.875rem', '1.875rem']
      },
      minHeight: {
        'show': 'calc(100vh - 2.5rem)'
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.wrap-any': {
          overflowWrap: 'anywhere',
        },
      });
    },
    function ({ addBase }) {
      addBase({
        '::-webkit-scrollbar': {
          width: '0.5em',
        },
        '::-webkit-scrollbar-track': {
          backgroundColor: '#94a3b8',
        },
        '::-webkit-scrollbar-thumb': {
          backgroundColor: '#f3f4f6',
          borderRadius: 3
        },
        '@media (prefers-color-scheme: dark)': {
          '::-webkit-scrollbar': {
            width: '0.5em'
          },
          '::-webkit-scrollbar-track': {
            backgroundColor: '#1a1a1c',
          },
          '::-webkit-scrollbar-thumb': {
            backgroundColor: '#525252',
            borderRadius: 3
          },
        }
      });
    },
  ]
}