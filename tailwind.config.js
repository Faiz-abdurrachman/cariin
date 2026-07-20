/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        primaryLight: '#DBEAFE',
        lost: '#F97316',
        'lost-bg': '#FFF7ED',
        'lost-text': '#9A3412',
        found: '#059669',
        'found-bg': '#ECFDF5',
        'found-text': '#065F46',
        admin: '#0D9488',
        'admin-light': '#F0FDFA',
        'admin-text': '#134E4A',
        'admin-border': '#99F6E4',
        pending: '#F59E0B',
        approved: '#059669',
        rejected: '#F97316',
        resolved: '#8B5CF6',
        background: '#EFF6FF',
        surface: '#FFFFFF',
        border: '#BFDBFE',
        textMuted: '#64748B',
      },
    },
  },
  plugins: [],
};
