// https://jestjs.io/docs/configuration#options
module.exports = {
  setupFilesAfterEnv: ['./test/setupTests.ts'],
  testEnvironment: './test/custom-jest-environment.js',
  forceExit: true // jest hangs if we don't have this
};
