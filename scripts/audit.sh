#!/usr/bin/env bash
# Pre-publish audit: fails if anything risky is found. Run from the repo root: bash scripts/audit.sh
fail=0
# Markdown docs (e.g. CLAUDE.md) are skipped: they describe the rules and would match their own patterns.
G=(grep -rEn --exclude-dir=.git --exclude-dir=scripts --exclude='*.md')
chk() { if "${G[@]}" "$1" . ; then echo "✗ $2"; fail=1; else echo "✓ $2"; fi; }
chk 'api\.github\.com|ghp_[A-Za-z0-9]{20,}|github_pat_|gho_[A-Za-z0-9]{20,}' "no GitHub API calls or tokens"
chk 'innerHTML|outerHTML|insertAdjacentHTML|document\.write|eval\(|new Function' "no dangerous DOM/JS sinks"
# Inline scripts: <script> tags without src= (grep -E has no lookahead, so filter in two steps)
if "${G[@]}" '<script' . | grep -v 'src=' ; then echo "✗ no inline scripts"; fail=1; else echo "✓ no inline scripts"; fi
chk 'on(click|load|error)=' "no inline event handlers"
chk '[ "]style=' "no inline style attributes"
chk 'src="http://|href="http://' "no insecure http:// links"
chk '(AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----|password\s*[:=])' "no secrets/keys"
python3 -I -c "import json;json.load(open('data/projects.json'))" && echo "✓ projects.json is valid"
exit $fail
