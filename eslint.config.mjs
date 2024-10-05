// @ts-check

import eslint from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

export default [
  eslint.configs.recommended,
  prettier,
  {
    ignores: ['lib/', 'examples/']
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.node
      }
    }
  }
];
