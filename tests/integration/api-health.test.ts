import { createApiFixture } from '@dts/test-kit';
import { beforeAll, describe, expect, it } from 'bun:test';

const API_URL = process.env.API_URL ?? '';

describe('API — health', () => {
  const { api } = createApiFixture({ apiUrl: API_URL });

  beforeAll(() => {
    if (!API_URL) {
      console.warn('SKIP: API_URL not set');
    }
  });

  it('returns 200 on health endpoint', async () => {
    if (!API_URL) { return; }
    const { status } = await api.get('/health');
    expect(status).toBe(200);
  });
});

describe('API — auth', () => {
  const { api } = createApiFixture({ apiUrl: API_URL });

  it('rejects unauthenticated requests', async () => {
    if (!API_URL) { return; }
    const { status } = await api.get('/api/protected');
    expect(status).toBe(401);
  });
});
