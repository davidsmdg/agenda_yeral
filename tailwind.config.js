/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        hand: ['"Caveat"', 'cursive'],
        notes: ['"Patrick Hand"', 'cursive'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        paper: {
          light: '#FDFBF7',
          DEFAULT: '#FAF6EE',
          warm: '#F3ECE0',
          line: '#D8CFC2',
          margin: '#E5989B',
          ink: '#2B2D42',
          blueInk: '#1D3557',
          redInk: '#BC4749',
        }
      }
    },
  },
  plugins: [],
}
