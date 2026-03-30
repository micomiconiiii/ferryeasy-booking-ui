/**
 * tailwind.config.js
 * FerryEasy Theme Configuration
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],

  theme: {
    extend: {
      colors: {
        // FerryEasy Brand Colors
        'ferry': {
          blue: '#1A4789',      // Primary: Brand Blue
          yellow: '#FFD700',    // Accent: Gold
          navy: '#0066CC',      // Secondary: Navy
          green: '#10B981',     // Semantic: Available
          amber: '#F59E0B',     // Semantic: Reserved
          red: '#EF4444',       // Semantic: Blocked
          cyan: '#06B6D4',      // Semantic: Toilets
          orange: '#F97316',    // Semantic: Exits
          purple: '#A855F7',    // Semantic: Canteen
        },
      },

      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      },

      spacing: {
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '6': '1.5rem',
        '8': '2rem',
        '12': '3rem',
        '16': '4rem',
        '20': '5rem',
        '24': '6rem',
      },

      borderRadius: {
        'none': '0',
        'sm': '0.25rem',
        'base': '0.5rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.5rem',
        'full': '9999px',
      },

      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.08)',
        'base': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },

      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
      },

      zIndex: {
        'base': '0',
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
      },
    },
  },

  plugins: [],

  safelist: [
    {
      pattern: /^bg-(ferry|green|blue|red|amber|yellow|cyan|orange|purple)/,
    },
    {
      pattern: /^text-(ferry|green|blue|red|amber|yellow|cyan|orange|purple)/,
    },
    {
      pattern: /^border-(ferry|green|blue|red|amber|yellow|cyan|orange|purple)/,
    },
    {
      pattern: /^(w|h)-(12|14|16)/,
    },
    'animate-slideUp',
    'animate-slideDown',
    'animate-slideLeft',
    'animate-seatPop',
  ],

  corePlugins: {
    aspectRatio: true,
    container: true,
  },

  darkMode: 'media',
}
