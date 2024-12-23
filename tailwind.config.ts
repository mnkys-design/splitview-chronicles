import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
        sans: ["JetBrains Mono", "monospace"], // Making JetBrains Mono the default font
      },
      colors: {
        border: 'var(--text-color)',
        input: 'var(--text-color)',
        ring: 'var(--text-color)',
        background: 'var(--background-color)',
        foreground: 'var(--text-color)',
        primary: {
          DEFAULT: 'var(--text-color)',
          foreground: 'var(--background-color)'
        },
        secondary: {
          DEFAULT: 'var(--text-color-alt)',
          foreground: 'var(--background-color)'
        },
        muted: {
          DEFAULT: 'var(--background-color-alt)',
          foreground: 'var(--text-color-alt)'
        },
        accent: {
          DEFAULT: 'var(--text-color)',
          foreground: 'var(--background-color)'
        },
        popover: {
          DEFAULT: 'var(--background-color)',
          foreground: 'var(--text-color)'
        },
        card: {
          DEFAULT: 'var(--background-color-alt)',
          foreground: 'var(--text-color)'
        }
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': 'var(--text-color)',
            '--tw-prose-headings': 'var(--text-color)',
            '--tw-prose-links': 'var(--text-color)',
            '--tw-prose-bold': 'var(--text-color)',
            '--tw-prose-counters': 'var(--text-color)',
            '--tw-prose-bullets': 'var(--text-color)',
            '--tw-prose-quotes': 'var(--text-color)',
            '--tw-prose-code': 'var(--text-color)',
            '--tw-prose-hr': 'var(--text-color)',
            '--tw-prose-th-borders': 'var(--text-color)',
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;