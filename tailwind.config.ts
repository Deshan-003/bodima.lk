import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Deep violet sampled from the reference mockup
        primary: {
          50: "#F4F1FF",
          100: "#ECE8FE",
          200: "#D9D2FC",
          300: "#BCAEF8",
          400: "#9583E4",
          500: "#6F5DCB",
          600: "#4C30AC",
          700: "#3B22A1",
          800: "#2F1B85",
          900: "#281E5E",
          950: "#201B57",
        },
        // Gold accent (Sign Up / search / Explore Now buttons)
        accent: {
          DEFAULT: "#FBC63F",
          light: "#FED151",
          dark: "#F0B424",
        },
        // Dark indigo heading text
        night: "#2A2151",
        // Light lavender surfaces
        lav: "#F1EEFD",
        page: "#F6F4FE",
        // Footer deep indigo
        ink: "#201B57",
      },
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 2px 14px 0 rgba(42, 33, 81, 0.08)",
        bar: "0 18px 45px -12px rgba(23, 18, 67, 0.45)",
        cta: "0 8px 20px -6px rgba(32, 27, 87, 0.5)",
      },
    },
  },
  plugins: [],
} satisfies Config;
