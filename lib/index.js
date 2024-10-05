'use strict';

const _package = require('../package.json');

module.exports = {
  meta: {
    name: _package.name,
    version: _package.version
  },
  rules: {
    'no-unused-deps': require('./rules/no-unused-deps')
  }
};
