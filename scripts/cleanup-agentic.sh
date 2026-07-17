#!/usr/bin/env bash
# ==============================================================
# cleanup-agentic.sh — Agentic repo hygiene script
#
# Prunes stale session artifacts, checks for bloat, and reports
# repo health. Designed to run manually or via weekly GHA cron.
# ==============================================================
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$REPO_ROOT"

echo "=== Agentic Cleanup: $(date '+%Y-%m-%d %H:%M') ==="

# ----- 1. .gitignore compliance check -----
echo ""
echo "--- Checking .gitignore compliance ---"
MISSING_RULES=0
check_rule() {
  if ! grep -q "$1" .gitignore 2>/dev/null; then
    echo "  MISSING: $1"
    MISSING_RULES=$((MISSING_RULES + 1))
  fi
}

check_rule '.opencode/node_modules/'
check_rule '.context/PBI/'
check_rule '.claude/skills/'
check_rule '.agents/'
check_rule '/session-ses_*.md'

if [ "$MISSING_RULES" -eq 0 ]; then
  echo "  All agentic .gitignore rules present"
else
  echo "  $MISSING_RULES rule(s) missing — consider adding them"
fi

# ----- 2. Check for stray tracked session files -----
echo ""
echo "--- Checking for stray session artifacts ---"
STRAY=$(git ls-files 'session-ses_*.md' 2>/dev/null || true)
if [ -n "$STRAY" ]; then
  echo "  Stray tracked session files:"
  echo "$STRAY" | sed 's/^/    /'
  echo "  Consider: git rm --cached <file>"
else
  echo "  No stray session files tracked"
fi

# ----- 3. Stale local session directories (>30 days) -----
echo ""
echo "--- Checking stale local sessions (.session/) ---"
if [ -d .session ]; then
  STALE=$(find .session -maxdepth 1 -type d -name 'ses-*' -mtime +30 2>/dev/null || true)
  STALE_COUNT=$(echo "$STALE" | grep -c . || true)
  if [ "$STALE_COUNT" -gt 0 ]; then
    echo "  $STALE_COUNT stale session(s) >30 days old"
    echo "$STALE" | sed 's/^/    /'
    echo "  To archive: mv <dir> .session/.archive/"
  else
    echo "  No stale sessions"
  fi
fi

# ----- 4. Stale session archive (>90 days) -----
echo ""
echo "--- Checking old archive dirs (.session/.archive/) ---"
if [ -d .session/.archive ]; then
  OLD=$(find .session/.archive -maxdepth 1 -type d -mtime +90 2>/dev/null || true)
  OLD_COUNT=$(echo "$OLD" | grep -c . || true)
  if [ "$OLD_COUNT" -gt 0 ]; then
    echo "  $OLD_COUNT archive(s) >90 days old"
    echo "  To delete: rm -rf <dir>"
  else
    echo "  No old archives"
  fi
fi

# ----- 5. Stale .context/ dirs (untouched >180 days, non-PBI) -----
echo ""
echo "--- Checking stale context dirs (.context/) ---"
if [ -d .context ]; then
  # Ignore PBI (synced from Jira) and any top-level .md files
  STALE_CTX=$(find .context -maxdepth 1 -type d ! -name 'PBI' ! -name '.' -mtime +180 2>/dev/null || true)
  STALE_CTX_COUNT=$(echo "$STALE_CTX" | grep -c . || true)
  if [ "$STALE_CTX_COUNT" -gt 0 ]; then
    echo "  $STALE_CTX_COUNT context dir(s) untouched >180 days:"
    echo "$STALE_CTX" | sed 's/^/    /'
  else
    echo "  No stale context dirs"
  fi
fi

# ----- 6. Repo size report -----
echo ""
echo "--- Repo size report ---"
echo "  Tracked files: $(git ls-files | wc -l)"
echo "  Packed size: $(du -sh .git/objects/pack/ 2>/dev/null | awk '{print $1}')"
echo "  Large tracked files (>500KB):"
git ls-files -z | xargs -0 ls -la 2>/dev/null | awk '{if ($5 > 500000) print "    " $NF " (" $5 " bytes)"}' || true

# ----- 7. Check for untracked large files -----
echo ""
echo "--- Untracked large files (>1MB) ---"
git ls-files --others --exclude-standard -z | xargs -0 ls -la 2>/dev/null | awk '{if ($5 > 1000000) print "    " $NF " (" int($5/1048576) " MB)"}' || true

echo ""
echo "=== Cleanup check complete ==="
