// ESLint v9 flat config — migrated from .eslintrc.js
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier/flat');

module.exports = [
  ...expoConfig,
  prettierConfig,
  {
    ignores: ['node_modules/', '.expo/', 'dist/', 'web-build/', 'cariin-web/'],
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
];
