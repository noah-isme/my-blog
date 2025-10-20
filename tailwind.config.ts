import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: ['./app/**/*.{ts,tsx,mdx}', './components/**/*.{ts,tsx,mdx}', './content/**/*.{md,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        lightBg: '#FAFAFA',
        lightFg: '#0F172A',
        lightAccent: '#2563EB',
        darkBg: '#0B1020',
        darkFg: '#E5E7EB',
        darkAccent: '#60A5FA',
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        serif: ['var(--font-news)'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '75ch',
            lineHeight: '1.8',
          },
        },
      },
    },
  },
  plugins: [typography],
}

export default config
