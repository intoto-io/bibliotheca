module.exports = {
  globalSetup: './jest.setup.js',
  transformIgnorePatterns: [
    'node_modules/(?!@intoto-dev|d3-time-format)',
  ],
};
