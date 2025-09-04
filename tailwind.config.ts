// Tailwind v4 still supports a config file for content globs and plugins.
// Design tokens now primarily live in CSS via @theme, but we retain plugins here.
export default {
  darkMode: "class",
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
