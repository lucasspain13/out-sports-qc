/** @type {import('tailwindcss').Config} */
const { fontFamily } = require("tailwindcss/defaultTheme");

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    // Team color gradients - ensure all gradient combinations are included
    'from-orange-400', 'to-red-500',
    'from-green-400', 'to-emerald-500', 
    'from-blue-400', 'to-indigo-500',
    'from-pink-400', 'to-rose-500',
    'from-gray-100', 'to-gray-200',
    'from-gray-700', 'to-gray-900',
    'from-gray-400', 'to-gray-600',
    'from-amber-600', 'to-amber-800',
    'from-purple-400', 'to-purple-600',
    'from-yellow-400', 'to-yellow-600',
    'from-red-400', 'to-red-600',
    'from-cyan-300', 'to-cyan-500',
    // Brand color gradients
    'from-brand-orange', 'to-brand-orange-dark',
    'from-brand-green', 'to-brand-green-dark',
    'from-brand-blue', 'to-brand-blue-dark',
    'from-brand-pink', 'to-brand-pink-dark',
    'from-brand-white', 'to-brand-white-dark',
    'from-brand-black', 'to-brand-black-dark',
    'from-brand-gray', 'to-brand-gray-dark',
    'from-brand-brown', 'to-brand-brown-dark',
    'from-brand-purple', 'to-brand-purple-dark',
    'from-brand-yellow', 'to-brand-yellow-dark',
    'from-brand-red', 'to-brand-red-dark',
    'from-brand-cyan', 'to-brand-cyan-dark',
    // Background color classes for mobile team indicators
    'bg-orange-500', 'bg-green-500', 'bg-blue-500', 'bg-pink-500',
    'bg-gray-200', 'bg-gray-800', 'bg-gray-500', 'bg-amber-700',
    'bg-purple-500', 'bg-yellow-500', 'bg-red-500', 'bg-cyan-400',
    // Gradient direction classes that might be used dynamically
    'bg-gradient-to-r', 'bg-gradient-to-br'
  ],
  theme: {
    extend: {
      fontFamily: {
        // Use CSS variables that will be set based on platform
        sans: ["var(--font-primary)", ...fontFamily.sans],
        display: ["var(--font-display)", ...fontFamily.sans],
        mono: ["var(--font-mono)", ...fontFamily.mono],
      },
      colors: {
        brand: {
          orange: {
            DEFAULT: "#FF6B35",
            light: "#FF8A5B",
            dark: "#E55A2B",
          },
          green: {
            DEFAULT: "#2ECC71", // Bright green instead of teal
            light: "#58D68D", 
            dark: "#27AE60",
          },
          blue: {
            DEFAULT: "#3498DB", // Lighter blue instead of dark navy
            light: "#5DADE2",
            dark: "#2980B9",
          },
          pink: {
            DEFAULT: "#E91E63", // True pink instead of purple
            light: "#F06292",
            dark: "#C2185B",
          },
          // Additional colors for 12-color expansion
          white: {
            DEFAULT: "#FFFFFF",
            light: "#F9FAFB",
            dark: "#F3F4F6",
          },
          black: {
            DEFAULT: "#000000",
            light: "#374151",
            dark: "#111827",
          },
          gray: {
            DEFAULT: "#6B7280",
            light: "#9CA3AF",
            dark: "#4B5563",
          },
          brown: {
            DEFAULT: "#A16207",
            light: "#D97706",
            dark: "#78350F",
          },
          purple: {
            DEFAULT: "#7C3AED",
            light: "#A78BFA",
            dark: "#5B21B6",
          },
          yellow: {
            DEFAULT: "#EAB308",
            light: "#FDE047",
            dark: "#CA8A04",
          },
          red: {
            DEFAULT: "#DC2626",
            light: "#F87171",
            dark: "#B91C1C",
          },
          cyan: {
            DEFAULT: "#22D3EE", // Transgender pride flag light blue
            light: "#67E8F9",
            dark: "#0891B2",
          },
        },
      },
      backgroundImage: {
        "gradient-primary":
          "linear-gradient(135deg, #DC2626 0%, #FF6B35 16%, #EAB308 33%, #2ECC71 50%, #3498DB 66%, #7C3AED 100%)",
        "gradient-hero":
          "linear-gradient(135deg, #FF6B35 0%, #4ECDC4 25%, #1A365D 50%, #9B59B6 100%)",
        "gradient-card-orange":
          "linear-gradient(135deg, #FF6B35 0%, #FF8A5B 100%)",
        "gradient-card-green":
          "linear-gradient(135deg, #4ECDC4 0%, #7EDDD6 100%)",
        "gradient-card-blue":
          "linear-gradient(135deg, #1A365D 0%, #2D5A87 100%)",
        "gradient-card-pink":
          "linear-gradient(135deg, #9B59B6 0%, #BB7FD1 100%)",
        "gradient-card-white":
          "linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)",
        "gradient-card-black":
          "linear-gradient(135deg, #000000 0%, #374151 100%)",
        "gradient-card-gray":
          "linear-gradient(135deg, #6B7280 0%, #9CA3AF 100%)",
        "gradient-card-brown":
          "linear-gradient(135deg, #A16207 0%, #D97706 100%)",
        "gradient-card-purple":
          "linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)",
        "gradient-card-yellow":
          "linear-gradient(135deg, #EAB308 0%, #FDE047 100%)",
        "gradient-card-red":
          "linear-gradient(135deg, #DC2626 0%, #F87171 100%)",
        "gradient-card-cyan":
          "linear-gradient(135deg, #22D3EE 0%, #67E8F9 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "stagger-1": "fadeIn 0.5s ease-out 0ms forwards",
        "stagger-2": "fadeIn 0.5s ease-out 100ms forwards",
        "stagger-3": "fadeIn 0.5s ease-out 200ms forwards",
        "stagger-4": "fadeIn 0.5s ease-out 300ms forwards",
        float: "float 3s ease-in-out infinite",
        "float-reverse": "floatReverse 4s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "gradient-shift": "gradientShift 8s ease infinite",
        "bounce-subtle": "bounceSubtle 2s ease-in-out infinite",
        wiggle: "wiggle 1s ease-in-out",
        shine: "shine 2s ease-in-out infinite",
        "spin-slow": "spin 3s linear infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
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
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        floatReverse: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(10px)" },
        },
        pulseGlow: {
          "0%, 100%": {
            opacity: "1",
            transform: "scale(1)",
            filter: "brightness(1)",
          },
          "50%": {
            opacity: "0.8",
            transform: "scale(1.05)",
            filter: "brightness(1.1)",
          },
        },
        gradientShift: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        bounceSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-3deg)" },
          "75%": { transform: "rotate(3deg)" },
        },
        shine: {
          "0%": { transform: "translateX(-100%) skewX(-45deg)" },
          "100%": { transform: "translateX(200%) skewX(-45deg)" },
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
