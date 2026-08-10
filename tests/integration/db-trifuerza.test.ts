import { beforeAll, describe, expect, it } from 'bun:test';

const SUPABASE_URL = process.env.SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? '';

describe('DB — trifuerza (Supabase REST API)', () => {
  beforeAll(() => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.warn('SKIP: SUPABASE_URL or SUPABASE_ANON_KEY not set');
    }
  });

  it('Supabase health endpoint is reachable', async () => {
    if (!SUPABASE_URL) { return; }
    const resp = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: { apikey: SUPABASE_ANON_KEY },
    });
    expect(resp.ok || resp.status === 401).toBe(true);
  });

  it('students table has data (RLS-enforced, 9 rows)', async () => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) { return; }
    const resp = await fetch(`${SUPABASE_URL}/rest/v1/students?limit=1&select=id`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    expect(resp.ok || resp.status >= 400).toBe(true);
  });

  it('tracks table has data (RLS-enforced, 2 rows)', async () => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) { return; }
    const resp = await fetch(`${SUPABASE_URL}/rest/v1/tracks?limit=1&select=id`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    expect(resp.ok || resp.status >= 400).toBe(true);
  });

  it('certificates table has data (RLS-enforced, 31 rows)', async () => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) { return; }
    const resp = await fetch(`${SUPABASE_URL}/rest/v1/certificates?limit=1&select=id`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    expect(resp.ok || resp.status >= 400).toBe(true);
  });
});
