import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        amina: {
          black: "#1C1B1A",
          ink: "#1C1512",       // deeper, warmer near-black for rich text/shadows
          sand: "#F9F7F2",
          ivory: "#FBF7F3",     // slightly cooler bg for hero/product sections
          white: "#FFFFFF",
          clay: "#C2A88F",      // existing gold/clay accent
          gold: "#D4A373",      // brand accent used across components
          rose: "#E8B4B8",      // new: soft dusty rose for feminine glow
          roseDeep: "#B8717C",  // new: deeper rose for hover/contrast states
          terracotta: "#A05044",
          stone: "#8C857F",
          border: "#EBE5DF",
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
        arabic: ['var(--font-amiri)', 'serif'],
      },
      borderRadius: {
        'arch': '120px 120px 0 0',
      },
      boxShadow: {
        'luxury': '0 25px 60px -15px rgba(28, 21, 18, 0.28)',
        'luxury-sm': '0 10px 30px -10px rgba(28, 21, 18, 0.18)',
        'glow-gold': '0 0 45px rgba(212, 163, 115, 0.35)',
        'glow-rose': '0 0 45px rgba(232, 180, 184, 0.4)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255,255,255,0.4)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-18px) scale(1.03)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
        'float-slow': 'float 11s ease-in-out infinite',
        shimmer: 'shimmer 3.5s linear infinite',
        'fade-up': 'fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
      backgroundImage: {
        'shimmer-gold': 'linear-gradient(90deg, #B8917A 0%, #E9CBA7 25%, #D4A373 50%, #E9CBA7 75%, #B8917A 100%)',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
export default config;