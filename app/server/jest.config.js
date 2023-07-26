/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: [
    // "<rootDir>/test/setupFile.ts"
    ],
  globalSetup: "./src/test/globalSetup.ts",
  globalTeardown: "./src/test/globalTeardown.ts",
};