'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const hookNames = ['useEffect', 'useLayoutEffect'];

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'problem',
    schema: [] // no options
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
            message: `React hook ${
              parent.callee.name
            } has unused dependencies: ${unusedDeps.join(', ')}`
          });
        }
      }
    };
  }
};
