import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./context/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FBF8F2",
        beige: "#EDE3D3",
        "beige-dark": "#DCCBAE",
        sage: {
          DEFAULT: "#8FA283",
          light: "#B9C7AE",
          dark: "#5F7355",
        },
        gold: {
          DEFAULT: "#C9A24B",
          light: "#E1C784",
        },
        ink: "#3A362E",
        "ink-soft": "#6B6555",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(58, 54, 46, 0.18)",
        card: "0 8px 24px -8px rgba(58, 54, 46, 0.14)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.7s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
