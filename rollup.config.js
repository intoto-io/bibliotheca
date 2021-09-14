import typescript from '@rollup/plugin-typescript';

export default {
  input: {
    info: 'packages/bibliotheca-info/index.ts',
  },
  output: {
    dir: 'packages',
    format: 'es',
    entryFileNames: 'lib/[name].js',
    preserveModules: true,
    preserveModulesRoot: 'packages',
  },
  plugins: [typescript()]
};
