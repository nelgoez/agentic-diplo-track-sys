# Task 1: Wire post-deploy CI trigger for production-smoke tests

## Context

The project (Diploma Tracking System, DTS) already has:
- `tests/e2e/production-smoke.test.ts` — tests health endpoint + login page load
- `test:smoke:production` npm script: `ALLURE_DIR=allure-results-prod playwright test tests/e2e/production-smoke.test.ts`
- `planning-ci.yml` workflow runs on push to staging + PR to main
- Project is deployed via Vercel (production at `https://diplomatrackingsystem.qzz.io`, staging at Vercel preview)
- No post-deploy production smoke test workflow exists yet

## Requirements

Create `.github/workflows/production-smoke.yml` that:

1. **Triggers**: 
   - `workflow_dispatch` (manual trigger, always available)
   - `push` to `main` branch (automatic after production merge/deploy)
   - `schedule`: daily at 06:00 UTC (optional monitoring)

2. **Jobs**:
   - `production-smoke`:
     - `runs-on: ubuntu-latest`
     - `timeout-minutes: 5`
     - Steps:
       1. Checkout repo
       2. Setup Bun (latest)
       3. Install dependencies with `bun install`
       4. Run the production smoke tests against production URL:
          - `ALLURE_DIR=allure-results-prod BASE_URL=https://diplomatrackingsystem.qzz.io bunx playwright test tests/e2e/production-smoke.test.ts`
          - `continue-on-error: true`
       5. Generate Allure report: `bunx allure generate allure-results-prod --clean -o allure-report-prod`
       6. Upload Allure report artifact: `actions/upload-artifact@v4`
          - name: `allure-report-prod`
          - path: `allure-report-prod/`
       7. Deploy to GitHub Pages:
          - Uses `peaceiris/actions-gh-pages@v3`
          - `publish_dir: ./allure-report-prod`
          - `destination_dir: production`
          - `publish_branch: gh-pages`
          - `github_token: ${{ secrets.GITHUB_TOKEN }}`
          - `if: always()`
       8. Notify on failure: If smoke test fails, add a job summary with ❌ marker

3. **Environment variables**:
   - `BASE_URL: ${{ vars.BASE_URL || 'https://diplomatrackingsystem.qzz.io' }}`

4. **Permissions**:
   - `contents: write` (for GH Pages deploy)
   - `pages: write` (for GH Pages deploy)
   - `id-token: write` (for OIDC if needed)

## Files to create/modify

- CREATE: `.github/workflows/production-smoke.yml`

## Acceptance criteria

- Workflow file is valid YAML and installable by GitHub
- Production smoke tests run against production URL
- Allure report is generated and uploaded as artifact
- Report is deployed to GH Pages under `/production/` directory
- Failure triggers visible notification (job summary)
- Test can be manually triggered via GitHub UI
- Tests run automatically on push to main

## Constraints

- Must use existing npm scripts/test files — do NOT modify `production-smoke.test.ts`
- Use `bunx` for playwright and allure commands (not `bun run`)
- Use `actions/checkout@v4` and `oven-sh/setup-bun@v2`
- Keep the workflow file < 80 lines
- Do NOT add secrets to the workflow file — use `${{ secrets.GITHUB_TOKEN }}` for GH Pages

## Notes

The project already uses GH Pages for Allure reports (staging reports deploy to `nelgoez.github.io/diploma-tracking-sys/staging/smoke/`). Production reports should go to `/production/` subdirectory.
