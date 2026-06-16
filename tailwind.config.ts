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
        surface: "#111111",
        border: "#1f1f1f",
        "border-hover": "#2a2a2a",
        "text-primary": "#ffffff",
        "text-secondary": "#888888",
        "text-muted": "#555555",
        "status-active": "#22c55e",
        "status-paused": "#eab308",
        "status-completed": "#6b7280",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
