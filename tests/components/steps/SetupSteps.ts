import { AuthApi, CourseApi, EnrollmentApi, StudentApi, TrackApi } from '../api';

export interface SetupResult {
  authToken: string
  trackId: string
  courseId: string
  studentId: string
  enrollmentId: string
}

export class SetupSteps {
  static async fullSetup(
    apiUrl: string,
    opts?: { trackName?: string, courseName?: string, studentEmail?: string },
  ): Promise<SetupResult> {
    const unique = Date.now();
    const auth = new AuthApi(apiUrl);
    const [, tokens] = await auth.loginSuccessfully('admin@dts.unc.edu.ar', 'admin123');
    const authToken = tokens.accessToken;
    const headers = { Authorization: `Bearer ${authToken}` };

    const trackApi = new TrackApi(apiUrl, headers);
    const [, track] = await trackApi.createTrackSuccessfully({
      name: opts?.trackName ?? `Setup Track ${unique}`,
      code: `ST-TR-${unique}`,
      credits_required: 20,
    });

    const courseApi = new CourseApi(apiUrl, headers);
    const [, course] = await courseApi.createCourseSuccessfully({
      track_id: track.id,
      name: opts?.courseName ?? 'Setup Course',
      code: `ST-CR-${unique}`,
      credits: 5,
    });

    const studentApi = new StudentApi(apiUrl, headers);
    const [, student] = await studentApi.createStudentSuccessfully({
      email: opts?.studentEmail ?? `setup-student-${unique}@dts.unc.edu.ar`,
      name: 'Setup Student',
    });

    const enrollmentApi = new EnrollmentApi(apiUrl, headers);
    const [, enrollment] = await enrollmentApi.enrollStudentSuccessfully({
      student_id: student.id,
      track_id: track.id,
      course_id: course.id,
    });

    return {
      authToken,
      trackId: track.id,
      courseId: course.id,
      studentId: student.id,
      enrollmentId: enrollment.id,
    };
  }

  static async loginAsAdmin(
    apiUrl: string,
  ): Promise<{ authToken: string, auth: AuthApi }> {
    const auth = new AuthApi(apiUrl);
    const [, tokens] = await auth.loginSuccessfully('admin@dts.unc.edu.ar', 'admin123');
    return { authToken: tokens.accessToken, auth };
  }
}
