import type { ApiResponse } from '@dts/test-kit';
import { ApiBase, atc } from '@dts/test-kit';

export interface StudentPayload {
  email: string
  name: string
  dni?: string
}

export interface Student {
  id: string
  email: string
  name: string
  dni: string | null
  role: string
  is_active: boolean
  created_at: string
}

export class StudentApi extends ApiBase {
  @atc('DTS-CORE-3', { story: 'DTS-2', feature: 'Students' })
  async createStudentSuccessfully(
    payload: StudentPayload,
  ): Promise<ApiResponse<Student>> {
    return this.post<Student, StudentPayload>('/admin/students', payload);
  }

  @atc('DTS-CORE-3', { story: 'DTS-2', feature: 'Students' })
  async listStudents(): Promise<ApiResponse<Student[]>> {
    return this.get<Student[]>('/admin/students');
  }

  @atc('DTS-CORE-3', { story: 'DTS-2', feature: 'Students' })
  async getStudentById(studentId: string): Promise<ApiResponse<Student>> {
    return this.get<Student>(`/admin/students/${studentId}`);
  }

  @atc('DTS-CORE-3', { story: 'DTS-2', feature: 'Students' })
  async searchStudents(query: string): Promise<ApiResponse<Student[]>> {
    return this.get<Student[]>(`/admin/students?search=${query}`);
  }
}
