import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.indigo,
        foreground: {
          DEFAULT: colors.slate[900],
          muted: colors.slate[500],
          subtle: colors.slate[400],
          inverse: colors.white,
        },
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem', letterSpacing: '0.05em' }], // 10px
        '3xs': ['0.5rem', { lineHeight: '0.75rem', letterSpacing: '0.05em' }], // 8px
      },
      backgroundImage: {
        'logo': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234f46e5' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z'/%3E%3Cpath d='M20 2v4'/%3E%3Cpath d='M22 4h-4'/%3E%3Ccircle cx='4' cy='20' r='2'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(0)', opacity: '0.2' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateY(400px)', opacity: '0.2' },
        }
      },
      animation: {
        scan: 'scan 2s linear infinite',
      },
    },
  },
  plugins: [],
}
