import { beforeAll, describe, expect, it } from 'bun:test';

const BASE_URL = process.env.BASE_URL ?? '';

describe('a11y — smoke', () => {
  beforeAll(() => {
    if (!BASE_URL) {
      console.warn('SKIP: BASE_URL not set');
    }
  });

  it('loads login page without crash', async () => {
    if (!BASE_URL) { return; }
    const resp = await fetch(`${BASE_URL}/login`);
    expect(resp.status).toBe(200);
  });
});
