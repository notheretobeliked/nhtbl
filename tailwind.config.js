/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  safelist: [
    'grid-cols-2',
    'grid-cols-3',
    'bg-black',
    'bg-nhtbl-purple-light',
    'object-cover',
    'object-fit',
    'object-fill',
    'object-none',
    'object-contain',
  ],
  theme: {
    fontFamily: {
      'sans': ['Inter Tight'],
      'display': ['Avara'],
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'black': "#000000",
      'white': "#FFFFFF",  
      'nhtbl-green': {
        base: '#E0FF00'
      },  
      'nhtbl-purple': {
        base: '#D59CE5',
        light: '#E4D5E8',
      },  
    },
    fontSize: {
      'sm': '.875rem',
      'base': ['1rem', '1.25'],
      'lg': ['1.25rem', '1.35'],
      'xl': ['2rem', '1.3'],
      '2xl': ['2.875rem', '1.2'],
     },
    screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },

    extend: {},
  },
  plugins: [],
}
