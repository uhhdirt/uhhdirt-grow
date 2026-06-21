/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F3F2ED', ink: '#1a1714', red: '#E8332B',
        yellow: '#F4C91B', hair: '#dcd9cf', faded: '#9a9485',
        panel: '#ECEAE2',
      },
      fontFamily: {
        serif: ['Iowan Old Style', 'Palatino', 'Georgia', 'serif'],
        cond: ['Arial Narrow', 'Impact', 'sans-serif'],
        mono: ['DejaVu Sans Mono', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
};
