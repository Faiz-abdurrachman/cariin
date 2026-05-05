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
        // Palet brand Cari.In — sinkron dengan COLORS di src/utils/constants.ts
        primary: '#18181B',
        lost: '#EF4444',
        'lost-bg': '#FEE2E2',
        'lost-text': '#991B1B',
        found: '#22C55E',
        'found-bg': '#D1FAE5',
        'found-text': '#065F46',
        admin: '#4F46E5',
        'admin-light': '#EEF2FF',
        'admin-text': '#3730A3',
        pending: '#F59E0B',
        approved: '#22C55E',
        rejected: '#EF4444',
        resolved: '#8B5CF6',
      },
    },
  },
  plugins: [],
};
