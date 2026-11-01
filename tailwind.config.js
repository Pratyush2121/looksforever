/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0F6FF',
          100: '#E0EDFE',
          200: '#BA DBFC',
          300: '#7CB9F9',
          400: '#3891F4',
          500: '#1455B4', // Primary Blue
          600: '#0E48A0',
          700: '#0A3982',
          800: '#102A56', // Deep Navy
          900: '#0B1D3D',
          950: '#071226',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          soft: '#F4F8FD',
          card: '#FFFFFF',
          border: '#E2E8F0',
          muted: '#64748B',
          dark: '#172033',
        },
        accent: {
          gold: '#D97706',
          emerald: '#059669',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(20, 85, 180, 0.06)',
        'premium': '0 10px 30px -5px rgba(16, 42, 86, 0.08), 0 4px 6px -2px rgba(16, 42, 86, 0.04)',
        'hover': '0 20px 40px -10px rgba(20, 85, 180, 0.16)',
        'glow': '0 0 25px rgba(20, 85, 180, 0.25)',
      },
    },
  },
  plugins: [],
}
