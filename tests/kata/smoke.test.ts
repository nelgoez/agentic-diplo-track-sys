import { atc, createApiFixture, createFixture, getAtcMap, TestContext } from '@dts/test-kit';
import { describe, expect, it } from 'bun:test';

describe('KATA — TestContext', () => {
  it('creates context with default env', () => {
    const ctx = new TestContext();
    expect(ctx.env.baseUrl).toBeDefined();
    expect(ctx.env.apiUrl).toBeDefined();
    expect(ctx.env.isCI).toBe(Boolean(process.env.CI));
  });

  it('generates unique emails', () => {
    const ctx = new TestContext();
    const a = ctx.uniqueEmail();
    const b = ctx.uniqueEmail();
    expect(a).not.toBe(b);
    expect(a).toContain('@dts-test.unc.edu.ar');
  });

  it('accepts overrides', () => {
    const ctx = new TestContext({ baseUrl: 'https://example.com', isCI: true });
    expect(ctx.env.baseUrl).toBe('https://example.com');
    expect(ctx.env.isCI).toBe(true);
  });
});

describe('KATA — createFixture', () => {
  it('returns context from fixture', () => {
    const { ctx } = createFixture();
    expect(ctx).toBeInstanceOf(TestContext);
  });
});

describe('KATA — createApiFixture', () => {
  it('returns context and api instance', () => {
    const { ctx, api } = createApiFixture({ apiUrl: 'http://localhost:9999' });
    expect(ctx).toBeInstanceOf(TestContext);
    expect(api).toBeDefined();
  });

  it('sets auth token when provided', () => {
    const { api } = createApiFixture({ authToken: 'test-token' });
    expect(api).toBeDefined();
  });
});

describe('KATA — @atc decorator', () => {
  it('registers ATC in global map', () => {
    class TestComponent {
      @atc('TEST-001')
      doSomething() {
        return 42;
      }
    }
    const instance = new TestComponent();
    expect(instance.doSomething()).toBe(42);
    expect(getAtcMap().size).toBeGreaterThan(0);
  });
});
