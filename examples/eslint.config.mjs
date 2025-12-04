// @ts-check

import eslint from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactHooksAddons from 'eslint-plugin-react-hooks-addons';

/**
 * @type {import('eslint').Linter.Config[]}
 */
export default [
  eslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  reactHooksAddons.configs.recommended,
  prettier,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser
      }
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'react-hooks/set-state-in-effect': 'off'
    }
  }
];
