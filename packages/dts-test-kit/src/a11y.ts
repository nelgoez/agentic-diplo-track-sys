import type { Page } from '@playwright/test';

export interface A11yViolation {
  id: string
  impact: string
  description: string
  help: string
  helpUrl: string
  nodes: Array<{ target: string, html: string }>
}

export interface A11yResult {
  violations: A11yViolation[]
  passes: number
  incomplete: number
}

export async function checkA11y(page: Page): Promise<A11yResult> {
  const axe = await import('@axe-core/playwright');
  const results = await new axe.AxeBuilder({ page }).analyze();
  return {
    violations: results.violations.map(v => ({
      id: v.id,
      impact: v.impact ?? 'unknown',
      description: v.description,
      help: v.help,
      helpUrl: v.helpUrl,
      nodes: v.nodes.map(n => ({
        target: n.target.join(', '),
        html: n.html,
      })),
    })),
    passes: results.passes.length,
    incomplete: results.incomplete.length,
  };
}

export function assertNoA11yViolations(result: A11yResult, context?: string): void {
  if (result.violations.length > 0) {
    const msg = [
      `a11y violations found${context ? ` in ${context}` : ''}:`,
      ...result.violations.map(v =>
        `  [${v.impact}] ${v.id}: ${v.description} (${v.helpUrl})`,
      ),
    ].join('\n');
    throw new Error(msg);
  }
}
