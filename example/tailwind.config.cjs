/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./withoutSuspense/*.{js,ts,jsx,tsx}",
    "./withSuspense/*.{js,ts,jsx,tsx}",
    "./display/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
