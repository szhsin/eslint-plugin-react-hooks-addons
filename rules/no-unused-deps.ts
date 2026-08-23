/**
 * Rule to check unused dependencies in React Hooks
 * @author Zheng Song
 */

import type { Rule, Scope, SourceCode } from 'eslint';
import type { Identifier, Node } from 'estree';

type RuleOption = {
  effectComment?: string;
  additionalHooks?: { pattern?: string; replace?: string };
};

const reactNamespace = 'React';
const hookNames = ['useEffect', 'useLayoutEffect'];

/**
 * Resolves the identifier a dependency is rooted in, so that member expression dependencies such as
 * `props.value` can be checked against the identifiers the hook body references.
 */
const rootIdentifier = (node: Node): Identifier | undefined => {
  let current = node;
  while (current.type === 'MemberExpression') {
    current = current.object;
  }

  return current.type === 'Identifier' ? current : undefined;
};

const matchHooks = (
  name: string,
  { pattern, replace }: RuleOption['additionalHooks'] = {}
) => {
  let match = false;
  if (pattern) {
    match = new RegExp(pattern).test(name);
    if (replace) return match;
  }

  return match || hookNames.includes(name);
};

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    schema: [
      {
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
      }
    ],
    messages: {
      unused:
        'React Hook {{ hook }} has unused dependencies: {{ unusedDeps }}. They might cause the Hook to run unintentionally. Either exclude them or prepend /* {{ effectComment }} */ comments to make the intention explicit.'
    }
  },

  create(context) {
    const { effectComment = 'effect dep', additionalHooks } =
      (context.options[0] as RuleOption) || {};
    const sourceCode =
      context.sourceCode ??
      (context as unknown as { getSourceCode: () => SourceCode }).getSourceCode();

    const nodeListener: Rule.NodeListener['FunctionExpression'] = (node) => {
      const { parent } = node;
      if (
        parent.type !== 'CallExpression' ||
        parent.arguments.length < 2 ||
        parent.arguments[1].type !== 'ArrayExpression'
      ) {
        return;
      }

      const { callee } = parent;
      let hookName: string | undefined;
      switch (callee.type) {
        case 'Identifier':
          hookName = callee.name;
          break;
        case 'MemberExpression':
          if (
            callee.object.type === 'Identifier' &&
            callee.object.name === reactNamespace &&
            callee.property.type === 'Identifier'
          ) {
            hookName = callee.property.name;
          }
          break;
      }

      if (!hookName || !matchHooks(hookName, additionalHooks)) return;

      const scope = sourceCode.getScope
        ? sourceCode.getScope(node)
        : (context as unknown as { getScope: () => Scope.Scope }).getScope();
      const through = scope.through.map((r) => r.identifier.name);
      const depArray = parent.arguments[1];
      const deps = depArray.elements.filter(
        (e) => e?.type === 'Identifier' || e?.type === 'MemberExpression'
      );
      const unusedDeps = [];
      for (const dep of deps) {
        const root = rootIdentifier(dep);
        // a computed root, such as `getItem().value`, cannot be traced back to an identifier
        if (!root || through.includes(root.name)) continue;
        if (
          sourceCode
            .getCommentsBefore(dep)
            .some(({ value }) => value.includes(effectComment))
        ) {
          continue;
        }

        unusedDeps.push(sourceCode.getText(dep));
      }

      if (unusedDeps.length > 0) {
        context.report({
          node: depArray,
          messageId: 'unused',
          data: {
            hook: hookName,
            unusedDeps: unusedDeps.map((dep) => `'${dep}'`).join(', '),
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

export default rule;
