/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',       // ← aquí activas el modo oscuro vía clase
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
