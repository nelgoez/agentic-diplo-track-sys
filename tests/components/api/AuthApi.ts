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
  ): Promise<[Response, AuthTokens, LoginPayload]> {
    return this.post<AuthTokens, LoginPayload>('/auth/login', {
      email,
      password,
    });
  }

  @atc('DTS-AUTH-2', { story: 'DTS-1', feature: 'Auth & Certificates' })
  async loginWithInvalidCredentials(): Promise<[Response, { message: string }, LoginPayload]> {
    return this.post<{ message: string }, LoginPayload>(
      '/auth/login',
      { email: 'invalid@test.com', password: 'wrong' },
    );
  }

  @atc('DTS-AUTH-2', { story: 'DTS-1', feature: 'Auth & Certificates' })
  async refreshTokenSuccessfully(
    refreshToken: string,
  ): Promise<[Response, AuthTokens, { refreshToken: string }]> {
    return this.post<AuthTokens, { refreshToken: string }>(
      '/auth/refresh',
      { refreshToken },
    );
  }
}
