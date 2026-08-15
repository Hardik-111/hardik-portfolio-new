import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", sm: "2rem", lg: "3rem", xl: "4rem" },
      screens: { "2xl": "1320px" },
    },
    extend: {
      colors: {
        ink: {
          DEFAULT: "hsl(var(--ink))",
          soft: "hsl(var(--ink-soft))",
          muted: "hsl(var(--ink-muted))",
          faint: "hsl(var(--ink-faint))",
        },
        canvas: {
          DEFAULT: "hsl(var(--canvas))",
          raised: "hsl(var(--canvas-raised))",
          sunken: "hsl(var(--canvas-sunken))",
        },
        line: "hsl(var(--line) / <alpha-value>)",
        iris: "hsl(var(--iris))",
        cyan: "hsl(var(--cyan))",
        ember: "hsl(var(--ember))",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
      },
      fontSize: {
        "display-xl": ["clamp(2.75rem, 7.6vw, 7.5rem)", { lineHeight: "1", letterSpacing: "-0.042em" }],
        "display-lg": ["clamp(2.25rem, 6vw, 5rem)", { lineHeight: "1.02", letterSpacing: "-0.038em" }],
        "display-md": ["clamp(2.25rem, 5vw, 4rem)", { lineHeight: "1.02", letterSpacing: "-0.035em" }],
        "display-sm": ["clamp(1.75rem, 3.2vw, 2.75rem)", { lineHeight: "1.08", letterSpacing: "-0.03em" }],
        eyebrow: ["0.6875rem", { lineHeight: "1", letterSpacing: "0.22em" }],
      },
      spacing: {
        section: "clamp(6rem, 14vh, 11rem)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.75rem",
      },
      boxShadow: {
        glass: "inset 0 1px 0 0 hsl(0 0% 100% / 0.06), 0 24px 60px -20px hsl(0 0% 0% / 0.7)",
        lift: "0 40px 120px -40px hsl(248 90% 60% / 0.35)",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.16, 1, 0.3, 1)",
        swift: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "none" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.85)", opacity: "0.6" },
          "70%": { transform: "scale(1.6)", opacity: "0" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
        "dash-flow": {
          to: { strokeDashoffset: "-44" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both",
        marquee: "marquee 40s linear infinite",
        "pulse-ring": "pulse-ring 2.6s cubic-bezier(0.16,1,0.3,1) infinite",
        "dash-flow": "dash-flow 3s linear infinite",
        "accordion-down": "accordion-down 0.28s cubic-bezier(0.16,1,0.3,1)",
        "accordion-up": "accordion-up 0.24s cubic-bezier(0.16,1,0.3,1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
