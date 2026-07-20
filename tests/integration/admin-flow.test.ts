import { atc } from '@dts/test-kit';
import { beforeAll, describe, expect, it } from 'bun:test';
import { AdminApi, AuthApi, TrackApi } from '../components/api';

const API_URL = process.env.API_URL ?? '';

class AdminFlowSteps {
  @atc('ADMIN-DASHBOARD-001', { story: 'DTS-ADMIN-1', vcr: { value: 4, cost: 2, risk: 2 } })
  async getDashboardStats(api: AdminApi) {
    const res = await api.getDashboardStats();
    expect(res.status).toBe(200);
    expect(typeof res.body.totalStudents).toBe('number');
    expect(typeof res.body.activeTracks).toBe('number');
  }
}

describe('Admin Management', () => {
  let authToken = '';

  beforeAll(() => {
    if (!API_URL) {
      console.warn('SKIP: API_URL not set');
    }
  });

  it('logs in as admin', async () => {
    if (!API_URL) { return; }
    const auth = new AuthApi(API_URL);
    const res = await auth.loginSuccessfully('admin@dts.unc.edu.ar', 'admin123');
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeTruthy();
    authToken = res.body.accessToken;
  });

  it('rejects invalid credentials', async () => {
    if (!API_URL) { return; }
    const auth = new AuthApi(API_URL);
    const res = await auth.loginWithInvalidCredentials();
    expect(res.status).toBe(401);
  });

  it('returns dashboard stats', async () => {
    if (!API_URL) { return; }
    const api = new AdminApi(API_URL, { Authorization: `Bearer ${authToken}` });
    const steps = new AdminFlowSteps();
    await steps.getDashboardStats(api);
  });

  it('lists tracks', async () => {
    if (!API_URL) { return; }
    const api = new TrackApi(API_URL, { Authorization: `Bearer ${authToken}` });
    const res = await api.listTracks();
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('gets integration status', async () => {
    if (!API_URL) { return; }
    const api = new AdminApi(API_URL, { Authorization: `Bearer ${authToken}` });
    const res = await api.getIntegrationStatus();
    expect(res.status).toBe(200);
  });

  it('gets integration logs', async () => {
    if (!API_URL) { return; }
    const api = new AdminApi(API_URL, { Authorization: `Bearer ${authToken}` });
    const res = await api.getIntegrationLogs();
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
