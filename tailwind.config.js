/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      height: {
        'header': 'var(--header-height)',
        'footer': 'var(--footer-height)'
      },
      minHeight: {
        'content': 'calc(100vh - var(--header-height) - var(--footer-height))'
      }
    },
  },
  plugins: [],
}