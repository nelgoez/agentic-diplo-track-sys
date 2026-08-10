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
  ): Promise<[Response, Track, TrackPayload]> {
    return this.post<Track, TrackPayload>('/admin/tracks', payload);
  }

  @atc('DTS-CORE-1', { story: 'DTS-7', feature: 'Tracks' })
  async createTrackWithDuplicateCode(
    payload: TrackPayload,
  ): Promise<[Response, { message: string }, TrackPayload]> {
    return this.post<{ message: string }, TrackPayload>(
      '/admin/tracks',
      payload,
    );
  }

  @atc('DTS-CORE-1', { story: 'DTS-7', feature: 'Tracks' })
  async listTracks(): Promise<[Response, Track[]]> {
    return this.get<Track[]>('/admin/tracks');
  }

  @atc('DTS-CORE-1', { story: 'DTS-7', feature: 'Tracks' })
  async getTrackById(trackId: string): Promise<[Response, Track]> {
    return this.get<Track>(`/admin/tracks/${trackId}`);
  }

  @atc('DTS-CORE-1', { story: 'DTS-7', feature: 'Tracks' })
  async updateTrackName(
    trackId: string,
    name: string,
  ): Promise<[Response, Track, { name: string }]> {
    return this.patch<Track, { name: string }>(
      `/admin/tracks/${trackId}`,
      { name },
    );
  }
}
