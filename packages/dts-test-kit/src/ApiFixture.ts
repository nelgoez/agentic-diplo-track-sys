import { ApiBase } from './ApiBase';
import { TestContext } from './TestContext';

export function createApiFixture(opts?: { baseUrl?: string, apiUrl?: string, authToken?: string }) {
  const ctx = new TestContext(opts);
  const api = new ApiBase(ctx.env.apiUrl);
  if (opts?.authToken) {
    api.setAuthToken(opts.authToken);
  }
  return { ctx, api };
}
