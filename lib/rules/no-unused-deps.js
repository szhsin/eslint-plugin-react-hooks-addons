/**
 * @fileoverview Rule to check unused dependencies in React Hooks
 * @author Zheng Song
 */

'use strict';

const hookNames = ['useEffect', 'useLayoutEffect'];
const matchHooks = (calleeName, {
  pattern,
  replace
} = {}) => {
  let match = false;
  if (pattern) {
    match = new RegExp(pattern).test(calleeName);
    if (replace) return match;
  }
  return match || hookNames.includes(calleeName);
};

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
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
    return {
      'ArrowFunctionExpression,FunctionExpression': function (node) {
        const {
          parent
        } = node;
        if (parent.type !== 'CallExpression' || parent.arguments.length < 2 || parent.arguments[1].type !== 'ArrayExpression' || !matchHooks(parent.callee.name, additionalHooks)) {
          return;
        }
        const scope = sourceCode.getScope ? sourceCode.getScope(node) : context.getScope();
        const through = scope.through.map(r => r.identifier.name);
        const depArray = parent.arguments[1];
        const deps = depArray.elements.filter(({
          type
        }) => type === 'Identifier');
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
              hook: parent.callee.name,
              unusedDeps: unusedDeps.map(dep => `'${dep}'`).join(', '),
              effectComment
            }
          });
        }
      }
    };
  }
};