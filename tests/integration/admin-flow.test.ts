import { atc } from '@dts/test-kit';
import { beforeAll, describe, expect, it } from 'bun:test';
import { AdminApi, AuthApi, TrackApi } from '../components/api';

const API_URL = process.env.API_URL ?? '';

class AdminFlowSteps {
  @atc('ADMIN-DASHBOARD-001', { story: 'DTS-ADMIN-1', vcr: { value: 4, cost: 2, risk: 2 } })
  async getDashboardStats(api: AdminApi) {
    const [response, body] = await api.getDashboardStats();
    expect(response.status).toBe(200);
    expect(typeof body.totalStudents).toBe('number');
    expect(typeof body.activeTracks).toBe('number');
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
    const [response, body] = await auth.loginSuccessfully('admin@dts.unc.edu.ar', 'admin123');
    expect(response.status).toBe(200);
    expect(body.accessToken).toBeTruthy();
    authToken = body.accessToken;
  });

  it('rejects invalid credentials', async () => {
    if (!API_URL) { return; }
    const auth = new AuthApi(API_URL);
    const [response] = await auth.loginWithInvalidCredentials();
    expect(response.status).toBe(401);
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
    const [response, body] = await api.listTracks();
    expect(response.status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
  });

  it('gets integration status', async () => {
    if (!API_URL) { return; }
    const api = new AdminApi(API_URL, { Authorization: `Bearer ${authToken}` });
    const [response] = await api.getIntegrationStatus();
    expect(response.status).toBe(200);
  });

  it('gets integration logs', async () => {
    if (!API_URL) { return; }
    const api = new AdminApi(API_URL, { Authorization: `Bearer ${authToken}` });
    const [response, body] = await api.getIntegrationLogs();
    expect(response.status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
  });
});
