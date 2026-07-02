import { TestContext } from '@dts/test-kit';
import { describe, expect, it } from 'bun:test';

describe('@dts/test-kit', () => {
  it('exports TestContext', () => {
    expect(TestContext).toBeFunction();
  });

  it('loads without error', () => {
    const ctx = new TestContext();
    expect(ctx.env.baseUrl).toBeTruthy();
  });
});
