/**
 * @fileoverview Rule to check unused dependencies in React Hooks
 * @author Zheng Song
 */

'use strict';

const hookNames = ['useEffect', 'useLayoutEffect'];

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'problem',
    schema: [],
    messages: {
      unused:
        'React Hook {{ hook }} has unused dependencies: {{ unusedDeps }}. They might cause the effect Hook to run unintentionally. Either exclude them or prepend /* effect dep */ comments to make the intention explicit.'
    }
  },

  create(context) {
    return {
      'ArrowFunctionExpression,FunctionExpression': function (node) {
        const { parent } = node;
        if (
          parent.type !== 'CallExpression' ||
          !hookNames.includes(parent.callee.name) ||
          parent.arguments.length < 2 ||
          parent.arguments[1].type !== 'ArrayExpression'
        ) {
          return;
        }

        const through = context.getScope().through.map((r) => r.identifier.name);
        const depArray = parent.arguments[1];
        const deps = depArray.elements.filter(({ type }) => type === 'Identifier');
        const unusedDeps = [];
        const sourceCode = context.getSourceCode();
        for (const dep of deps) {
          if (through.includes(dep.name)) continue;
          if (
            sourceCode
              .getCommentsBefore(dep)
              .some(({ value }) => value.trim().toLowerCase() === 'effect dep')
          ) {
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
              unusedDeps: unusedDeps.map((dep) => `'${dep}'`).join(', ')
            }
          });
        }
      }
    };
  }
};
