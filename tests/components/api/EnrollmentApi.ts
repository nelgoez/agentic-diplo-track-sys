import { ApiBase, atc } from '@dts/test-kit';

export interface EnrollmentPayload {
  student_id: string
  track_id: string
  course_id?: string
  exam_date?: string
}

export interface Enrollment {
  id: string
  student_id: string
  track_id: string
  course_id: string | null
  status: string
  exam_status: string | null
  exam_date: string | null
  qualification: number | null
  created_at: string
}

export interface GradePayload {
  qualification: number
}

export interface ExamEnrollPayload {
  exam_date: string
}

export class EnrollmentApi extends ApiBase {
  @atc('DTS-CORE-4', { story: 'DTS-7', feature: 'Enrollments' })
  async enrollStudentSuccessfully(
    payload: EnrollmentPayload,
  ): Promise<[Response, Enrollment, EnrollmentPayload]> {
    return this.post<Enrollment, EnrollmentPayload>('/enrollments', payload);
  }

  @atc('DTS-CORE-4', { story: 'DTS-7', feature: 'Enrollments' })
  async enrollDuplicate(
    payload: EnrollmentPayload,
  ): Promise<[Response, { message: string }, EnrollmentPayload]> {
    return this.post<{ message: string }, EnrollmentPayload>(
      '/enrollments',
      payload,
    );
  }

  @atc('DTS-EXAM-3', { story: 'DTS-4', feature: 'Exam Enrollment' })
  async enrollInExam(
    enrollmentId: string,
    examDate: string,
  ): Promise<[Response, Enrollment, ExamEnrollPayload]> {
    return this.patch<Enrollment, ExamEnrollPayload>(
      `/enrollments/${enrollmentId}`,
      { exam_date: examDate },
    );
  }

  @atc('DTS-EXAM-4', { story: 'DTS-4', feature: 'Exam Grading' })
  async recordGrade(
    enrollmentId: string,
    qualification: number,
  ): Promise<[Response, Enrollment, GradePayload]> {
    return this.put<Enrollment, GradePayload>(
      `/enrollments/${enrollmentId}/grade`,
      { qualification },
    );
  }

  @atc('DTS-EXAM-5', { story: 'DTS-4', feature: 'Exam History' })
  async listExamHistory(studentId: string): Promise<[Response, Enrollment[]]> {
    return this.get<Enrollment[]>(`/enrollments?student_id=${studentId}`);
  }
}
