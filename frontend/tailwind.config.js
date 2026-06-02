import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    path.join(__dirname, 'index.html'),
    path.join(__dirname, 'src/**/*.{js,jsx}'),
  ],
  theme: {
    extend: {
      colors: {
        'ink-charcoal': '#1A1C1E',
        'hash-blue': '#4F6F80',
        'ledger-paper': '#FDFCFB',
        outline: '#737878',
        'outline-variant': '#c3c7c7',
        'correction-amber': '#B4846C',
        'integrity-green': '#436850',
        primary: '#171e1e',
        'primary-fixed': '#dde4e3',
        'primary-fixed-dim': '#c1c8c7',
        'primary-container': '#2c3333',
        'on-primary-container': '#949b9b',
        secondary: '#655e48',
        'secondary-container': '#ece2c6',
        'on-secondary-container': '#6b644e',
        'secondary-fixed': '#ece2c6',
        tertiary: '#1f1d13',
        'tertiary-container': '#353227',
        background: '#faf9f5',
        surface: '#faf9f5',
        'surface-container': '#efeeea',
        'surface-container-low': '#f5f4f0',
        'surface-container-high': '#e9e8e4',
        'surface-container-highest': '#e3e2df',
        'surface-variant': '#e3e2df',
        'on-background': '#1b1c1a',
        'on-surface': '#1b1c1a',
        'on-surface-variant': '#434848',
        error: '#ba1a1a',
        'error-container': '#ffdad6',
      },
      spacing: {
        'stack-lg': '32px',
        gutter: '24px',
        'container-max': '1120px',
        'stack-md': '16px',
        unit: '8px',
        'stack-sm': '8px',
        'margin-mobile': '16px',
        'timeline-indent': '48px',
      },
      borderRadius: {
        ledger: '0.5rem',
      },
      fontFamily: {
        'headline-md': ['"Source Serif 4"', 'Georgia', 'serif'],
        'headline-lg': ['"Source Serif 4"', 'Georgia', 'serif'],
        'display-lg': ['"Source Serif 4"', 'Georgia', 'serif'],
        'body-md': ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
        'body-lg': ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
        'label-caps': ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
        'mono-sm': ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        'headline-md': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'headline-lg': ['32px', { lineHeight: '40px', fontWeight: '600' }],
        'display-lg': ['48px', { lineHeight: '56px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'label-caps': ['12px', { lineHeight: '16px', letterSpacing: '0.05em', fontWeight: '600' }],
        'mono-sm': ['12px', { lineHeight: '16px', fontWeight: '400' }],
      },
      maxWidth: {
        'container-max': '1120px',
      },
    },
  },
  plugins: [],
}
