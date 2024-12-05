import { type Config } from "tailwindcss";
import animation from "tailwindcss-animated";
import colors from "tailwindcss/colors";

export default {
  darkMode: "class",
  content: [
    "./src/**/*.{ts,tsx}",

    // Path to Tremor module
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    transparent: "transparent",
    current: "currentColor",
    extend: {
      colors: {
        tremor: {
          brand: {
            faint: colors.blue[50],
            muted: colors.blue[200],
            subtle: colors.blue[400],
            DEFAULT: colors.blue[500],
            emphasis: colors.blue[700],
            inverted: colors.white,
          },
          background: {
            muted: colors.gray[50],
            subtle: colors.gray[100],
            DEFAULT: colors.white,
            emphasis: colors.gray[700],
          },
          border: {
            DEFAULT: colors.gray[200],
          },
          ring: {
            DEFAULT: colors.gray[200],
          },
          content: {
            subtle: colors.gray[400],
            DEFAULT: colors.gray[500],
            emphasis: colors.gray[700],
            strong: colors.gray[900],
            inverted: colors.white,
          },
        },
        // manifold colors
        mf: {
          green: "#1c3836",
          gray: "#98A1B2",
          "gray-600": "#475467",
        },
        "dark-tremor": {
          brand: {
            faint: colors.blue[50],
            muted: colors.blue[200],
            subtle: colors.blue[400],
            DEFAULT: colors.blue[500],
            emphasis: colors.blue[700],
            inverted: colors.white,
          },
          background: {
            muted: colors.gray[50],
            subtle: colors.gray[100],
            DEFAULT: colors.white,
            emphasis: colors.gray[700],
          },
          border: {
            DEFAULT: colors.gray[200],
          },
          ring: {
            DEFAULT: colors.gray[200],
          },
          content: {
            subtle: colors.gray[400],
            DEFAULT: colors.gray[500],
            emphasis: colors.gray[700],
            strong: colors.gray[900],
            inverted: colors.white,
          },
        },
      },
      boxShadow: {
        // light
        "tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "tremor-card":
          "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "tremor-dropdown":
          "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        // dark
        "dark-tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "dark-tremor-card":
          "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "dark-tremor-dropdown":
          "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      },
      borderRadius: {
        "tremor-small": "0.375rem",
        "tremor-default": "0.5rem",
        "tremor-full": "9999px",
      },
      fontSize: {
        "tremor-label": ["0.75rem", { lineHeight: "1rem" }],
        "tremor-default": ["0.875rem", { lineHeight: "1.25rem" }],
        "tremor-title": ["1.125rem", { lineHeight: "1.75rem" }],
        "tremor-metric": ["1.875rem", { lineHeight: "2.25rem" }],
      },
      animation: {
        "slide-in": "slide-in .6s ease-out backwards 0.2s",
        "slide-in-delay": "slide-in 0.6s ease-in backwards 0.5s",
        "slide-in-1": "slide-in 0.5s ease-out both 0s",
        "slide-in-2": "slide-in 0.5s ease-out both 0.05s",
        "slide-in-3": "slide-in 0.5s ease-out both 0.1s",
        "slide-in-4": "slide-in 0.5s ease-out both 0.15s",
        "slide-in-5": "slide-in 0.5s ease-out both 0.2s",
        "slide-in-6": "slide-in 0.5s ease-out both 0.25s",
        "slide-in-7": "slide-in 0.5s ease-out both 0.3s",
        "scroll-horizontal": "scroll-horizontal 15s linear infinite",
      },
      keyframes: {
        "slide-in": {
          "0%": { transform: "translateY(-24px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-in-delay": {
          "0%, 50%": { transform: "translateY(-24px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "scroll-horizontal": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(calc(-250px * 3))" },
        },
      },
    },
  },
  plugins: [
    animation,
    require("@tailwindcss/typography"),
    require("@headlessui/tailwindcss"),
    require("@tailwindcss/forms"),
    function({ addUtilities }: { addUtilities: (utilities: Record<string, Record<string, string>>) => void }) {
      addUtilities({
        '.animation-play-state-paused': {
          'animation-play-state': 'paused',
        },
      });
    },
  ],
  variants: {
    extend: {
      animation: ['hover', 'group-hover'],
    },
  },
} satisfies Config;
