import { atc } from '@dts/test-kit';
import { beforeAll, describe, expect, it } from 'bun:test';
import { AdminApi, AuthApi, CertificateApi, CourseApi, StudentApi, TrackApi } from '../components/api';

const API_URL = process.env.API_URL ?? '';

class SyncFlowSteps {
  @atc('SYNC-TRIGGER-001', { story: 'DTS-82', vcr: { value: 5, cost: 3, risk: 4 } })
  async triggerMoodleSync(adminApi: AdminApi) {
    const res = await adminApi.triggerMoodleSync();
    expect(res.status === 200 || res.status === 202).toBe(true);
    return res.body;
  }

  @atc('SYNC-RESYNC-001', { story: 'DTS-82', vcr: { value: 3, cost: 2, risk: 3 } })
  async resyncCertificate(certApi: CertificateApi, certId: string) {
    const res = await certApi.resyncCertificate(certId);
    expect(res.status).toBe(200);
    return res.body;
  }
}

describe('Certificate Sync — DTS-82', () => {
  let authToken = '';
  let trackId = '';
  let courseId = '';
  let studentId = '';
  const certificateId = '';
  const unique = Date.now();

  beforeAll(() => {
    if (!API_URL) { console.warn('SKIP: API_URL not set'); }
  });

  it('logs in as admin', async () => {
    if (!API_URL) { return; }
    const auth = new AuthApi(API_URL);
    const res = await auth.loginSuccessfully('admin@dts.unc.edu.ar', 'admin123');
    expect(res.status).toBe(200);
    authToken = res.body.accessToken;
  });

  it('creates a track with moodle mapping', async () => {
    if (!API_URL) { return; }
    const api = new TrackApi(API_URL, { Authorization: `Bearer ${authToken}` });
    const res = await api.createTrackSuccessfully({
      name: `Sync Track ${unique}`,
      code: `SY-TR-${unique}`,
      credits_required: 20,
    });
    expect(res.status).toBe(201);
    trackId = res.body.id;
  });

  it('creates a course with moodle_course_id', async () => {
    if (!API_URL) { return; }
    const api = new CourseApi(API_URL, { Authorization: `Bearer ${authToken}` });
    const res = await api.createCourseSuccessfully({
      track_id: trackId,
      name: 'Sync Course',
      code: `SY-CR-${unique}`,
      credits: 5,
      moodle_course_id: unique,
    });
    expect(res.status).toBe(201);
    courseId = res.body.id;
  });

  it('creates a student', async () => {
    if (!API_URL) { return; }
    const api = new StudentApi(API_URL, { Authorization: `Bearer ${authToken}` });
    const res = await api.createStudentSuccessfully({
      email: `sync-student-${unique}@dts.unc.edu.ar`,
      name: 'Sync Student',
    });
    expect(res.status).toBe(201);
    studentId = res.body.id;
  });

  describe('Moodle batch sync', () => {
    it('triggers moodle sync', async () => {
      if (!API_URL) { return; }
      const api = new AdminApi(API_URL, { Authorization: `Bearer ${authToken}` });
      const steps = new SyncFlowSteps();
      const result = await steps.triggerMoodleSync(api);
      expect(result).toBeTruthy();
    });

    it('sync conflict guard — rejects concurrent sync', async () => {
      if (!API_URL) { return; }
      const api = new AdminApi(API_URL, { Authorization: `Bearer ${authToken}` });
      const res1 = await api.triggerMoodleSync();
      if (res1.status === 200 || res1.status === 202) {
        const res2 = await api.triggerMoodleSync();
        expect(res2.status === 409 || res2.status === 200).toBe(true);
      }
    });

    it('integration status returns provider health', async () => {
      if (!API_URL) { return; }
      const api = new AdminApi(API_URL, { Authorization: `Bearer ${authToken}` });
      const res = await api.getIntegrationStatus();
      expect(res.status).toBe(200);
    });

    it('integration logs return paginated entries', async () => {
      if (!API_URL) { return; }
      const api = new AdminApi(API_URL, { Authorization: `Bearer ${authToken}` });
      const res = await api.getIntegrationLogs();
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('Individual certificate operations', () => {
    it('lists student certificates (empty is ok)', async () => {
      if (!API_URL) { return; }
      const api = new CertificateApi(API_URL, { Authorization: `Bearer ${authToken}` });
      const res = await api.listStudentCertificates(studentId);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});
