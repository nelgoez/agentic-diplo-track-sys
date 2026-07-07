import type { ApiResponse } from '@dts/test-kit';
import { ApiBase, atc } from '@dts/test-kit';

export interface TrackPayload {
  name: string
  code: string
  description?: string
  credits_required?: number
}

export interface Track {
  id: string
  name: string
  code: string
  description: string | null
  credits_required: number
  is_active: boolean
  created_at: string
}

export class TrackApi extends ApiBase {
  @atc('DTS-CORE-1', { story: 'DTS-7', feature: 'Tracks' })
  async createTrackSuccessfully(
    payload: TrackPayload,
  ): Promise<ApiResponse<Track>> {
    return this.post<Track, TrackPayload>('/admin/tracks', payload);
  }

  @atc('DTS-CORE-1', { story: 'DTS-7', feature: 'Tracks' })
  async createTrackWithDuplicateCode(
    payload: TrackPayload,
  ): Promise<ApiResponse<{ message: string }>> {
    return this.post<{ message: string }, TrackPayload>(
      '/admin/tracks',
      payload,
    );
  }

  @atc('DTS-CORE-1', { story: 'DTS-7', feature: 'Tracks' })
  async listTracks(): Promise<ApiResponse<Track[]>> {
    return this.get<Track[]>('/admin/tracks');
  }

  @atc('DTS-CORE-1', { story: 'DTS-7', feature: 'Tracks' })
  async getTrackById(trackId: string): Promise<ApiResponse<Track>> {
    return this.get<Track>(`/admin/tracks/${trackId}`);
  }

  @atc('DTS-CORE-1', { story: 'DTS-7', feature: 'Tracks' })
  async updateTrackName(
    trackId: string,
    name: string,
  ): Promise<ApiResponse<Track>> {
    return this.patch<Track, { name: string }>(
      `/admin/tracks/${trackId}`,
      { name },
    );
  }
}
