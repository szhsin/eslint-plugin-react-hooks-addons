// @ts-check

import tseslint from 'typescript-eslint';
import eslint from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  prettier,
  {
    ignores: ['types/', 'dist/']
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.node,
        ...globals.browser
      }
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off'
    }
  }
);
