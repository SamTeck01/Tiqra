import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Geist", "var(--font-geist-sans)", ...fontFamily.sans],
        mono: ["Geist Mono", "var(--font-geist-mono)", ...fontFamily.mono],
      },
      colors: {
        // Tiqra Brand Colors (from Figma)
        brand: {
          primary: "#9F4EF5",
          background: "#EDE9FE",
          secondary: "#7C3AED",
          soft: "#F3EFFE",
        },
        // Background
        bg: {
          primary: "#FEFEFE",
          secondary: "#F8F9FC",
        },
        // Text
        text: {
          primary: "#111827",
          secondary: "#6B7280",
          muted: "#9CA3AF",
        },
        // Border
        border: {
          subtle: "#F3F4F6",
          default: "#E5E7EB",
        },
        // Status colors
        status: {
          go: "#16A34A",
          "go-bg": "#DCFCE7",
          warn: "#D97706",
          "warn-bg": "#FEF3C7",
          stop: "#DC2626",
          "stop-bg": "#FEE2E2",
        },
        // Buttons
        btn: {
          primary: "#9F4EF5",
          "primary-text": "#FFFFFF",
          "secondary-bg": "#FFFFFF",
          "secondary-border": "#E5E7EB",
        },
        // Card
        card: {
          bg: "#FFFFFF",
          border: "#F3F4F6",
        },
        // Input
        input: {
          border: "#E5E7EB",
        },
      },
      borderRadius: {
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
        "3xl": "30px",
        "4xl": "40px",
        full: "999px",
      },
      boxShadow: {
        sidebar: "4px 4px 32px 0px rgba(0, 0, 0, 0.16)",
        card: "0px 1px 3px 0px rgba(0, 0, 0, 0.08)",
        "card-hover": "0px 4px 16px 0px rgba(0, 0, 0, 0.12)",
        glow: "4px 4px 32px 0px rgba(159, 78, 245, 0.2)",
      },
      fontSize: {
        // Figma type scale
        caption: ["12px", { lineHeight: "120%", letterSpacing: "-0.01em" }],
        sm: ["14px", { lineHeight: "120%", letterSpacing: "-0.01em" }],
        body: ["16px", { lineHeight: "120%", letterSpacing: "-0.02em" }],
        lg: ["18px", { lineHeight: "120%", letterSpacing: "-0.02em" }],
        h3: ["24px", { lineHeight: "120%", letterSpacing: "-0.02em", fontWeight: "600" }],
        h2: ["32px", { lineHeight: "150%", letterSpacing: "-0.03em", fontWeight: "600" }],
        h1: ["48px", { lineHeight: "120%", letterSpacing: "-0.03em", fontWeight: "700" }],
      },
      width: {
        sidebar: "324px",
      },
      animation: {
        "spin-slow": "spin 2s linear infinite",
        "pulse-soft": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-in": "slideIn 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateY(-8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
