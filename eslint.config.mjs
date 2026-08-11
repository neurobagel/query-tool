import eslint from '@eslint/js';
import cypressPlugin from 'eslint-plugin-cypress';
import importPlugin from 'eslint-plugin-import';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import tsdocPlugin from 'eslint-plugin-tsdoc';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist/', 'eslint.config.mjs', 'component.ts', '**/*.js', '**/*.cjs', '**/*.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  cypressPlugin.configs.recommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  jsxA11yPlugin.flatConfigs.recommended,
  {
    files: ['**/*.{ts,tsx}', '**/*.js', '**/*.cjs'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin,
      tsdoc: tsdocPlugin,
    },
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.*json'],
      },
      globals: {
        ...globals.browser,
        ...globals.es2020,
        ...globals.node,
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react/react-in-jsx-scope': 'off',
      'tsdoc/syntax': 'warn',
      /* 
      @typescript-eslint/no-unused-vars is turned off since eslint wasn't picking up on using `_` for unused variables
      which is the solution that we've been using for it.
      */
      '@typescript-eslint/no-unused-vars': 'off',
      /*
      This is redundant as TypeScript's compiler natively verifies namespace imports via its type-checking process.
      See: https://typescript-eslint.io/troubleshooting/performance-troubleshooting/#eslint-plugin-import
      */
      'import/namespace': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
  },
  eslintConfigPrettier
);
