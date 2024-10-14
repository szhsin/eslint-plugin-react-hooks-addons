// @ts-check

import eslint from '@eslint/js';
import { fixupPluginRules } from '@eslint/compat';
import globals from 'globals';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactHooksAddons from '../lib/index.js';

export default [
  eslint.configs.recommended,
  reactHooksAddons.configs.recommended,
  prettier,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser
      }
    },
    plugins: {
      // @ts-ignore
      'react-hooks': fixupPluginRules(reactHooks)
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error'
    }
  }
];
