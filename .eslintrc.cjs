module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:cypress/recommended',
    'airbnb',
    'airbnb/hooks',
    '@kesills/airbnb-typescript',
    'prettier',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'component.ts'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.*json'],
  },
  plugins: ['react-refresh', 'cypress', 'eslint-plugin-tsdoc'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'react/react-in-jsx-scope': 'off',
    'tsdoc/syntax': 'warn',
    '@stylistic/indent': 'off',
    '@stylistic/comma-dangle': 'off',
  },
};
