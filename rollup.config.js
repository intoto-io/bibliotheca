import fs from 'fs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';

const packages = fs.readdirSync(`${__dirname}/packages`);

export default packages.reduce((acc, name) => {
  return [
    ...acc,
    {
      input: `packages/${name}/index.ts`,
      output: {
        dir: `packages/${name}/`,
        format: 'es',
        entryFileNames: 'lib/[name].js',
      },
      plugins: [
        typescript({
          declaration: true,
          declarationDir: `packages/${name}/lib/declarations`,
        }),
        json(),
      ],
    },
  ]
}, []);
