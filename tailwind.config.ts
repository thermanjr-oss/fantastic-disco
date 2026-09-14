import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#020617",
        surface: "#0f172a",
        accent: "#3b82f6",
      },
    },
  },
  plugins: [],
};

export default config;
