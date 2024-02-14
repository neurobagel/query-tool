/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      gridTemplateRows: {
        8: 'repeat(8, auto)',
        9: 'repeat(9, auto)',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
