// Styles - Global styles and theme configurations

// Theme Configuration
export const themeConfig = {
  colors: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
      950: '#082f49',
    },
    forest: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      950: '#052e16',
    },
    coffee: {
      50: '#fefdf8',
      100: '#fef7e0',
      200: '#fdecc8',
      300: '#fbd9a5',
      400: '#f7c373',
      500: '#f2a74b',
      600: '#e88c30',
      700: '#d97326',
      800: '#b45d23',
      900: '#924d22',
      950: '#4f2611',
    },
  },
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    serif: ['Playfair Display', 'Georgia', 'serif'],
    mono: ['JetBrains Mono', 'Consolas', 'monospace'],
  },
  spacing: {
    '18': '4.5rem',
    '88': '22rem',
    '128': '32rem',
  },
  borderRadius: {
    '4xl': '2rem',
  },
} as const;

// Animation Configuration
export const animationConfig = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    'ease-in-out-cubic': 'cubic-bezier(0.4, 0, 0.2, 1)',
    'ease-out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
    'ease-in-back': 'cubic-bezier(0.36, 0, 0.66, -0.56)',
    'ease-out-back': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const;
