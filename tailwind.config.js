const colors = require('tailwindcss/colors')
module.exports = {
  mode: 'jit',
  purge: [
    './src/**/*.{js,ts,jsx,tsx,css}',
    './src/index.html',
  ],
  theme: {
    fontSize: {
      sm: ['17px', '22px'],
      base: ['21px', '30px'],
      lg: ['22px', '30px'],
      xl: ['28px', '36px'],
    },
    extend: {
      "colors": {
        "fluo": '#DCFF06'
      },      
      "fontFamily": {
        "lab-mono": "Lab Mono Web"
      }
    }
  }
}
