'use strict';

var _package = require('./package.json.cjs');
var noUnusedDeps = require('./rules/no-unused-deps.cjs');

const rules = {
  'react-hooks-addons/no-unused-deps': 'error'
};
const plugin = {
  meta: {
    name: _package.name,
    version: _package.version
  },
  configs: {
    recommended: {},
    'recommended-legacy': {}
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

module.exports = plugin;
