import type { Linter } from 'eslint';
import _package from './package.json';
import noUnusedDeps from './rules/no-unused-deps';

const rules: Linter.RulesRecord = {
  'react-hooks-addons/no-unused-deps': 'warn'
};

const plugin = {
  meta: {
    name: _package.name,
    version: _package.version
  },
  configs: {
    recommended: {} as Linter.Config,
    'recommended-legacy': {} as Linter.LegacyConfig
  },
  rules: {
    'no-unused-deps': noUnusedDeps
  }
};

plugin.configs.recommended = {
  plugins: {
    'react-hooks-addons': plugin
  },
  rules
};

plugin.configs['recommended-legacy'] = {
  plugins: ['react-hooks-addons'],
  rules
};

export default plugin;
