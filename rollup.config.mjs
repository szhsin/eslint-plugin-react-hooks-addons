// @ts-check

import { nodeResolve } from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';

/**
 * @type {import('rollup').RollupOptions}
 */
export default {
  plugins: [
    nodeResolve({ extensions: ['.ts', '.js'] }),
    json({ namedExports: false }),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.ts', '.js']
    })
  ],
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false
  },
  input: './index.ts',
  output: [
    {
      dir: 'dist/cjs',
      format: 'cjs',
      interop: 'default',
      entryFileNames: '[name].cjs',
      preserveModules: true
    }
  ]
};
