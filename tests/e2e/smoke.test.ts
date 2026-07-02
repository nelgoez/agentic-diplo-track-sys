import { UiBase } from '@dts/test-kit';
import { beforeAll, describe, expect, it } from 'bun:test';

const BASE_URL = process.env.BASE_URL ?? '';

describe('E2E — smoke', () => {
  const ui = new UiBase(BASE_URL);

  beforeAll(() => {
    if (!BASE_URL) {
      console.warn('SKIP: BASE_URL not set');
    }
  });

  it('builds correct URLs', () => {
    if (!BASE_URL) { return; }
    expect(ui.url('/login')).toBe(`${BASE_URL}/login`);
  });
});
