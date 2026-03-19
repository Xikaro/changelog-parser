/** @type {import('jest').Config} */
export default {
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  coverageProvider: 'v8',
  coverageDirectory: 'build/coverage',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  testRunner: 'jest-circus/runner',
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      useESM: true
    }]
  },
  verbose: true,
  extensionsToTreatAsEsm: ['.ts']
};
