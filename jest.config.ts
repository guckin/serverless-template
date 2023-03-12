import type {Config} from 'jest';

const config: Config = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.(js)$': 'babel-jest',
  },
  testEnvironment: 'node',
  clearMocks: true
};

export default config;
