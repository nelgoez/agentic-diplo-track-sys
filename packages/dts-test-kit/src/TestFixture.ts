import { TestContext } from './TestContext';

export interface FixtureOptions {
  baseUrl?: string
  apiUrl?: string
}

export function createFixture(opts?: FixtureOptions) {
  const ctx = new TestContext(opts);
  return {
    ctx,
  };
}
