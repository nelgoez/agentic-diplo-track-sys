import type { ApiResponse } from '@dts/test-kit';
import { ApiBase, atc } from '@dts/test-kit';

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export class AuthApi extends ApiBase {
  @atc('DTS-AUTH-2', { story: 'DTS-1', feature: 'Auth & Certificates' })
  async loginSuccessfully(
    email: string,
    password: string,
  ): Promise<ApiResponse<AuthTokens>> {
    const res = await this.post<AuthTokens, LoginPayload>('/auth/login', {
      email,
      password,
    });
    return res;
  }

  @atc('DTS-AUTH-2', { story: 'DTS-1', feature: 'Auth & Certificates' })
  async loginWithInvalidCredentials(): Promise<ApiResponse<{ message: string }>> {
    const res = await this.post<{ message: string }, LoginPayload>(
      '/auth/login',
      { email: 'invalid@test.com', password: 'wrong' },
    );
    return res;
  }

  @atc('DTS-AUTH-2', { story: 'DTS-1', feature: 'Auth & Certificates' })
  async refreshTokenSuccessfully(
    refreshToken: string,
  ): Promise<ApiResponse<AuthTokens>> {
    const res = await this.post<AuthTokens, { refreshToken: string }>(
      '/auth/refresh',
      { refreshToken },
    );
    return res;
  }
}
