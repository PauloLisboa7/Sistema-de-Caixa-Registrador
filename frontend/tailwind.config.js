/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tema Açougue/Premium
        'meat': {
          50: '#faf4f0',
          100: '#f5e8e1',
          200: '#ecd2c3',
          300: '#e2bba5',
          400: '#d9a587',
          500: '#c9865f',
          600: '#b86f48',
          700: '#a0593a',
          800: '#88472e',
          900: '#6d3725',
        },
        'gold': {
          50: '#fffbf0',
          100: '#fff7e6',
          200: '#ffefd4',
          300: '#ffe7c2',
          400: '#ffdfa0',
          500: '#ffd700',
          600: '#dab800',
          700: '#b89900',
          800: '#8b7200',
          900: '#705d00',
        },
        'premium-dark': '#1a1410',
        'premium-light': '#fdfcfb',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'meat': '0 10px 25px rgba(169, 89, 58, 0.15)',
        'meat-lg': '0 20px 40px rgba(169, 89, 58, 0.2)',
        'gold': '0 10px 25px rgba(255, 215, 0, 0.1)',
      },
      borderRadius: {
        'meat': '12px',
      },
      spacing: {
        'meat': '1.75rem',
      },
    },
  },
  plugins: [],
}
