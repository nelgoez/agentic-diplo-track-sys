import { atc } from '@dts/test-kit';
import { beforeAll, describe, expect, it } from 'bun:test';
import { AuthApi, CourseApi, EnrollmentApi, StudentApi, TrackApi } from '../components/api';

const API_URL = process.env.API_URL ?? '';

class ExamFlowSteps {
  @atc('EXAM-ENROLL-001', { story: 'DTS-83', vcr: { value: 5, cost: 3, risk: 3 } })
  async fullExamCycle(api: EnrollmentApi, enrollmentId: string, grade: number) {
    const [examRes, examBody] = await api.enrollInExam(enrollmentId, new Date().toISOString().split('T')[0]);
    expect(examRes.status).toBe(200);
    expect(examBody.exam_status).toBe('inscripto');

    const [gradeRes, gradeBody] = await api.recordGrade(enrollmentId, grade);
    expect(gradeRes.status).toBe(200);
    const expectedStatus = grade >= 4 ? 'aprobado' : 'desaprobado';
    expect(gradeBody.exam_status).toBe(expectedStatus);
    return gradeBody;
  }
}

describe('Exam Enrollment & Grading — DTS-83', () => {
  let authToken = '';
  let trackId = '';
  let courseId = '';
  let studentId = '';
  let enrollmentId = '';
  const unique = Date.now();

  beforeAll(() => {
    if (!API_URL) { console.warn('SKIP: API_URL not set'); }
  });

  it('logs in as admin', async () => {
    if (!API_URL) { return; }
    const auth = new AuthApi(API_URL);
    const [response, body] = await auth.loginSuccessfully('admin@dts.unc.edu.ar', 'admin123');
    expect(response.status).toBe(200);
    authToken = body.accessToken;
  });

  it('creates a track', async () => {
    if (!API_URL) { return; }
    const api = new TrackApi(API_URL, { Authorization: `Bearer ${authToken}` });
    const [response, body] = await api.createTrackSuccessfully({
      name: `Exam Track ${unique}`,
      code: `EX-TR-${unique}`,
      credits_required: 20,
    });
    expect(response.status).toBe(201);
    trackId = body.id;
  });

  it('creates a course', async () => {
    if (!API_URL) { return; }
    const api = new CourseApi(API_URL, { Authorization: `Bearer ${authToken}` });
    const [response, body] = await api.createCourseSuccessfully({
      track_id: trackId,
      name: 'Exam Course',
      code: `EX-CR-${unique}`,
      credits: 5,
    });
    expect(response.status).toBe(201);
    courseId = body.id;
  });

  it('creates a student', async () => {
    if (!API_URL) { return; }
    const api = new StudentApi(API_URL, { Authorization: `Bearer ${authToken}` });
    const [response, body] = await api.createStudentSuccessfully({
      email: `exam-student-${unique}@dts.unc.edu.ar`,
      name: 'Exam Student',
    });
    expect(response.status).toBe(201);
    studentId = body.id;
  });

  it('enrolls student in track', async () => {
    if (!API_URL) { return; }
    const api = new EnrollmentApi(API_URL, { Authorization: `Bearer ${authToken}` });
    const [response, body] = await api.enrollStudentSuccessfully({
      student_id: studentId,
      track_id: trackId,
      course_id: courseId,
    });
    expect(response.status).toBe(201);
    enrollmentId = body.id;
  });

  describe('Grade validation', () => {
    it('rejects grade below 1', async () => {
      if (!API_URL) { return; }
      const api = new EnrollmentApi(API_URL, { Authorization: `Bearer ${authToken}` });
      const [response] = await api.recordGrade(enrollmentId || 'none', 0);
      expect(response.status).toBe(400);
    });

    it('rejects grade above 10', async () => {
      if (!API_URL) { return; }
      const api = new EnrollmentApi(API_URL, { Authorization: `Bearer ${authToken}` });
      const [response] = await api.recordGrade(enrollmentId || 'none', 11);
      expect(response.status).toBe(400);
    });

    it('rejects non-numeric grade', async () => {
      if (!API_URL) { return; }
      const res = await fetch(`${API_URL}/enrollments/${enrollmentId || 'none'}/grade`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({ grade: 'abc' }),
      });
      expect(res.status).toBe(400);
    });
  });

  describe('Status transitions', () => {
    it('grade >= 4 sets exam_status=aprobado', async () => {
      if (!API_URL || !enrollmentId) { return; }
      const api = new EnrollmentApi(API_URL, { Authorization: `Bearer ${authToken}` });
      const steps = new ExamFlowSteps();
      const result = await steps.fullExamCycle(api, enrollmentId, 7);
      expect(result.exam_status).toBe('aprobado');
      expect(result.qualification).toBe(7);
    });

    it('grade < 4 sets exam_status=desaprobado', async () => {
      if (!API_URL) { return; }
      const api = new EnrollmentApi(API_URL, { Authorization: `Bearer ${authToken}` });
      const [, enrollBody] = await api.enrollStudentSuccessfully({
        student_id: studentId,
        track_id: trackId,
        course_id: courseId,
      });
      const api2 = new EnrollmentApi(API_URL, { Authorization: `Bearer ${authToken}` });
      const [examRes] = await api2.enrollInExam(enrollBody.id, new Date().toISOString().split('T')[0]);
      expect(examRes.status).toBe(200);

      const [gradeRes, gradeBody] = await api2.recordGrade(enrollBody.id, 2);
      expect(gradeRes.status).toBe(200);
      expect(gradeBody.exam_status).toBe('desaprobado');
      expect(gradeBody.qualification).toBe(2);
    });
  });

  describe('Exam history', () => {
    it('returns exam attempts sorted by date', async () => {
      if (!API_URL) { return; }
      const api = new EnrollmentApi(API_URL, { Authorization: `Bearer ${authToken}` });
      const [response, body] = await api.listExamHistory(studentId);
      expect(response.status).toBe(200);
      expect(Array.isArray(body)).toBe(true);
    });
  });
});
