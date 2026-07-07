import type { ApiResponse } from '@dts/test-kit';
import { ApiBase, atc } from '@dts/test-kit';

export interface DashboardStats {
  totalStudents: number
  activeStudents: number
  activeTracks: number
  totalCertificates: number
  eligibleCount: number
  notEligibleCount: number
}

export interface SyncResponse {
  syncId: string
  summary: {
    processed: number
    new: number
    updated: number
    errors: number
  }
}

export class AdminApi extends ApiBase {
  @atc('DTS-ADMIN-1', { story: 'DTS-6', feature: 'Admin Dashboard' })
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return this.get<DashboardStats>('/admin/dashboard-stats');
  }

  @atc('DTS-ADMIN-2', { story: 'DTS-6', feature: 'Admin Dashboard' })
  async listStudentsWithFilters(
    params?: string,
  ): Promise<ApiResponse<unknown[]>> {
    return this.get<unknown[]>(`/admin/students${params ? `?${params}` : ''}`);
  }

  @atc('DTS-SYNC-1', { story: 'DTS-5', feature: 'Moodle Integration' })
  async triggerMoodleSync(): Promise<ApiResponse<SyncResponse>> {
    return this.post<SyncResponse, void>(
      '/integrations/sync/moodle',
      undefined as unknown as void,
    );
  }

  @atc('DTS-SYNC-3', { story: 'DTS-5', feature: 'Moodle Integration' })
  async getIntegrationStatus(): Promise<ApiResponse<unknown>> {
    return this.get<unknown>('/integrations/status');
  }

  @atc('DTS-SYNC-3', { story: 'DTS-5', feature: 'Moodle Integration' })
  async getIntegrationLogs(): Promise<ApiResponse<unknown[]>> {
    return this.get<unknown[]>('/integrations/logs');
  }
}
