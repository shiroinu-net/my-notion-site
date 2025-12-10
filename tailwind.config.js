/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'main-charcoal': 'var(--main-charcoal)',
        'main-white': 'var(--main-white)',
        'bg-pale-gray': 'var(--bg-pale-gray)',
        accent: {
          'deep-green': 'var(--accent-deep-green)',
          'moss': 'var(--accent-moss)',
          'ice-blue': 'var(--accent-ice-blue)',
          'pale-aqua': 'var(--accent-pale-aqua)',
          'lemon-yellow': 'var(--accent-lemon-yellow)',
        },
      },
    },
  },
  plugins: [],
}