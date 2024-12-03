export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.(t|j)s',
  ],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  coveragePathIgnorePatterns: [
    '\\.module\\.ts$',
    '\\.dto\\.ts$',
    '\\.repository\\.ts$',
    '\\.data-source\\.ts$',
    '\\.seed\\.ts$',
    '\\.swagger\\.ts$',
    '\\.model\\.ts$',
    '\\.provider\\.ts$',
    'src/api/config/',
    'src/bootstrap.ts',
    'src/main.ts',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
};
