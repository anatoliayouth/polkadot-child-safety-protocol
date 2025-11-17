/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './context/**/*.{js,ts,jsx,tsx}',
    './hooks/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        polkadotPink: '#e6007a',
        polkadotPurple: '#6c2bd9',
        polkadotIndigo: '#2d1b69',
        polkadotDark: '#0f0f1a'
      }
    }
  },
  plugins: []
}
