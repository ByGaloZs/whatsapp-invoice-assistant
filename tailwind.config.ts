import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        whatsapp: {
          bg: "#0b141a",
          panel: "#111b21",
          green: "#00a884",
          bubble: "#005c4b",
          inbound: "#202c33",
        },
      },
    },
  },
  plugins: [],
};

export default config;
