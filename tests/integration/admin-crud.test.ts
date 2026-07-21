import { atc } from '@dts/test-kit';
import { beforeAll, describe, expect, it } from 'bun:test';
import { AuthApi, CourseApi, StudentApi, TrackApi } from '../components/api';

const API_URL = process.env.API_URL ?? '';

class AdminCrudSteps {
  @atc('ADMIN-TRACK-UPDATE-001', { story: 'DTS-84', vcr: { value: 4, cost: 2, risk: 2 } })
  async updateTrackName(trackApi: TrackApi, id: string, newName: string) {
    const res = await trackApi.updateTrackName(id, newName);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe(newName);
  }
}

describe('Admin CRUD — DTS-84', () => {
  let authToken = '';

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

  describe('Tracks CRUD', () => {
    let trackId = '';
    const unique = Date.now();

    it('creates a track', async () => {
      if (!API_URL) { return; }
      const api = new TrackApi(API_URL, { Authorization: `Bearer ${authToken}` });
      const res = await api.createTrackSuccessfully({
        name: `E2E Track ${unique}`,
        code: `E2E-TR-${unique}`,
        credits_required: 30,
      });
      expect(res.status).toBe(201);
      expect(res.body.id).toBeTruthy();
      trackId = res.body.id;
    });

    it('gets track by id', async () => {
      if (!API_URL || !trackId) { return; }
      const api = new TrackApi(API_URL, { Authorization: `Bearer ${authToken}` });
      const res = await api.getTrackById(trackId);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(trackId);
    });

    it('lists tracks', async () => {
      if (!API_URL) { return; }
      const api = new TrackApi(API_URL, { Authorization: `Bearer ${authToken}` });
      const res = await api.listTracks();
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('updates track name', async () => {
      if (!API_URL || !trackId) { return; }
      const api = new TrackApi(API_URL, { Authorization: `Bearer ${authToken}` });
      const steps = new AdminCrudSteps();
      await steps.updateTrackName(api, trackId, `E2E Track Updated ${unique}`);
    });

    it('rejects duplicate track code', async () => {
      if (!API_URL) { return; }
      const api = new TrackApi(API_URL, { Authorization: `Bearer ${authToken}` });
      const first = await api.createTrackSuccessfully({
        name: 'Original Track',
        code: 'DUP-CODE-001',
        credits_required: 10,
      });
      expect(first.status).toBe(201);
      const dup = await api.createTrackSuccessfully({
        name: 'Duplicate Track',
        code: 'DUP-CODE-001',
        credits_required: 10,
      });
      expect(dup.status).toBe(409);
    });
  });

  describe('Courses CRUD', () => {
    let trackId = '';
    let courseId = '';
    const unique = Date.now();

    beforeAll(async () => {
      if (!API_URL || !authToken) { return; }
      const api = new TrackApi(API_URL, { Authorization: `Bearer ${authToken}` });
      const trackRes = await api.createTrackSuccessfully({
        name: `E2E Course Parent ${unique}`,
        code: `E2E-CP-${unique}`,
        credits_required: 20,
      });
      trackId = trackRes.body.id;
    });

    it('creates a course in the track', async () => {
      if (!API_URL || !trackId) { return; }
      const api = new CourseApi(API_URL, { Authorization: `Bearer ${authToken}` });
      const res = await api.createCourseSuccessfully({
        track_id: trackId,
        name: `E2E Course ${unique}`,
        code: `E2E-CR-${unique}`,
        credits: 5,
      });
      expect(res.status).toBe(201);
      expect(res.body.id).toBeTruthy();
      courseId = res.body.id;
    });

    it('lists courses by track', async () => {
      if (!API_URL || !trackId) { return; }
      const api = new CourseApi(API_URL, { Authorization: `Bearer ${authToken}` });
      const res = await api.listCoursesByTrack(trackId);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('gets course by id', async () => {
      if (!API_URL || !courseId) { return; }
      const api = new CourseApi(API_URL, { Authorization: `Bearer ${authToken}` });
      const res = await api.getCourseById(courseId);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(courseId);
    });
  });

  describe('Students CRUD', () => {
    let studentId = '';
    const unique = Date.now();

    it('creates a student', async () => {
      if (!API_URL) { return; }
      const api = new StudentApi(API_URL, { Authorization: `Bearer ${authToken}` });
      const res = await api.createStudentSuccessfully({
        email: `e2e-student-${unique}@dts.unc.edu.ar`,
        name: 'E2E Student',
      });
      expect(res.status).toBe(201);
      expect(res.body.id).toBeTruthy();
      studentId = res.body.id;
    });

    it('lists students', async () => {
      if (!API_URL) { return; }
      const api = new StudentApi(API_URL, { Authorization: `Bearer ${authToken}` });
      const res = await api.listStudents();
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('gets student by id', async () => {
      if (!API_URL || !studentId) { return; }
      const api = new StudentApi(API_URL, { Authorization: `Bearer ${authToken}` });
      const res = await api.getStudentById(studentId);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(studentId);
    });

    it('searches students by email', async () => {
      if (!API_URL) { return; }
      const api = new StudentApi(API_URL, { Authorization: `Bearer ${authToken}` });
      const res = await api.searchStudents('dts.unc.edu.ar');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('rejects duplicate student email', async () => {
      if (!API_URL || !studentId) { return; }
      const api = new StudentApi(API_URL, { Authorization: `Bearer ${authToken}` });
      const res = await api.createStudentSuccessfully({
        email: `e2e-student-${unique}@dts.unc.edu.ar`,
        name: 'Duplicate Student',
      });
      expect(res.status).toBe(409);
    });
  });
});
