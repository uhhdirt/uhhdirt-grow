/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F3F2ED', ink: '#1a1714', red: '#E8332B',
        yellow: '#F4C91B', hair: '#dcd9cf', faded: '#9a9485',
        panel: '#ECEAE2',
        // SEGA-melded riot palette
        riotblue: '#0b67c2', riotblue2: '#1a8fff',
        mag: '#ff2e85', grn: '#1ec96b',
        void: '#0a0a14', cream: '#fdf6e3',
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
