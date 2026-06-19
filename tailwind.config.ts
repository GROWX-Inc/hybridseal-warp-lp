import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 制作マスター指示書 第4章 指定値
        base: "#04050A", // 背景
        cyan: {
          DEFAULT: "#3FE3FF",
          soft: "#7CECFF",
        },
        gold: {
          DEFAULT: "#E8C56B",
          soft: "#F2D89B",
        },
        violet: {
          DEFAULT: "#8B6CFF",
        },
      },
      fontFamily: {
        // app/layout.tsx の next/font で CSS変数を割り当て
        heading: ["var(--font-heading)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      boxShadow: {
        cyan: "0 0 24px rgba(63, 227, 255, 0.45)",
        gold: "0 0 24px rgba(232, 197, 107, 0.4)",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
