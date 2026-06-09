# Jira Image Attachment Guide — DTS

> **How AI agents can post screenshots to Jira for evidence**

## The Answer

**Yes, it's possible** via Jira REST API. `acli` cannot do attachments (confirmed in skill gotchas). Use the REST endpoint directly.

## Recipe

```bash
curl -D- \
  -u "$ATLASSIAN_EMAIL:$ATLASSIAN_API_TOKEN" \
  -X POST \
  -H "X-Atlassian-Token: nocheck" \
  -F "file=@/path/to/screenshot.png" \
  "$ATLASSIAN_URL/rest/api/3/issue/DTS-32/attachments"
```

Returns HTTP 200 with attachment metadata (id, filename, content URL).

## Requirements

| Item                  | Source                                                                      |
| --------------------- | --------------------------------------------------------------------------- |
| `ATLASSIAN_EMAIL`     | `.env`                                                                      |
| `ATLASSIAN_API_TOKEN` | `.env` (from `https://id.atlassian.com/manage-profile/security/api-tokens`) |
| `ATLASSIAN_URL`       | `https://diplo-track-sys.atlassian.net`                                     |

## For AI Agent Workflow

1. Take screenshot (Playwright, puppeteer, or OS-native)
2. Save to temp file
3. Upload via `curl` to `POST /rest/api/3/issue/{KEY}/attachments`
4. Delete temp file

## What Doesn't Work

- `acli` — no attachment upload command
- Inline base64 images in comments — Jira doesn't render them
- Remote image URLs in comments — possible via `![alt](url)` but not for local screenshots
- Atlassian MCP — attachment upload not in the documented MCP toolset

## Batch Pattern

```bash
for KEY in DTS-26 DTS-27 DTS-32; do
  curl -sS -o /dev/null -w "$KEY -> HTTP %{http_code}\n" \
    -u "$ATLASSIAN_EMAIL:$ATLASSIAN_API_TOKEN" \
    -X POST \
    -H "X-Atlassian-Token: nocheck" \
    -F "file=@/tmp/evidence-$KEY.png" \
    "$ATLASSIAN_URL/rest/api/3/issue/$KEY/attachments"
done
```
