// note: this is needed for MUI v5
const path = require('path');
const toPath = (filePath) => path.join(process.cwd(), filePath);

module.exports = {
  stories: [
    '../packages/**/*.stories.mdx',
    '../packages/**/*.stories.@(ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
  ],
  typescript: {
    check: false,
    reactDocgen: false,
  },
  // note: this is needed for MUI v5
  webpackFinal: async (config) => {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          '@emotion/core': toPath('node_modules/@emotion/react'),
          'emotion-theming': toPath('node_modules/@emotion/react'),
        },
      },
    };
  },
}
