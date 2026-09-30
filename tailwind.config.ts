import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/frontend/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: {
          DEFAULT: "var(--surface)",
          raised: "var(--surface-raised)",
        },
        foreground: "var(--foreground)",
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--surface)",
        },
        border: "var(--border)",
        success: "var(--success)",
        danger: "var(--danger)",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      borderRadius: {
        none: "0px",
        sm: "4px",
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
        full: "9999px",
      },
      spacing: {
        // Tuân thủ bội số 4px theo DESIGN.md: 4, 8, 12, 16, 24, 32, 48, 64
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        6: "24px",
        8: "32px",
        12: "48px",
        16: "64px",
      },
    },
  },
  plugins: [],
};

export default config;
