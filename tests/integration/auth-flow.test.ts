import { atc } from '@dts/test-kit';
import { beforeAll, describe, expect, it } from 'bun:test';
import { AdminApi, AuthApi, TrackApi } from '../components/api';

const API_URL = process.env.API_URL ?? '';

class AuthFlowSteps {
  @atc('AUTH-REFRESH-001', { story: 'DTS-81', vcr: { value: 5, cost: 2, risk: 3 } })
  async refreshTokenFlow(auth: AuthApi, refreshToken: string) {
    const [response, body] = await auth.refreshTokenSuccessfully(refreshToken);
    expect(response.status).toBe(200);
    expect(body.accessToken).toBeTruthy();
    return body;
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
      const [response, body] = await auth.loginSuccessfully('admin@dts.unc.edu.ar', 'admin123');
      expect(response.status).toBe(200);
      expect(body.accessToken).toBeTruthy();
      expect(body.refreshToken).toBeTruthy();
    });

    it('invalid credentials return 401', async () => {
      if (!API_URL) { return; }
      const auth = new AuthApi(API_URL);
      const [response] = await auth.loginWithInvalidCredentials();
      expect(response.status).toBe(401);
    });

    it('wrong password for existing user returns 401', async () => {
      if (!API_URL) { return; }
      const auth = new AuthApi(API_URL);
      const [response] = await auth.loginSuccessfully('nahuelgomez.cti@gmail.com', 'WrongPass123!');
      expect(response.status).toBe(401);
    });
  });

  describe('Token refresh', () => {
    it('refresh token returns new token pair', async () => {
      if (!API_URL) { return; }
      const auth = new AuthApi(API_URL);
      const [, loginBody] = await auth.loginSuccessfully('admin@dts.unc.edu.ar', 'admin123');
      const steps = new AuthFlowSteps();
      const refreshed = await steps.refreshTokenFlow(auth, loginBody.refreshToken);
      expect(refreshed.accessToken).not.toBe(loginBody.accessToken);
    });

    it('expired/revoked refresh token returns 401', async () => {
      if (!API_URL) { return; }
      const auth = new AuthApi(API_URL);
      const [response] = await auth.refreshTokenSuccessfully('invalid-refresh-token');
      expect(response.status).toBe(401);
    });
  });

  describe('Role-based access', () => {
    let studentToken = '';
    let adminToken = '';

    beforeAll(async () => {
      if (!API_URL) { return; }
      const auth = new AuthApi(API_URL);
      const [, adminBody] = await auth.loginSuccessfully('admin@dts.unc.edu.ar', 'admin123');
      adminToken = adminBody.accessToken;

      const [, studentBody] = await auth.loginSuccessfully('nahuelgomez.cti@gmail.com', 'Test123456!');
      studentToken = studentBody.accessToken;
    });

    it('admin can access admin dashboard', async () => {
      if (!API_URL) { return; }
      const api = new AdminApi(API_URL, { Authorization: `Bearer ${adminToken}` });
      const [response] = await api.getDashboardStats();
      expect(response.status).toBe(200);
    });

    it('student cannot access admin dashboard', async () => {
      if (!API_URL) { return; }
      const api = new AdminApi(API_URL, { Authorization: `Bearer ${studentToken}` });
      const [response] = await api.getDashboardStats();
      expect(response.status).toBe(403);
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
      const [response] = await api.createTrackSuccessfully({
        name: 'Should Fail',
        code: 'FAIL-001',
        credits_required: 0,
      });
      expect(response.status).toBe(403);
    });
  });

  describe('Data isolation', () => {
    it('student gets own data from /auth/me', async () => {
      if (!API_URL) { return; }
      const auth = new AuthApi(API_URL);
      const [, body] = await auth.loginSuccessfully('nahuelgomez.cti@gmail.com', 'Test123456!');
      const meRes = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${body.accessToken}` },
      });
      const meBody = await meRes.json() as { email: string };
      expect(meBody.email).toBe('nahuelgomez.cti@gmail.com');
    });
  });
});
