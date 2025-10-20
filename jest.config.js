/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  transformIgnorePatterns: ['node_modules/(?!(@faker-js/faker|next-intl)/)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^contentlayer/generated$': '<rootDir>/src/test/utils/mocks.ts',
    '^next-intl/server$': '<rootDir>/src/test/utils/mocks.ts',
    '^lucide-react$': '<rootDir>/src/test/__mocks__/lucide-react.tsx',
    '^@/components/ui/dynamic-icons$':
      '<rootDir>/src/test/__mocks__/@/components/ui/dynamic-icons.tsx',
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.(test|spec).{js,jsx,ts,tsx}',
  ],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/test/**',
    '!src/**/__tests__/**',
  ],
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  clearMocks: true,
  verbose: true,
};

module.exports = config;
