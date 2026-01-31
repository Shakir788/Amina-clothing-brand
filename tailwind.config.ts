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
          sand: "#F9F7F2",
          white: "#FFFFFF",
          clay: "#C2A88F", // Gold/Clay accent
          terracotta: "#A05044", // New: Deep warm red for subtle details
          stone: "#8C857F",
          border: "#EBE5DF",
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
        arabic: ['var(--font-amiri)', 'serif'], // New Arabic family
      },
      borderRadius: {
        'arch': '120px 120px 0 0', // Special "Moroccan Arch" shape
      }
    },
  },
  plugins: [],
};
export default config;