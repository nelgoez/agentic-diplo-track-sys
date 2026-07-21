import { atc } from '@dts/test-kit';
import { beforeAll, describe, expect, it } from 'bun:test';
import { AdminApi, AuthApi, TrackApi } from '../components/api';

const API_URL = process.env.API_URL ?? '';

class AuthFlowSteps {
  @atc('AUTH-REFRESH-001', { story: 'DTS-81', vcr: { value: 5, cost: 2, risk: 3 } })
  async refreshTokenFlow(auth: AuthApi, refreshToken: string) {
    const res = await auth.refreshTokenSuccessfully(refreshToken);
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeTruthy();
    return res.body;
  }
}

describe('Auth Flow — DTS-81', () => {
  beforeAll(() => {
    if (!API_URL) { console.warn('SKIP: API_URL not set'); }
  });

  describe('Login', () => {
    it('valid credentials return tokens + user', async () => {
      if (!API_URL) { return; }
      const auth = new AuthApi(API_URL);
      const res = await auth.loginSuccessfully('admin@dts.unc.edu.ar', 'admin123');
      expect(res.status).toBe(200);
      expect(res.body.accessToken).toBeTruthy();
      expect(res.body.refreshToken).toBeTruthy();
    });

    it('invalid credentials return 401', async () => {
      if (!API_URL) { return; }
      const auth = new AuthApi(API_URL);
      const res = await auth.loginWithInvalidCredentials();
      expect(res.status).toBe(401);
    });

    it('wrong password for existing user returns 401', async () => {
      if (!API_URL) { return; }
      const auth = new AuthApi(API_URL);
      const res = await auth.loginSuccessfully('nahuelgomez.cti@gmail.com', 'WrongPass123!');
      expect(res.status).toBe(401);
    });
  });

  describe('Token refresh', () => {
    it('refresh token returns new token pair', async () => {
      if (!API_URL) { return; }
      const auth = new AuthApi(API_URL);
      const loginRes = await auth.loginSuccessfully('admin@dts.unc.edu.ar', 'admin123');
      const steps = new AuthFlowSteps();
      const refreshed = await steps.refreshTokenFlow(auth, loginRes.body.refreshToken);
      expect(refreshed.accessToken).not.toBe(loginRes.body.accessToken);
    });

    it('expired/revoked refresh token returns 401', async () => {
      if (!API_URL) { return; }
      const auth = new AuthApi(API_URL);
      const res = await auth.refreshTokenSuccessfully('invalid-refresh-token');
      expect(res.status).toBe(401);
    });
  });

  describe('Role-based access', () => {
    let studentToken = '';
    let adminToken = '';

    beforeAll(async () => {
      if (!API_URL) { return; }
      const auth = new AuthApi(API_URL);
      const adminRes = await auth.loginSuccessfully('admin@dts.unc.edu.ar', 'admin123');
      adminToken = adminRes.body.accessToken;

      const studentRes = await auth.loginSuccessfully('nahuelgomez.cti@gmail.com', 'Test123456!');
      studentToken = studentRes.body.accessToken;
    });

    it('admin can access admin dashboard', async () => {
      if (!API_URL) { return; }
      const api = new AdminApi(API_URL, { Authorization: `Bearer ${adminToken}` });
      const res = await api.getDashboardStats();
      expect(res.status).toBe(200);
    });

    it('student cannot access admin dashboard', async () => {
      if (!API_URL) { return; }
      const api = new AdminApi(API_URL, { Authorization: `Bearer ${studentToken}` });
      const res = await api.getDashboardStats();
      expect(res.status).toBe(403);
    });

    it('student can access own profile', async () => {
      if (!API_URL) { return; }
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${studentToken}` },
      });
      expect(res.status).toBe(200);
    });

    it('student cannot access admin track creation', async () => {
      if (!API_URL) { return; }
      const api = new TrackApi(API_URL, { Authorization: `Bearer ${studentToken}` });
      const res = await api.createTrackSuccessfully({
        name: 'Should Fail',
        code: 'FAIL-001',
        credits_required: 0,
      });
      expect(res.status).toBe(403);
    });
  });

  describe('Data isolation', () => {
    it('student gets own data from /auth/me', async () => {
      if (!API_URL) { return; }
      const auth = new AuthApi(API_URL);
      const res = await auth.loginSuccessfully('nahuelgomez.cti@gmail.com', 'Test123456!');
      const meRes = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${res.body.accessToken}` },
      });
      const body = await meRes.json() as { email: string };
      expect(body.email).toBe('nahuelgomez.cti@gmail.com');
    });
  });
});
