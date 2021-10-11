// import fs from 'fs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';

export default {
  input: './index.ts',
  output: {
    dir: 'lib',
    format: 'cjs',
    entryFileNames: '[name].js',
  },
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'lib',
    }),
    json(),
  ],
};
