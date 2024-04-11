/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      gridTemplateRows: {
        9: 'repeat(9, auto)',
        10: 'repeat(10, auto)',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
