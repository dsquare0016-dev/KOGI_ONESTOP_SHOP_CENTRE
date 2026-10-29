/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './*.{ts,tsx,html}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        kogi: {
          navy: {
            DEFAULT: '#0A192F',
            deep: '#060D17',
            light: '#142540',
            royal: '#1E3A8A',
            border: '#1E293B',
          },
          green: {
            DEFAULT: '#15803D',
            emerald: '#064E3B',
            deep: '#004D40',
            vibrant: '#16A34A',
            light: '#DCFCE7',
            subtle: '#F0FDF4',
          },
          gold: {
            DEFAULT: '#D97706',
            dark: '#B45309',
            light: '#F59E0B',
            accent: '#FBBF24',
            subtle: '#FEF3C7',
          },
          slate: {
            DEFAULT: '#334155',
            dark: '#0F172A',
            muted: '#64748B',
            light: '#E2E8F0',
            bg: '#F8FAFC',
          },
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      boxShadow: {
        'executive': '0 20px 40px -15px rgba(10, 25, 47, 0.08), 0 0 1px 1px rgba(10, 25, 47, 0.05)',
        'executive-hover': '0 30px 60px -12px rgba(10, 25, 47, 0.15), 0 0 1px 1px rgba(10, 25, 47, 0.08)',
        'gold-glow': '0 0 25px -5px rgba(217, 119, 6, 0.3)',
        'green-glow': '0 0 25px -5px rgba(21, 128, 61, 0.25)',
      },
    },
  },
  plugins: [],
};
