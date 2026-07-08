# Session — Allure GH Pages Deployment (2026-07-07/08)

## Goal
Make DTS Allure reports publicly accessible via GitHub Pages (like bunkai).

## What was done

### Fixes applied to `nelgoez/diploma-tracking-sys`

| # | Issue | Root cause | Fix | Commit |
|---|-------|-----------|-----|--------|
| 1 | Build error `LoginPage.tsx:56` | `api.post` needs 3 args (path, body, token) | Changed to `api.postPublic` (2 args, no auth needed for demo) | `5796583` |
| 2 | Root index `ENOENT` in allure-report job | Job only checked out `gh-pages` branch into subfolder, never `main`. `gh-pages-root/` didn't exist | Generate `_root/index.html` inline in workflow step instead of reading from repo | `5796583` |
| 3 | `peaceiris/actions-gh-pages` 403 | `GITHUB_TOKEN` defaults to `contents: read` in new repos | Added `permissions: contents: write` to `allure-report` job | `32cd044` |
| 4 | GH Pages 404 at root | Created with `build_type: workflow` (GitHub Actions mode) but `peaceiris/actions-gh-pages` pushes to branch | Changed to `build_type: legacy` with source `gh-pages /` via API | API call |
| 5 | `production/smoke/` 404 | `playwright.prod.config.ts` had no Allure reporter. `ALLURE_DIR` env var was silently ignored | Added hardcoded `['allure-playwright', { resultsDir: 'allure-results-prod' }]` to prod config | `49a5b42` → `2cb1d73` |
| 6 | `outputFolder` silently ignored | `allure-playwright` v3+ renamed `outputFolder` → `resultsDir`. Old property falls back to default `allure-results` dir | Changed to `resultsDir` in both prod and main configs | `2cb1d73` |

### Key research findings

**`allure-playwright` v3 breaking change**: Property `outputFolder` was renamed to `resultsDir`. The old name is silently ignored — reporter always writes to default `allure-results/` regardless of what you pass. [GitHub issue #1118](https://github.com/allure-framework/allure-js/issues/1118)

**GH Pages modes**:
- `build_type: workflow` = GitHub Actions creates deployment artifacts. NOT compatible with `peaceiris/actions-gh-pages` branch-push approach.
- `build_type: legacy` = Deploy from branch (traditional). Source picks `gh-pages /` or `main /docs`.
- Use API: `gh api repos/:owner/:repo/pages -X PUT -f build_type="legacy" -f source="gh-pages"`

**`GITHUB_TOKEN` permissions**: New repos (~2024+) default to `contents: read`. Need explicit `permissions: contents: write` on any job that pushes to gh-pages branch.

### Current URLs
- Root: `https://nelgoez.github.io/diploma-tracking-sys/`
- Staging smoke: `https://nelgoez.github.io/diploma-tracking-sys/staging/smoke/`
- Production smoke: `https://nelgoez.github.io/diploma-tracking-sys/production/smoke/` (should work after fix #6 run completes)

### Workers in DTS
6 workflows — see `project-audit-2026-07-07.md §1`.
