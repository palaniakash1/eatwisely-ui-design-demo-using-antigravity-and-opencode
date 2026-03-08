/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#8fa31e",
        secondary: "#7a8c1a",
      },
    },
  },
  plugins: [
    require('flowbite/plugin'),
  ],
}
