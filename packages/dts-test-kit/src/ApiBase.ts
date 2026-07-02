export interface ApiResponse<TBody = unknown> {
  status: number
  body: TBody
  headers: Headers
}

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

  async get<TBody>(path: string): Promise<ApiResponse<TBody>> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'GET',
      headers: this.headers,
    });
    return {
      status: res.status,
      body: (await res.json().catch(() => undefined)) as TBody,
      headers: res.headers,
    };
  }

  async post<TBody, TPayload = unknown>(
    path: string,
    payload: TPayload,
  ): Promise<ApiResponse<TBody>> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(payload),
    });
    return {
      status: res.status,
      body: (await res.json().catch(() => undefined)) as TBody,
      headers: res.headers,
    };
  }

  async put<TBody, TPayload = unknown>(
    path: string,
    payload: TPayload,
  ): Promise<ApiResponse<TBody>> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify(payload),
    });
    return {
      status: res.status,
      body: (await res.json().catch(() => undefined)) as TBody,
      headers: res.headers,
    };
  }

  async patch<TBody, TPayload = unknown>(
    path: string,
    payload: TPayload,
  ): Promise<ApiResponse<TBody>> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(payload),
    });
    return {
      status: res.status,
      body: (await res.json().catch(() => undefined)) as TBody,
      headers: res.headers,
    };
  }

  async del<TBody>(path: string): Promise<ApiResponse<TBody>> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'DELETE',
      headers: this.headers,
    });
    return {
      status: res.status,
      body: (await res.json().catch(() => undefined)) as TBody,
      headers: res.headers,
    };
  }
}
