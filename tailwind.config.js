/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      gridTemplateRows: {
        '7': 'repeat(7, auto)',
        '8': 'repeat(8, auto)',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  }
};
