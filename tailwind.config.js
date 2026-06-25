/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#1a73e8',
          blueHover: '#1765cc',
          blueLight: '#e8f0fe',
          link: '#1a0dab',
          red: '#d93025',
          redLight: '#fce8e6',
          green: '#188038',
          greenLight: '#e6f4ea',
          yellow: '#f9ab00',
          yellowLight: '#fef7e0',
        },
        surface: {
          DEFAULT: '#f8f9fa',
          dark: '#f1f3f4',
        },
        text: {
          primary: '#202124',
          secondary: '#5f6368',
          tertiary: '#80868b',
        },
      },
      fontFamily: {
        sans: ['var(--font-roboto)', 'Arial', 'Helvetica', 'sans-serif'],
        display: ['var(--font-product)', 'Arial', 'Helvetica', 'sans-serif'],
      },
      boxShadow: {
        search: '0 1px 6px rgba(32,33,36,0.28)',
        'search-hover': '0 2px 12px rgba(32,33,36,0.2)',
        card: '0 1px 2px rgba(0,0,0,0.1)',
        modal: '0 8px 40px rgba(0,0,0,0.16)',
      },
      borderRadius: {
        search: '24px',
      },
      maxWidth: {
        results: '752px',
      },
    },
  },
  plugins: [],
}
