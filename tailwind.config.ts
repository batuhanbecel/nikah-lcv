import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream:  '#FFFEF9',
        plum: {
          950: '#120836',
          900: '#1E0E52',
          800: '#2D1B69',
          700: '#3D2890',
          600: '#5B21B6',
          500: '#7C3AED',
          400: '#8B5CF6',
          300: '#A78BFA',
          200: '#C4B5FD',
          100: '#DDD6FE',
          50:  '#EDE9FE',
          25:  '#F5F3FF',
        },
        blush: '#FFF0F9',
      },
      fontFamily: {
        cormorant: ['var(--font-cormorant)', 'Georgia', 'serif'],
        dm:        ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        superwide: '0.35em',
        ultrawide: '0.5em',
      },
      keyframes: {
        'sound-bar': {
          '0%, 100%': { transform: 'scaleY(0.25)' },
          '50%':       { transform: 'scaleY(1)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '33%':       { transform: 'translateY(-28px) translateX(10px)' },
          '66%':       { transform: 'translateY(-12px) translateX(-8px)' },
        },
        'orb': {
          '0%, 100%': { transform: 'translate(0,0) scale(1)' },
          '33%':       { transform: 'translate(40px,-30px) scale(1.07)' },
          '66%':       { transform: 'translate(-25px,20px) scale(0.94)' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-400% 0' },
          '100%': { backgroundPosition: '400% 0' },
        },
        'ping-soft': {
          '0%, 100%': { transform: 'scale(1)',   opacity: '0.5' },
          '50%':       { transform: 'scale(1.4)', opacity: '0' },
        },
      },
      animation: {
        'sound-bar-1': 'sound-bar 0.9s ease-in-out infinite 0.00s',
        'sound-bar-2': 'sound-bar 0.9s ease-in-out infinite 0.15s',
        'sound-bar-3': 'sound-bar 0.9s ease-in-out infinite 0.30s',
        'sound-bar-4': 'sound-bar 0.9s ease-in-out infinite 0.45s',
        'sound-bar-5': 'sound-bar 0.9s ease-in-out infinite 0.60s',
        'float':       'float 12s ease-in-out infinite',
        'float-slow':  'float 18s ease-in-out infinite reverse',
        'orb':         'orb 20s ease-in-out infinite',
        'orb-slow':    'orb 26s ease-in-out infinite reverse',
        'shimmer':     'shimmer 3s linear infinite',
        'ping-soft':   'ping-soft 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
