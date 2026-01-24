/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          base: {
            blue: '#0052FF',
            dark: '#000000',
            light: '#FFFFFF',
            gray: {
              50: '#F7F8FA',
              100: '#E8ECEF',
              200: '#D1D8DD',
              300: '#A8B4BD',
              400: '#7C8A96',
              500: '#5B6871',
              600: '#454D54',
              700: '#2D3338',
              800: '#1A1D20',
              900: '#0D0E0F',
            }
          },
        },
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif'],
          mono: ['JetBrains Mono', 'Courier New', 'monospace'],
        },
        boxShadow: {
          'base': '0 2px 8px rgba(0, 82, 255, 0.08)',
          'base-lg': '0 8px 24px rgba(0, 82, 255, 0.12)',
          'base-xl': '0 16px 48px rgba(0, 82, 255, 0.16)',
        }
      },
    },
    plugins: [],
  }