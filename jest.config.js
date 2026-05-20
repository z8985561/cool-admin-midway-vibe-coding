module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/test/fixtures'],
  coveragePathIgnorePatterns: ['<rootDir>/test/'],
  setupFiles: ['<rootDir>/test/setup.ts'],
  maxWorkers: 1,
  testTimeout: 30000,
};
