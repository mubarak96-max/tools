/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
        mono: ["var(--font-dm-mono)", "monospace"],
      },
      colors: {
        ink: "#0f0e0c",
        parchment: "#f5f0e8",
        gold: "#c9a84c",
        "gold-light": "#e8c97a",
        "gold-dark": "#9a7a2e",
        smoke: "#2a2825",
        ash: "#6b6560",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        shimmer: "shimmer 2s infinite",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(201,168,76,0)" },
          "50%": { boxShadow: "0 0 0 8px rgba(201,168,76,0.15)" },
        },
      },
    },
  },
  plugins: [],
};
