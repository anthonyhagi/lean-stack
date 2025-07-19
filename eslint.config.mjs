// @ts-check
import eslint from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import fs from 'fs';
import globals from 'globals';

const gitignore = fs.existsSync('.gitignore')
  ? fs.readFileSync('.gitignore', 'utf-8').split('\n').filter(Boolean)
  : [];

export default [
  // Make sure we don't start reading files we shouldn't. Otherwise,
  // these will interfere with our github action test cases.
  {
    ignores: [
      ...gitignore,
      'node_modules/**',
      '!**/.server',
      '!**/.client',
      '.react-router/*',
    ],
  },

  // Handle setting up the TypeScript specific configuration,
  // which includes TSX files.
  {
    files: ['**/*.ts', '**/*.tsx', 'vite.config.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json',
      },
      globals: {
        React: true,
        ...globals.node,
        ...globals.browser,
        ...globals.commonjs,
        ...globals.es2016,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
      formComponents: ['Form'],
      linkComponents: [
        { name: 'Link', linkAttribute: 'to' },
        { name: 'NavLink', linkAttribute: 'to' },
      ],
      'import/resolver': {
        typescript: {},
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      '@typescript-eslint': typescript,
      prettier,
    },
    rules: {
      ...eslint.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,

      // TypeScript-specific rules
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      'no-redeclare': 'off',
      'no-unused-vars': 'off',

      // React-specific rules
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Accessibility rules
      'jsx-a11y/anchor-is-valid': 'warn',

      // Prettier rules
      'prettier/prettier': 'error',
    },
  },
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs', '**/*.jsx'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      // React-specific rules
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Accessibility rules
      'jsx-a11y/anchor-is-valid': 'warn',
    },
  },

  {
    files: ['.eslint.config.mjs'],
    env: {
      node: true,
    },
  },
];
