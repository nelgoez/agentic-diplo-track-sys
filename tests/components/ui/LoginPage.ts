import type { Page } from '@playwright/test';
import { atc, UiBase } from '@dts/test-kit';

export class LoginPage extends UiBase {
  private page: Page;

  constructor(page: Page, baseUrl: string) {
    super(baseUrl);
    this.page = page;
  }

  @atc('LOGIN-UI-001', { story: 'DTS-42', feature: 'Auth UI' })
  async goto(): Promise<void> {
    await this.page.goto(this.url('/login'));
  }

  @atc('LOGIN-UI-002', { story: 'DTS-42', feature: 'Auth UI' })
  async fillCredentials(email: string, password: string): Promise<void> {
    await this.page.getByRole('textbox', { name: /email|correo/i }).fill(email);
    await this.page.getByRole('textbox', { name: /password|contraseña/i }).fill(password);
  }

  @atc('LOGIN-UI-003', { story: 'DTS-42', feature: 'Auth UI' })
  async submit(): Promise<void> {
    await this.page.getByRole('button', { name: /login|sign in|iniciar/i }).click();
  }

  @atc('LOGIN-UI-004', { story: 'DTS-42', feature: 'Auth UI' })
  async login(email: string, password: string): Promise<void> {
    await this.goto();
    await this.fillCredentials(email, password);
    await this.submit();
  }
}
