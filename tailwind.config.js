/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
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
        // Base shadcn/ui colors
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },

        // Coffee Industry Brand Colors
        coffee: {
          50: 'hsl(var(--coffee-50))', // Cream
          100: 'hsl(var(--coffee-100))', // Light cream
          200: 'hsl(var(--coffee-200))', // Beige
          300: 'hsl(var(--coffee-300))', // Light brown
          400: 'hsl(var(--coffee-400))', // Medium brown
          500: 'hsl(var(--coffee-500))', // Coffee brown (primary)
          600: 'hsl(var(--coffee-600))', // Dark brown
          700: 'hsl(var(--coffee-700))', // Espresso
          800: 'hsl(var(--coffee-800))', // Dark espresso
          900: 'hsl(var(--coffee-900))', // Almost black
          950: 'hsl(var(--coffee-950))', // Rich black
        },

        // Accent colors for coffee industry
        gold: {
          50: 'hsl(var(--gold-50))',
          100: 'hsl(var(--gold-100))',
          200: 'hsl(var(--gold-200))',
          300: 'hsl(var(--gold-300))',
          400: 'hsl(var(--gold-400))',
          500: 'hsl(var(--gold-500))', // Premium gold
          600: 'hsl(var(--gold-600))',
          700: 'hsl(var(--gold-700))',
          800: 'hsl(var(--gold-800))',
          900: 'hsl(var(--gold-900))',
        },

        // Green for coffee beans/sustainability
        bean: {
          50: 'hsl(var(--bean-50))',
          100: 'hsl(var(--bean-100))',
          200: 'hsl(var(--bean-200))',
          300: 'hsl(var(--bean-300))',
          400: 'hsl(var(--bean-400))',
          500: 'hsl(var(--bean-500))', // Green bean
          600: 'hsl(var(--bean-600))',
          700: 'hsl(var(--bean-700))',
          800: 'hsl(var(--bean-800))',
          900: 'hsl(var(--bean-900))',
        },

        // Status colors for B2B
        success: 'hsl(var(--success))',
        warning: 'hsl(var(--warning))',
        error: 'hsl(var(--error))',
        info: 'hsl(var(--info))',
      },

      fontFamily: {
        // Professional typography for B2B
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
        display: ['Playfair Display', 'Georgia', 'serif'], // For headings
        body: ['Inter', 'system-ui', 'sans-serif'], // For body text
      },

      fontSize: {
        // Professional typography scale
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],

        // Display sizes for hero sections
        'display-sm': [
          '2.25rem',
          { lineHeight: '2.5rem', letterSpacing: '-0.025em' },
        ],
        'display-md': [
          '2.875rem',
          { lineHeight: '3.25rem', letterSpacing: '-0.025em' },
        ],
        'display-lg': [
          '3.75rem',
          { lineHeight: '4.25rem', letterSpacing: '-0.025em' },
        ],
        'display-xl': [
          '4.5rem',
          { lineHeight: '5rem', letterSpacing: '-0.025em' },
        ],
        'display-2xl': [
          '5.625rem',
          { lineHeight: '6rem', letterSpacing: '-0.025em' },
        ],
      },

      spacing: {
        // Extended spacing for professional layouts
        18: '4.5rem',
        88: '22rem',
        128: '32rem',
        144: '36rem',
      },

      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        '4xl': '2rem',
      },

      boxShadow: {
        // Professional shadows for B2B UI
        soft: '0 2px 8px 0 rgba(0, 0, 0, 0.05)',
        medium: '0 4px 16px 0 rgba(0, 0, 0, 0.1)',
        strong: '0 8px 32px 0 rgba(0, 0, 0, 0.15)',
        coffee: '0 4px 16px 0 rgba(139, 69, 19, 0.15)',
        gold: '0 4px 16px 0 rgba(255, 215, 0, 0.2)',
      },

      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-left': {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'coffee-steam': {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '0.7' },
          '50%': {
            transform: 'translateY(-10px) rotate(5deg)',
            opacity: '0.5',
          },
          '100%': {
            transform: 'translateY(-20px) rotate(-5deg)',
            opacity: '0',
          },
        },
      },

      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-in-left': 'slide-in-left 0.5s ease-out',
        'slide-in-right': 'slide-in-right 0.5s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'coffee-steam': 'coffee-steam 2s ease-in-out infinite',
      },

      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'coffee-texture':
          'url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23000000" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
