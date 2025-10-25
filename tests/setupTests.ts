// Jest setup file for backend tests
// This file is executed before each test suite

// Mock console methods to reduce noise in test output
global.console = {
  ...console,
  // Uncomment to ignore specific console methods during tests
  // log: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.DATABASE_URL = 'sqlite::memory:';

// Global test setup
global.beforeEach(() => {
  jest.clearAllMocks();
});

global.afterEach(() => {
  jest.restoreAllMocks();
});