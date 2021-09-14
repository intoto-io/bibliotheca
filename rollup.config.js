import typescript from '@rollup/plugin-typescript';

const packages = [
  'info-tooltip',
];

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
        typescript(),
      ],
    },
    {
      input: `packages/${name}/index.ts`,
      output: {
        dir: `packages/${name}/`,
        entryFileNames: 'lib/[name].d.ts',
      },
      plugins: [
        typescript({
          declaration: true,
          declarationDir: `packages/${name}/lib`,
        }),
      ],
    },
  ]
}, []);
