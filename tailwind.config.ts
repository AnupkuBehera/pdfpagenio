import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          300: "#fda4af",
          400: "#fb7185",
          500: "#ff4b4b", // Coral Glow
          600: "#e5322d", // Imperial Crimson
          700: "#be123c", // Ruby Deep
          800: "#9f1239",
          900: "#881337",
          950: "#4c0519",
        },
        jewel: {
          coral: {
            DEFAULT: "#E5322D",
            light: "#FFF1F1",
            border: "#FECACA",
          },
          emerald: {
            DEFAULT: "#0D9488",
            light: "#F0FDF4",
            border: "#BBF7D0",
          },
          sapphire: {
            DEFAULT: "#2563EB",
            light: "#EFF6FF",
            border: "#BFDBFE",
          },
          amber: {
            DEFAULT: "#D97706",
            light: "#FFFBEB",
            border: "#FDE68A",
          },
          amethyst: {
            DEFAULT: "#7C3AED",
            light: "#F5F3FF",
            border: "#DDD6FE",
          },
          ruby: {
            DEFAULT: "#E11D48",
            light: "#FFF1F2",
            border: "#FECDD3",
          },
          indigo: {
            DEFAULT: "#6366F1",
            light: "#EEF2FF",
            border: "#C7D2FE",
          },
        },
      },
      boxShadow: {
        "glow-brand": "0 10px 30px -5px rgba(229, 50, 45, 0.28)",
        "glow-emerald": "0 10px 30px -5px rgba(13, 148, 136, 0.25)",
        "glow-sapphire": "0 10px 30px -5px rgba(37, 99, 235, 0.25)",
        "glow-amber": "0 10px 30px -5px rgba(217, 119, 6, 0.25)",
        "glow-amethyst": "0 10px 30px -5px rgba(124, 58, 237, 0.25)",
        "glow-ruby": "0 10px 30px -5px rgba(225, 29, 72, 0.25)",
        "glow-indigo": "0 10px 30px -5px rgba(99, 102, 241, 0.25)",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
