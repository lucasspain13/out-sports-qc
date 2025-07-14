/** @type {import('tailwindcss').Config} */
const { fontFamily } = require("tailwindcss/defaultTheme");

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
        display: ["Poppins", ...fontFamily.sans],
      },
      colors: {
        brand: {
          orange: {
            DEFAULT: "#FF6B35",
            light: "#FF8A5B",
            dark: "#E55A2B",
          },
          teal: {
            DEFAULT: "#4ECDC4",
            light: "#7EDDD6",
            dark: "#3CBAB1",
          },
          blue: {
            DEFAULT: "#1A365D",
            light: "#2D5A87",
            dark: "#0F2A44",
          },
          purple: {
            DEFAULT: "#9B59B6",
            light: "#BB7FD1",
            dark: "#8E44AD",
          },
        },
      },
      backgroundImage: {
        "gradient-primary":
          "linear-gradient(135deg, #FF6B35 0%, #4ECDC4 25%, #1A365D 50%, #9B59B6 100%)",
        "gradient-hero":
          "linear-gradient(135deg, #1A365D 0%, #9B59B6 50%, #4ECDC4 100%)",
        "gradient-card-orange":
          "linear-gradient(135deg, #FF6B35 0%, #FF8A5B 100%)",
        "gradient-card-teal":
          "linear-gradient(135deg, #4ECDC4 0%, #7EDDD6 100%)",
        "gradient-card-blue":
          "linear-gradient(135deg, #1A365D 0%, #2D5A87 100%)",
        "gradient-card-purple":
          "linear-gradient(135deg, #9B59B6 0%, #BB7FD1 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "stagger-1": "fadeIn 0.5s ease-out 0ms forwards",
        "stagger-2": "fadeIn 0.5s ease-out 100ms forwards",
        "stagger-3": "fadeIn 0.5s ease-out 200ms forwards",
        "stagger-4": "fadeIn 0.5s ease-out 300ms forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
      },
    },
  },
  plugins: [],
};
