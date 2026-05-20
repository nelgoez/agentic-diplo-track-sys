param(
    [string]$JiraUrl = "https://diplo-track-sys.atlassian.net",
    [string]$Email,
    [string]$Token
)

$pair = "${Email}:${Token}"
$bytes = [System.Text.Encoding]::ASCII.GetBytes($pair)
$base64 = [System.Convert]::ToBase64String($bytes)
$auth = "Basic ${base64}"

Write-Host "Connecting to: $JiraUrl as $Email"
$fields = Invoke-RestMethod -Uri "${JiraUrl}/rest/api/3/field" -Headers @{Authorization=$auth; Accept='application/json'}

Write-Host "`n=== ALL CUSTOM FIELDS ==="
$fields | Where-Object { $_.custom -eq $true } | ForEach-Object { Write-Host "$($_.id) - $($_.name)" }

Write-Host "`nTotal fields: $($fields.Count)"
Write-Host "Total custom fields: $(($fields | Where-Object { $_.custom -eq $true }).Count)"
