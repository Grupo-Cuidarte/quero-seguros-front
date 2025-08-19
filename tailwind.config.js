/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#2A2F8D',
          50: '#F7F8FC',
          100: '#E9EDF2',
          200: '#D4DCEB',
          300: '#B8C5DF',
          400: '#97A8D0',
          500: '#7B8BC4',
          600: '#6A7AB5',
          700: '#5B6AA3',
          800: '#4A5885',
          900: '#2A2F8D',
        },
        secondary: {
          DEFAULT: '#00C2FF',
          50: '#F0FBFF',
          100: '#E0F7FF',
          200: '#B8EFFF',
          300: '#7CE3FF',
          400: '#38D3FF',
          500: '#0BBEFF',
          600: '#00A0E0',
          700: '#0080B5',
          800: '#006B96',
          900: '#005A7A',
        },
        background: '#F7F9FC',
      },
    },
  },
  plugins: [],
}
