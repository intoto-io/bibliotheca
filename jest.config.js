module.exports = {
  globalSetup: './jest.setup.js',
  testEnvironment: 'jsdom',
  transformIgnorePatterns: [
    'node_modules/(?!@intoto-dev|d3-time-format)',
  ],
};
