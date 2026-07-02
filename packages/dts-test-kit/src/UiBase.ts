export class UiBase {
  protected baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  url(path: string): string {
    return `${this.baseUrl}${path}`;
  }
}
