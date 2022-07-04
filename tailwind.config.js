module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './_posts/**/*.md'],
  theme: {
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
    },
    extend: {
      colors: {
        fbstyle: {
          50: '#cecece',
          100: '#b5b5b5',
          200: '#334155',
          300: '#485363',
          400: '#3d4755',
          500: '#333a46',
          600: '#282e37',
          700: '#1d2228',
          800: '#131519',
          900: '#08090b',
        },
      },
    },
  },
  variants: {},
  plugins: [],
};
