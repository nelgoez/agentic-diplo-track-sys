import type { ApiResponse } from '@dts/test-kit';
import { ApiBase, atc } from '@dts/test-kit';

export interface Certificate {
  id: string
  student_id: string
  course_id: string
  course_name?: string
  issue_date: string
  status: string
  qualification: number | null
  is_valid: boolean
}

export class CertificateApi extends ApiBase {
  @atc('DTS-CORE-5')
  async listStudentCertificates(
    studentId: string,
  ): Promise<ApiResponse<Certificate[]>> {
    return this.get<Certificate[]>(`/students/${studentId}/certificates`);
  }

  @atc('DTS-CORE-5')
  async getCertificateById(
    certificateId: string,
  ): Promise<ApiResponse<Certificate>> {
    return this.get<Certificate>(`/certificates/${certificateId}`);
  }

  @atc('DTS-SYNC-2')
  async resyncCertificate(
    certificateId: string,
  ): Promise<ApiResponse<Certificate>> {
    return this.post<Certificate, void>(
      `/certificates/${certificateId}/resync`,
      undefined as unknown as void,
    );
  }
}
