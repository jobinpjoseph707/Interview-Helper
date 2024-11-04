module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  globalSetup: 'jest-preset-angular/global-setup',
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/app/$1'
  },
  testEnvironment: 'jsdom'
};
