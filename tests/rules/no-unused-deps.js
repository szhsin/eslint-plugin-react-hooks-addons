'use strict';

const rule = require('../../lib/rules/no-unused-deps');
const { RuleTester } = require('eslint');

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 'latest' } });

const getError = (unusedDeps, hook = 'useEffect') => ({
  messageId: 'unused',
  data: { unusedDeps, hook },
  type: 'ArrayExpression'
});

ruleTester.run('no-unused-deps', rule, {
  valid: [
    {
      code: `
        useEffect(() => {
            document.title = usedVar;
        }, [usedVar]);
      `
    }
  ],

  invalid: [
    {
      code: `
        useLayoutEffect(() => {
            document.title = usedVar;
        }, [usedVar, unusedVar]);
      `,
      errors: [getError("'unusedVar'", 'useLayoutEffect')]
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
    }
  ]
});
