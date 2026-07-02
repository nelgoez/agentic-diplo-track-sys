# PDF generation service — diploma renderer

**Jira Key:** [DTS-75](https://diplo-track-sys.atlassian.net/browse/DTS-75)
**Epic:** [DTS-57](https://diplo-track-sys.atlassian.net/browse/DTS-57) (Digital Diploma PDF Generation)
**Type:** Story
**Status:** Done
**Priority:** Medium
**Story Points:** -

---

## Overview

# PDF generation service — diploma renderer

> [!NOTE] ***Core of DTS-57.*** Depends on no other story.

## Objective

Build the server-side PDF generation service that renders diploma HTML templates into printable PDFs.

## Technical approach

Use Puppeteer (headless Chrome) to render an HTML template → PDF. Puppeteer is already commonly used and produces pixel-perfect PDFs.

## Service signature

```typescript
interface DiplomaPdfService {
  generateDiploma(params: {
    studentName: string;
    documentNumber: string;
    trackName: string;
    issueDate: Date;
    grade: number;
    referenceCode: string;
  }): Promise<Buffer>;

  getDiplomaPath(enrollmentId: string): Promise<string | null>;
}
```

## Implementation

```typescript
import puppeteer from 'puppeteer';
import { renderTemplate } from './templates/diploma-template';

export async function generateDiploma(params: DiplomaParams): Promise<Buffer> {
  const html = renderTemplate(params);
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
  });
  await browser.close();
  return pdf;
}
```

## Storage

- Store generated PDFs in Supabase Storage bucket `diplomas`
- Path: `diplomas/{enrollmentId}/diploma.pdf`
- Or store as bytea in a `diplomas` table for simplicity

## Dependencies

```bash
npm install puppeteer
```

Puppeteer ~300 MB with Chromium. Alternative: use Vercel's Edge-friendly approach with `@react-pdf/renderer` if bundle size matters.

## Acceptance Criteria

- [ ] `generateDiploma()` produces a valid PDF (opens in reader, correct size)
- [ ] PDF contains student name, track, date, grade, reference code
- [ ] PDF is A4 format with proper margins
- [ ] Error handling: invalid params throw typed errors
- [ ] File saved to storage or returned as download buffer

---

## Fields

> Each rich-text field is a separate file in this folder.

- [Acceptance Criteria](./acceptance-criteria.md)
- [Out Of Scope](./out-of-scope.md)
- [Implementation Plan (Dev)](./implementation-plan.md)
- [Acceptance Test Plan (QA)](./acceptance-test-plan.md)
- [Acceptance Test Results (QA)](./acceptance-test-results.md)

---

## Metadata

- **Created:** 12/6/2026
- **Updated:** 12/6/2026
- **Reporter:** Nahuel Gomez
- **Assignee:** Nahuel Gomez
- **Labels:** pdf, phase-6, post-mvp

---

_Synced from Jira by sync-jira-issues_
