// @ts-check

import eslint from '@eslint/js';
import { fixupPluginRules } from '@eslint/compat';
import globals from 'globals';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactHooksAddons from '../lib/index.js';

export default [
  eslint.configs.recommended,
  prettier,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser
      }
    },
    plugins: {
      // @ts-ignore
      ['react-hooks']: fixupPluginRules(reactHooks),
      ['react-hooks-addons']: reactHooksAddons
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'react-hooks-addons/no-unused-deps': 'warn'
    }
  }
];
