import { randomInt } from 'node:crypto';

export interface TestEnv {
  baseUrl: string
  apiUrl: string
  isCI: boolean
}

export class TestContext {
  env: TestEnv;

  constructor(overrides?: Partial<TestEnv>) {
    this.env = {
      baseUrl: process.env.BASE_URL ?? 'http://localhost:3000',
      apiUrl: process.env.API_URL ?? 'http://localhost:8080',
      isCI: Boolean(process.env.CI),
      ...overrides,
    };
  }

  uniqueEmail(prefix = 'test'): string {
    return `${prefix}+${randomInt(1_000_000)}@dts-test.unc.edu.ar`;
  }
}
