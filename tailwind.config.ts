// Tailwind CSS v4 configuration
// Only minimal config retained: content globs & plugin registration.
// All design tokens are defined in `client/src/index.css` using the @theme directive.
import tailwindcssAnimate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";

export default {
  darkMode: "class",
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  plugins: [tailwindcssAnimate, typography],
};
