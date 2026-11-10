/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0c3b44',
          sidebar: '#0e3d46',
          navbar: '#0e3d46',
          primary: '#0c4652',
          primaryHover: '#083842',
          activeItem: '#164d57',
          orange: '#c2410c',
          orangeHover: '#9a3412',
          amber: '#f59e0b',
          cream: '#f7f5ee',
          surface: '#ffffff',
          border: '#e4e2da',
          muted: '#626d7a',
        }
      },
      fontFamily: {
        sans: ['"Inter"', '"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

