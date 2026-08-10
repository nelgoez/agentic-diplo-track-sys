export class ApiBase {
  protected baseUrl: string;
  protected headers: Record<string, string>;

  constructor(baseUrl: string, defaultHeaders?: Record<string, string>) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.headers = {
      'Content-Type': 'application/json',
      ...defaultHeaders,
    };
  }

  setAuthToken(token: string): void {
    this.headers.Authorization = `Bearer ${token}`;
  }

  async get<TBody>(path: string): Promise<[Response, TBody]> {
    const res = await fetch(`${this.baseUrl}${path}`, { method: 'GET', headers: this.headers });
    const body = (await res.json().catch(() => undefined)) as TBody;
    return [res, body];
  }

  async post<TBody, TPayload = unknown>(path: string, payload: TPayload): Promise<[Response, TBody, TPayload]> {
    const res = await fetch(`${this.baseUrl}${path}`, { method: 'POST', headers: this.headers, body: JSON.stringify(payload) });
    const body = (await res.json().catch(() => undefined)) as TBody;
    return [res, body, payload];
  }

  async put<TBody, TPayload = unknown>(path: string, payload: TPayload): Promise<[Response, TBody, TPayload]> {
    const res = await fetch(`${this.baseUrl}${path}`, { method: 'PUT', headers: this.headers, body: JSON.stringify(payload) });
    const body = (await res.json().catch(() => undefined)) as TBody;
    return [res, body, payload];
  }

  async patch<TBody, TPayload = unknown>(path: string, payload: TPayload): Promise<[Response, TBody, TPayload]> {
    const res = await fetch(`${this.baseUrl}${path}`, { method: 'PATCH', headers: this.headers, body: JSON.stringify(payload) });
    const body = (await res.json().catch(() => undefined)) as TBody;
    return [res, body, payload];
  }

  async del<TBody>(path: string): Promise<[Response, TBody]> {
    const res = await fetch(`${this.baseUrl}${path}`, { method: 'DELETE', headers: this.headers });
    const body = (await res.json().catch(() => undefined)) as TBody;
    return [res, body];
  }
}
