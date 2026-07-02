import type { ApiResponse } from '@dts/test-kit';
import { ApiBase, atc } from '@dts/test-kit';

export interface CoursePayload {
  track_id: string
  name: string
  code: string
  credits?: number
  order_index?: number
  is_integrator_exam?: boolean
}

export interface Course {
  id: string
  track_id: string
  name: string
  code: string
  credits: number
  order_index: number
  is_integrator_exam: boolean
  is_active: boolean
  created_at: string
}

export class CourseApi extends ApiBase {
  @atc('DTS-CORE-2')
  async createCourseSuccessfully(
    payload: CoursePayload,
  ): Promise<ApiResponse<Course>> {
    return this.post<Course, CoursePayload>('/admin/courses', payload);
  }

  @atc('DTS-CORE-2')
  async listCoursesByTrack(trackId: string): Promise<ApiResponse<Course[]>> {
    return this.get<Course[]>(`/admin/tracks/${trackId}/courses`);
  }

  @atc('DTS-CORE-2')
  async getCourseById(courseId: string): Promise<ApiResponse<Course>> {
    return this.get<Course>(`/admin/courses/${courseId}`);
  }
}
