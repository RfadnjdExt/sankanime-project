/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  darkMode: "class",

  theme: {
    extend: {
      colors: {
        primary: "#ffbade",
        background: "#201f31",
        "dark-secondary": "#383747",
        "card-bg": "#2B2A3C",
        "card-hover": "#3c3a5e",
      },

      fontFamily: {
        sans: ["Roboto", "ui-sans-serif", "system-ui", "sans-serif"],
      },

      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "100% 0" },
          "100%": { backgroundPosition: "-100% 0" },
        },
        glow: {
          "0%": { boxShadow: "0 0 7px #ffbade" },
          "50%": { boxShadow: "0 0 20px #ffbade" },
          "100%": { boxShadow: "0 0 7px #ffbade" },
        },
        "heart-beat": {
          "0%, 50%, 100%": { transform: "scale(1)" },
          "25%, 75%": { transform: "scale(1.05)" },
        },
        "donate-pulse": {
          "0%": { boxShadow: "0 0 0 0 rgba(34, 197, 94, 0.7)" },
          "70%": { boxShadow: "0 0 0 15px rgba(34, 197, 94, 0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(34, 197, 94, 0)" },
        },
        "crown-bounce-slow": {
          "0%, 100%": { transform: "translateY(0) rotate(15deg)" },
          "50%": { transform: "translateY(-4px) rotate(15deg)" },
        },
        slideDown: {
          from: { transform: "translateY(-100%)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
      },

      animation: {
        shimmer: "shimmer 1.5s infinite linear",
        glow: "glow 1.5s infinite",
        "heart-beat": "heart-beat 1.5s ease-in-out infinite",
        "donate-pulse": "donate-pulse 2s infinite",
        "crown-bounce-slow": "crown-bounce-slow 2.5s ease-in-out infinite",
        slideDown: "slideDown 0.5s ease-out",
      },
    },
  },

  plugins: [require("@tailwindcss/line-clamp")],
};
