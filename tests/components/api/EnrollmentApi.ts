import type { ApiResponse } from '@dts/test-kit';
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
  exam_grade: number | null
  created_at: string
}

export interface GradePayload {
  grade: number
}

export class EnrollmentApi extends ApiBase {
  @atc('DTS-CORE-4', { story: 'DTS-7', feature: 'Enrollments' })
  async enrollStudentSuccessfully(
    payload: EnrollmentPayload,
  ): Promise<ApiResponse<Enrollment>> {
    return this.post<Enrollment, EnrollmentPayload>('/enrollments', payload);
  }

  @atc('DTS-CORE-4', { story: 'DTS-7', feature: 'Enrollments' })
  async enrollDuplicate(
    payload: EnrollmentPayload,
  ): Promise<ApiResponse<{ message: string }>> {
    return this.post<{ message: string }, EnrollmentPayload>(
      '/enrollments',
      payload,
    );
  }

  @atc('DTS-EXAM-3', { story: 'DTS-4', feature: 'Exam Enrollment' })
  async enrollInExam(
    enrollmentId: string,
    examDate: string,
  ): Promise<ApiResponse<Enrollment>> {
    return this.patch<Enrollment, { exam_date: string }>(
      `/enrollments/${enrollmentId}`,
      { exam_date: examDate },
    );
  }

  @atc('DTS-EXAM-4', { story: 'DTS-4', feature: 'Exam Grading' })
  async recordGrade(
    enrollmentId: string,
    grade: number,
  ): Promise<ApiResponse<Enrollment>> {
    return this.put<Enrollment, GradePayload>(
      `/enrollments/${enrollmentId}/grade`,
      { grade },
    );
  }

  @atc('DTS-EXAM-5', { story: 'DTS-4', feature: 'Exam History' })
  async listExamHistory(studentId: string): Promise<ApiResponse<Enrollment[]>> {
    return this.get<Enrollment[]>(`/enrollments?student_id=${studentId}`);
  }
}
