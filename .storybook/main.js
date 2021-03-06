module.exports = {
  stories: [
    '../packages/**/*.stories.mdx',
    '../packages/**/*.stories.@(ts|tsx)',
  ],
  addons: [
    '@storybook/addon-essentials',
  ],
  typescript: {
    check: false,
    reactDocgen: false,
  },
}
