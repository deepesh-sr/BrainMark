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
        honey: {
          DEFAULT: "#FFB800",
          light: "#FFD54F",
          dark: "#F9A825",
        },
        gold: {
          DEFAULT: "#D4AF37",
          light: "#F4D03F",
          dark: "#B8860B",
        },
        bee: {
          black: "#1A1A1A",
          dark: "#2D2D2D",
        },
        wax: "#FFF8E1",
        hive: "#3E2723",
      },
      fontFamily: {
        poppins: ["var(--font-poppins)", "sans-serif"],
        fredericka: ["'Fredericka the Great'", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
