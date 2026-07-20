import { atc } from '@dts/test-kit';
import { beforeAll, describe, expect, it } from 'bun:test';
import { AuthApi, CertificateApi, CourseApi, EnrollmentApi, StudentApi, TrackApi } from '../components/api';

const API_URL = process.env.API_URL ?? '';

class StudentFlowSteps {
  @atc('STUDENT-FLOW-001', { story: 'DTS-CORE-4', vcr: { value: 5, cost: 2, risk: 3 } })
  async enrollStudent(api: EnrollmentApi, studentId: string, trackId: string, courseId: string) {
    const res = await api.enrollStudentSuccessfully({
      student_id: studentId,
      track_id: trackId,
      course_id: courseId,
    });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeTruthy();
    return res.body.id;
  }
}

describe('Student Lifecycle', () => {
  let authToken = '';
  let trackId = '';
  let courseId = '';
  let studentId = '';
  let enrollmentId = '';

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

  it('creates a track', async () => {
    if (!API_URL) { return; }
    const api = new TrackApi(API_URL, { Authorization: `Bearer ${authToken}` });
    const res = await api.createTrackSuccessfully({
      name: `Test Track ${Date.now()}`,
      code: `TT-${Date.now()}`,
      credits_required: 20,
    });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeTruthy();
    trackId = res.body.id;
  });

  it('creates a course in the track', async () => {
    if (!API_URL) { return; }
    const api = new CourseApi(API_URL, { Authorization: `Bearer ${authToken}` });
    const res = await api.createCourseSuccessfully({
      track_id: trackId,
      name: 'Test Course',
      code: `TC-${Date.now()}`,
      credits: 4,
    });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeTruthy();
    courseId = res.body.id;
  });

  it('creates a student', async () => {
    if (!API_URL) { return; }
    const api = new StudentApi(API_URL, { Authorization: `Bearer ${authToken}` });
    const email = `student-${Date.now()}@dts.unc.edu.ar`;
    const res = await api.createStudentSuccessfully({
      email,
      name: 'Test Student',
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

  it('enrolls student in track', async () => {
    if (!API_URL) { return; }
    const api = new EnrollmentApi(API_URL, { Authorization: `Bearer ${authToken}` });
    const steps = new StudentFlowSteps();
    enrollmentId = await steps.enrollStudent(api, studentId, trackId, courseId);
  });

  it('lists student certificates', async () => {
    if (!API_URL) { return; }
    const api = new CertificateApi(API_URL, { Authorization: `Bearer ${authToken}` });
    const res = await api.listStudentCertificates(studentId);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('records exam grade', async () => {
    if (!API_URL) { return; }
    const api = new EnrollmentApi(API_URL, { Authorization: `Bearer ${authToken}` });
    const res = await api.recordGrade(enrollmentId, 8);
    expect(res.status).toBe(200);
    expect(res.body.exam_grade).toBe(8);
  });

  it('views exam history', async () => {
    if (!API_URL) { return; }
    const api = new EnrollmentApi(API_URL, { Authorization: `Bearer ${authToken}` });
    const res = await api.listExamHistory(studentId);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
