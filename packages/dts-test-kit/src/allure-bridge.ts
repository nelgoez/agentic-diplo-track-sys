import { getAllAtcs } from './decorators';

const JIRA_BASE = process.env.JIRA_URL ?? 'https://diplo-track-sys.atlassian.net/browse';

export function linkAtcsToAllure(): void {
  const atcs = getAllAtcs();
  const all = globalThis as Record<string, unknown>;
  const allure = all.allure as Record<string, unknown> | undefined;
  if (!allure || typeof allure.tms !== 'function') { return; }

  for (const atc of atcs) {
    if (!atc.story) { continue; }
    try {
      const url = `${JIRA_BASE}/${atc.story}`;
      (allure.tms as (name: string, url: string) => void)(atc.story, url);
      const label = allure.label as ((name: string, value: string) => void) | undefined;
      if (label) {
        label('story', atc.story);
        if (atc.feature) { label('feature', atc.feature); }
        label('testId', atc.testId);
      }
    }
    catch {
      // Allure not available in this runner
    }
  }
}
