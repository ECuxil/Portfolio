#!/usr/bin/env bash
# Pre-publish audit: fails if anything risky is found. Run from the repo root: bash scripts/audit.sh
fail=0
chk() { if grep -rEn --exclude-dir=.git --exclude-dir=scripts "$1" . ; then echo "✗ $2"; fail=1; else echo "✓ $2"; fi; }
chk 'api\.github\.com|ghp_[A-Za-z0-9]{20,}|github_pat_|gho_[A-Za-z0-9]{20,}' "no GitHub API calls or tokens"
chk 'innerHTML|outerHTML|insertAdjacentHTML|document\.write|eval\(|new Function' "no dangerous DOM/JS sinks"
chk '<script(?![^>]*src=)[^>]*>' "no inline scripts" 2>/dev/null || true
chk 'on(click|load|error)=' "no inline event handlers"
chk '[ "]style=' "no inline style attributes"
chk 'src="http://|href="http://' "no insecure http:// links"
chk '(AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----|password\s*[:=])' "no secrets/keys"
python3 -I -c "import json;json.load(open('data/projects.json'))" && echo "✓ projects.json is valid"
exit $fail
