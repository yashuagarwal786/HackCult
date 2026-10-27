/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        heritage: {
          amber: '#d97706',
          sandstone: '#b45309',
          terracotta: '#c2410c',
          kalinga: '#0f766e',
          granite: '#334155',
          gold: '#eab308',
          deep: '#0a0f1d',
          surface: '#111827',
          card: '#1f2937',
          border: '#374151'
        }
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        devanagari: ['Noto Sans Devanagari', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
