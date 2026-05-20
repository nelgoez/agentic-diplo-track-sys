param(
    [string]$JiraUrl = "https://diplo-track-sys.atlassian.net",
    [string]$Email,
    [string]$Token
)

$pair = "${Email}:${Token}"
$bytes = [System.Text.Encoding]::ASCII.GetBytes($pair)
$base64 = [System.Convert]::ToBase64String($bytes)
$auth = "Basic ${base64}"

$headers = @{Authorization=$auth; 'Content-Type'='application/json'}

# Fields to create: name, type, searcherKey
Write-Host "`n⚠️ Custom fields must be created manually in Jira Admin UI." -ForegroundColor Yellow
Write-Host "Go to: ${JiraUrl}/plugins/servlet/project-config/DTS/fields" -ForegroundColor Yellow
Write-Host ""
Write-Host "Required fields for Stories:" -ForegroundColor Cyan
Write-Host "  1. ✅ Acceptance Criteria (Gherkin) — Paragraph (textarea)"
Write-Host "  2. Scope — Paragraph (textarea)"
Write-Host "  3. Story Points — Number (float)"
Write-Host "  4. Business Rules Specification — Paragraph (textarea)"
Write-Host "  5. Workflow — Paragraph (textarea)"  
Write-Host "  6. Weblink (URL) — Text field (single line)"
Write-Host "  7. Mockup — Text field (single line)"
Write-Host ""
Write-Host "Required fields for Bugs:" -ForegroundColor Cyan
Write-Host "  8. Actual Result (Comportamiento) — Paragraph (textarea)"
Write-Host "  9. Expected Result (Output) — Paragraph (textarea)"
Write-Host "  10. Error Type — Select list (content, crash, data, functional, integration, performance, security, visual)"
Write-Host "  11. Severity — Select list (critica, mayor, menor, moderada, trivial)"
Write-Host "  12. Test Environment — Select list (dev, production, qa, staging, uat)"
Write-Host "  13. Root Cause — Select list (code_error, config_env_error, data_error, etc)"
Write-Host "  14. Workaround — Paragraph (textarea)"
Write-Host "  15. Evidence — Paragraph (textarea)"
Write-Host "  16. Fix — Select list (bugfix, hotfix)"
Write-Host ""
Write-Host "Required for QA:" -ForegroundColor Cyan
Write-Host "  17. Acceptance Test Results (ATR) — Paragraph (textarea)"
Write-Host "  18. Acceptance Test Plan (ATP) — Paragraph (textarea)"
Write-Host "  19. Test Status — Select list (blocked, failed, n_r, passed)"

$existing = Invoke-RestMethod -Uri "${JiraUrl}/rest/api/3/field" -Headers @{Authorization=$auth; Accept='application/json'}
$existingNames = $existing | Where-Object { $_.custom } | ForEach-Object { $_.name }

foreach ($f in $fields) {
    if ($existingNames -contains $f.name) {
        Write-Host "SKIP: '$($f.name)' already exists"
        continue
    }
    
    $body = @{
        name = $f.name
        type = $f.type
        searcherKey = $f.searcher
        description = "Created by DTS setup script"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-WebRequest -Uri "${JiraUrl}/rest/api/3/field" -Method Post -Headers $headers -Body $body
        Write-Host "CREATED: '$($f.name)' -> HTTP $($response.StatusCode) $($response.Content)" -ForegroundColor Green
    } catch {
        Write-Host "ERROR: '$($f.name)' -> $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Verify final state
Write-Host "`n=== FIELDS AFTER CREATION ===" -ForegroundColor Cyan
$final = Invoke-RestMethod -Uri "${JiraUrl}/rest/api/3/field" -Headers @{Authorization=$auth; Accept='application/json'}
$final | Where-Object { $_.custom } | ForEach-Object { Write-Host "  $($_.id) - $($_.name)" }
