'use strict';

/**
 * @fileoverview Rule to check unused dependencies in React Hooks
 * @author Zheng Song
 */

const reactNamespace = 'React';
const hookNames = ['useEffect', 'useLayoutEffect'];
const matchHooks = (name, {
  pattern,
  replace
} = {}) => {
  let match = false;
  if (pattern) {
    match = new RegExp(pattern).test(name);
    if (replace) return match;
  }
  return match || hookNames.includes(name);
};
const rule = {
  meta: {
    type: 'problem',
    schema: [{
      type: 'object',
      properties: {
        effectComment: {
          type: 'string'
        },
        additionalHooks: {
          type: 'object',
          properties: {
            pattern: {
              type: 'string'
            },
            replace: {
              type: 'boolean'
            }
          },
          required: ['pattern'],
          additionalProperties: false
        }
      },
      additionalProperties: false
    }],
    messages: {
      unused: 'React Hook {{ hook }} has unused dependencies: {{ unusedDeps }}. They might cause the Hook to run unintentionally. Either exclude them or prepend /* {{ effectComment }} */ comments to make the intention explicit.'
    }
  },
  create(context) {
    var _context$sourceCode;
    const {
      effectComment = 'effect dep',
      additionalHooks
    } = context.options[0] || {};
    const sourceCode = (_context$sourceCode = context.sourceCode) != null ? _context$sourceCode : context.getSourceCode();
    const nodeListener = node => {
      const {
        parent
      } = node;
      if (parent.type !== 'CallExpression' || parent.arguments.length < 2 || parent.arguments[1].type !== 'ArrayExpression') {
        return;
      }
      const {
        callee
      } = parent;
      let hookName;
      switch (callee.type) {
        case 'Identifier':
          hookName = callee.name;
          break;
        case 'MemberExpression':
          if (callee.object.type === 'Identifier' && callee.object.name === reactNamespace && callee.property.type === 'Identifier') {
            hookName = callee.property.name;
          }
          break;
      }
      if (!hookName || !matchHooks(hookName, additionalHooks)) return;
      const scope = sourceCode.getScope ? sourceCode.getScope(node) : context.getScope();
      const through = scope.through.map(r => r.identifier.name);
      const depArray = parent.arguments[1];
      const deps = depArray.elements.filter(e => (e == null ? void 0 : e.type) === 'Identifier');
      const unusedDeps = [];
      for (const dep of deps) {
        if (through.includes(dep.name)) continue;
        if (sourceCode.getCommentsBefore(dep).some(({
          value
        }) => value.includes(effectComment))) {
          continue;
        }
        unusedDeps.push(dep.name);
      }
      if (unusedDeps.length > 0) {
        context.report({
          node: depArray,
          messageId: 'unused',
          data: {
            hook: hookName,
            unusedDeps: unusedDeps.map(dep => `'${dep}'`).join(', '),
            effectComment
          }
        });
      }
    };
    return {
      'ArrowFunctionExpression,FunctionExpression': nodeListener
    };
  }
};

module.exports = rule;
