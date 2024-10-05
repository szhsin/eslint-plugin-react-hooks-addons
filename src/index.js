'use strict';

const _package = require('../package.json');

const plugin = {
  meta: {
    name: _package.name,
    version: _package.version
  },
  configs: { recommended: {} },
  rules: {
    'no-unused-deps': require('./rules/no-unused-deps')
  }
};

const rules = {
  'react-hooks-addons/no-unused-deps': 'warn'
};

plugin.configs.recommended = {
  plugins: {
    ['react-hooks-addons']: plugin
  },
  rules
};

plugin.configs['recommended-legacy'] = {
  plugins: ['react-hooks-addons'],
  rules
};

module.exports = plugin;
