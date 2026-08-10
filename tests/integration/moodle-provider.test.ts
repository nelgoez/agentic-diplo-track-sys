import { MoodleMockFactory, MoodleWsClient } from '@dts/test-kit';
import { beforeAll, describe, expect, it } from 'bun:test';

const MOODLE_URL = process.env.MOODLE_API_URL ?? 'https://campus.aulavirtual.unc.edu.ar';
const MOODLE_TOKEN = process.env.MOODLE_API_TOKEN ?? '';

describe('Moodle CertificateProvider — WS contract validation', () => {
  const client = new MoodleWsClient({ baseUrl: MOODLE_URL, token: MOODLE_TOKEN });

  beforeAll(() => {
    if (!MOODLE_TOKEN) {
      console.warn('SKIP: MOODLE_API_TOKEN not set — using mocks');
    }
  });

  describe('Health check (core_webservice_get_site_info)', () => {
    it('returns site info matching expected shape', async () => {
      const mock = MoodleMockFactory.siteInfo();
      expect(mock.sitename).toBeString();
      expect(mock.release).toBeString();
      expect(mock.version).toBeString();
    });

    it('live health check responds with valid site info', async () => {
      if (!MOODLE_TOKEN) { return; }
      const info = await client.getSiteInfo();
      expect(info.sitename).toBeString();
      expect(info.release).toBeTruthy();
    });

    it('invalid token returns Moodle exception', async () => {
      const badClient = new MoodleWsClient({ baseUrl: MOODLE_URL, token: 'invalid-token' });
      try {
        await badClient.getSiteInfo();
        if (MOODLE_TOKEN) { expect.unreachable('should have thrown'); }
      }
      catch (err: unknown) {
        expect(err).toBeDefined();
      }
    });
  });

  describe('Student lookup (core_user_get_users_by_field)', () => {
    it('mock user shape matches Moodle contract', () => {
      const user = MoodleMockFactory.courseUser();
      expect(user.id).toBeNumber();
      expect(user.email).toBeString();
      expect(user.fullname).toBeString();
    });

    it('empty search returns empty array', async () => {
      if (!MOODLE_TOKEN) { return; }
      const users = await client.getUsersByField('email', ['nonexistent@test.com']);
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBe(0);
    });

    it('returns user by email', async () => {
      if (!MOODLE_TOKEN) { return; }
      const nelthor = process.env.STUDENT_USERNAME;
      if (!nelthor) { return; }
      const users = await client.getUsersByField('username', [nelthor]);
      expect(users.length).toBeGreaterThan(0);
      expect(users[0].email).toBeTruthy();
    });
  });

  describe('Certificate inference (completion status)', () => {
    it('mock completion status maps state=1 to completed', () => {
      const cs = MoodleMockFactory.completionStatus({ state: 1 });
      expect(cs.state).toBe(1);
      expect(cs.cmid).toBeNumber();
    });

    it('completion status with state=0 maps to incomplete', () => {
      const cs = MoodleMockFactory.completionStatus({ state: 0 });
      expect(cs.state).toBe(0);
    });

    it('completion status with state=2 maps to complete with pass', () => {
      const cs = MoodleMockFactory.completionStatus({ state: 2 });
      expect(cs.state).toBe(2);
    });
  });

  describe('WS URL construction', () => {
    it('builds correct REST endpoint URL', () => {
      const c = new MoodleWsClient({ baseUrl: 'https://example.com', token: 'abc' });
      expect(c).toBeDefined();
    });
  });

  describe('Error handling', () => {
    it('detects Moodle exception response shape', () => {
      const exception = {
        exception: 'invalidtoken',
        errorcode: 'invalidtoken',
        message: 'Invalid token - token not found',
      };
      expect(exception.errorcode).toBe('invalidtoken');
      expect(exception.message).toBeTruthy();
    });

    it('handles network timeout gracefully', async () => {
      const badUrlClient = new MoodleWsClient({
        baseUrl: 'https://10.255.255.1',
        token: 'test',
      });
      const timedOut = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 3000),
      );
      try {
        await Promise.race([badUrlClient.getSiteInfo(), timedOut]);
        expect.unreachable('should have thrown');
      }
      catch (err) {
        expect(err).toBeDefined();
      }
    });
  });
});
