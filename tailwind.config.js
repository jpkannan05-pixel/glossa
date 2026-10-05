/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sanskrit: {
          50: '#FDFBF7',
          100: '#FAF6EF',
          200: '#F2E8DC',
          300: '#E5D4C0',
          400: '#D1B496',
          500: '#992233', // Primary Burgundy/Maroon
          600: '#7A1C29', // Deep Maroon
          700: '#5A121C', // Dark Maroon
          800: '#3D0A11',
          900: '#230408',
        },
        gold: {
          100: '#FDF7E7',
          300: '#EAD18D',
          500: '#D4AF37', // Gold accent
          600: '#B89225',
          700: '#967417',
        },
        charcoal: {
          50: '#F6F7F7',
          100: '#E3E5E5',
          300: '#B2B7B6',
          500: '#646D6A',
          700: '#343B38',
          900: '#1F2421', // Primary text
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
        serif: ['Cinzel', 'Playfair Display', 'Merriweather', 'serif'],
        sanskrit: ['Noto Sans Devanagari', 'Cinzel', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(122, 28, 41, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'card': '0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 4px 10px -2px rgba(0, 0, 0, 0.02)',
        'glow': '0 0 25px rgba(212, 175, 55, 0.25)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
