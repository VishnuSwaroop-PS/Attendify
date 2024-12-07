/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      colors: {
        'primaryColor': '#01B088',        
      },
      fontFamily:{
        Outfit : 'Outfit'
      },
      backgroundImage:{
        'bgImg': 'url(./src/assets/bgTrans.png)'
      }
    },
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
}

