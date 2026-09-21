/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff9ff',
          100: '#dff2ff',
          200: '#b9e6fe',
          300: '#7cd4fd',
          400: '#36bffa',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      boxShadow: {
        card: '0 2px 10px -2px rgba(15, 23, 42, 0.08)',
        'card-hover': '0 12px 28px -8px rgba(2, 132, 199, 0.25)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0369a1 0%, #0284c7 45%, #0ea5e9 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(6px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
