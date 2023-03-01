/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        S: "#FF7F7F",
        A: "#FFBF7F",
        B: "#FFDF7F",
        C: "#FFFF7F",
        D: "#BFFF7F",
      },
    },
  },
  plugins: [],
};
