import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefcf9',
          100: '#d5f7f0',
          200: '#b0eee1',
          300: '#7adecd',
          400: '#43c7b4',
          500: '#14B8A6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#0e5c56',
          900: '#0F3D3E',
          950: '#062a2b',
        },
        accent: {
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#F59E0B',
          600: '#d97706',
          700: '#b45309',
        },
        ink: {
          950: '#0B1220',
          900: '#0f1a2e',
          800: '#16233c',
          700: '#243452',
          500: '#4b5b76',
          400: '#64748b',
        },
        paper: '#F8FAFC',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-sora)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(11,18,32,0.06), 0 8px 24px -8px rgba(11,18,32,0.12)',
      },
    },
  },
  plugins: [],
};
export default config;