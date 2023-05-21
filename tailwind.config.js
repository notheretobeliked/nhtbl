/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    fontFamily: {
      serif: ['Adelphe-Germinal', 'serif'],
      display: ['Typefesse', 'Impact', 'sans-serif'],
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'white': '#ffffff',
      'black': '#1D1B1B',
      'green': '#E3FE53'
    },

    extend: {},
  },
  plugins: [],
}
