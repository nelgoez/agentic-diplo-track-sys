import { beforeAll, describe, expect, it } from 'bun:test';

const BASE_URL = process.env.BASE_URL ?? '';

describe('Production Smoke (IQL Step 11)', () => {
  beforeAll(() => {
    if (!BASE_URL) {
      console.warn('SKIP: BASE_URL not set');
    }
  });

  it('health endpoint returns ok', async () => {
    if (!BASE_URL) { return; }
    const resp = await fetch(`${BASE_URL}/api/health`);
    expect(resp.status).toBe(200);
    const body = await resp.json() as Record<string, unknown>;
    expect(body).toHaveProperty('status');
    expect(body.status).toBe('ok');
  });

  it('login page loads', async () => {
    if (!BASE_URL) { return; }
    const resp = await fetch(`${BASE_URL}/login`);
    expect(resp.status).toBe(200);
  });
});
