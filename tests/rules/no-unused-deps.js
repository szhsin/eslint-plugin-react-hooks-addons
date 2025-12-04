// @ts-check
'use strict';

const { RuleTester } = require('eslint');
const rule = require('../../dist/cjs/rules/no-unused-deps.cjs');

const ruleTester = new RuleTester({ languageOptions: { ecmaVersion: 'latest' } });

const getError = (
  /** @type {string} */
  unusedDeps,
  { hook = 'useEffect', effectComment = 'effect dep' } = {}
) => ({
  messageId: 'unused',
  data: { unusedDeps, hook, effectComment },
  type: 'ArrayExpression'
});

ruleTester.run('no-unused-deps', /** @type {import('eslint').Rule.RuleModule} */ (rule), {
  valid: [
    `
      useEffect(() => {
          document.title = usedVar;
      }, [usedVar]);
    `,
    `
      useEffect(() => {
          document.title = usedVar;
      }, [usedVar, /* effect dep */ effectVar]);
    `,
    `
      React.useEffect(() => {
        document.title = usedVar;
      }, [usedVar, /* effect dep */ effectVar]);
    `,
    `
      R.useEffect(() => {
        document.title = usedVar;
      }, [usedVar, effectVar]);
    `
  ],

  invalid: [
    {
      code: `
        useLayoutEffect(() => {
            document.title = usedVar;
        }, [usedVar, unusedVar]);
      `,
      errors: [getError("'unusedVar'", { hook: 'useLayoutEffect' })]
    },
    {
      code: `
        React.useLayoutEffect(() => {
            document.title = usedVar;
        }, [usedVar, unusedVar]);
      `,
      errors: [getError("'unusedVar'", { hook: 'useLayoutEffect' })]
    },
    {
      code: `
        useEffect(() => {
            document.title = usedVar;
        }, [usedVar, unusedVar, /* effect dep */ effectVar]);
      `,
      errors: [getError("'unusedVar'")]
    },
    {
      code: `
        useEffect(() => {
            document.title = usedVar;
        }, [usedVar, unusedVar, /* effectful */ effectVar, /* effect dep */ ineffectVar]);
      `,
      options: [{ effectComment: 'effectful' }],
      errors: [getError("'unusedVar', 'ineffectVar'", { effectComment: 'effectful' })]
    },
    {
      code: `
        useEffect(() => {
            const shadowedVar = usedVar;
            document.title = shadowedVar;
        }, [usedVar, unusedVar, /* effect dep */ effectVar, shadowedVar]);
      `,
      errors: [getError("'unusedVar', 'shadowedVar'")]
    },
    {
      code: `
        useEffect(() => {
            const nested = () => {
                document.title = usedVar;
            };
            nested();
        }, [usedVar, unusedVar]);
      `,
      errors: [getError("'unusedVar'")]
    },
    {
      code: `
        useEffect(() => {
          document.title = usedVar;
        }, [usedVar, unusedVar]);

        useLayoutEffect(() => {
            document.title = usedVar;
        }, [usedVar, unusedVar]);

        useMyCustomHook(() => {
          document.title = usedVar;
        }, [usedVar, unusedVar]);
      `,
      options: [{ additionalHooks: { pattern: 'useMyCustomHook|useMyOtherCustomHook' } }],
      errors: [
        getError("'unusedVar'"),
        getError("'unusedVar'", { hook: 'useLayoutEffect' }),
        getError("'unusedVar'", { hook: 'useMyCustomHook' })
      ]
    },
    {
      code: `
        useEffect(() => {
          document.title = usedVar;
        }, [usedVar, unusedVar]);

        useLayoutEffect(() => {
            document.title = usedVar;
        }, [usedVar, unusedVar]);

        useMyOtherCustomHook(() => {
          document.title = usedVar;
        }, [usedVar, unusedVar]);
      `,
      options: [
        {
          additionalHooks: {
            pattern: 'useMyCustomHook|useMyOtherCustomHook',
            replace: true
          }
        }
      ],
      errors: [getError("'unusedVar'", { hook: 'useMyOtherCustomHook' })]
    }
  ]
});
