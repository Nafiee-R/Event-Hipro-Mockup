import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#11151C",
          page: "#11151C",
          panel: "#1D232A",
          dark: "#0B0E13",
          light: "#262E37",
        },
        ivory: {
          DEFAULT: "#F6EFE3",
          light: "#FDFBF7",
          dark: "#E8DEC8",
        },
        warmGray: {
          DEFAULT: "#C8C1B7",
          light: "#DDD7CD",
          dark: "#A39B8F",
        },
        brass: {
          DEFAULT: "#E1B878",
          light: "#ECC992",
          dark: "#C69B56",
          accent: "#D4A35B",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-source-sans)", "Source Sans 3", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        brass: "0 4px 20px -2px rgba(225, 184, 120, 0.25)",
        dark: "0 10px 30px -5px rgba(0, 0, 0, 0.5)",
      },
    },
  },
  plugins: [],
};
export default config;
