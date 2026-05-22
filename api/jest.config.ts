import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '<rootDir>/coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@common$': '<rootDir>/common/index',
    '^@common/(.*)$': '<rootDir>/common/$1',
    '^@core$': '<rootDir>/core/index',
    '^@core/(.*)$': '<rootDir>/core/$1',
    '^@core/http': '<rootDir>/core/http/index',
    '^@module-config$': '<rootDir>/modules/bobtail-config/index',
    '^@module-api-client': '<rootDir>/modules/api-client/index',
    '^@module-aws': '<rootDir>/modules/aws/index',
    '^@module-brokers': '<rootDir>/modules/brokers/index',
    '^@module-cqrs': '<rootDir>/modules/cqrs/index',
    '^@module-clients': '<rootDir>/modules/clients/index',
    '^@module-filestack$': '<rootDir>/modules/filestack/index',
    '^@module-filestack/test$': '<rootDir>/modules/filestack/test/index',
    '^@module-segment': '<rootDir>/modules/segment/index',
    '^@module-database': '<rootDir>/modules/database/index',
    '^@module-documents': '<rootDir>/modules/documents/index',
    '^@module-documents/data': '<rootDir>/modules/documents/data/index',
    '^@module-documents-request': '<rootDir>/modules/documents-request/index',
    '^@module-documents-request/data':
      '<rootDir>/modules/documents-request/data/index',
    '^@module-persistence$': '<rootDir>/modules/persistence/index',
    '^@module-persistence/entities$':
      '<rootDir>/modules/persistence/entities/index',
    '^@module-persistence/repositories$':
      '<rootDir>/modules/persistence/repositories/index',
    '^@module-persistence/test$': '<rootDir>/modules/persistence/test/index',
    '^@module-peruse': '<rootDir>/modules/peruse/index',
    '^@module-twilio': '<rootDir>/modules/twilio/index',
    '^@module-auth$': '<rootDir>/modules/auth/index',
    '^@module-loads$': '<rootDir>/modules/load/index',
    '^@module-tag-definitions$': '<rootDir>/modules/tag-definitions/index',
    '^@module-tag-definitions/test$':
      '<rootDir>/modules/tag-definitions/test/index',
  },
};

export default config;
