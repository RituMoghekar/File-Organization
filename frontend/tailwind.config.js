/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#05070c",
        panel: "#0b0f19",
        glass: "rgba(15, 23, 42, 0.6)",
        accent: "#10f0c0",
        accentSoft: "#0dd9b5",
        textMuted: "#8b9bb4",
      },
      boxShadow: {
        glow: "0 0 30px rgba(16, 240, 192, 0.25)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
