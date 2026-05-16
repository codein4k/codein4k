import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#13A1E9',
          orange: '#E95213',
          dark: '#272D2D',
          light: '#F6F8FF',
          muted: '#8F9396',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-hero':
          'linear-gradient(135deg, #0D1117 0%, #161B22 50%, #0D1117 100%)',
        'gradient-brand':
          'linear-gradient(135deg, #13A1E9 0%, #E95213 100%)',
        'gradient-glow':
          'radial-gradient(ellipse at center, rgba(19,161,233,0.15) 0%, transparent 70%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.6s ease-out forwards',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'progress-fill': 'progressFill 1s ease-out forwards',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(19,161,233,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(19,161,233,0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        progressFill: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--progress-width)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-blue': '0 0 30px rgba(19,161,233,0.3)',
        'glow-orange': '0 0 30px rgba(233,82,19,0.3)',
        'card-dark':
          '0 4px 24px rgba(0,0,0,0.4), 0 1px 2px rgba(255,255,255,0.05)',
        'card-light': '0 4px 24px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}

export default config
