#!/usr/bin/env bash
# Push to GitHub and enable GitHub Pages. Requires: gh auth login
set -euo pipefail

REPO_NAME="501fun-feature-cards"
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

if ! gh auth status >/dev/null 2>&1; then
  echo "Not logged in to GitHub. Run: gh auth login"
  exit 1
fi

OWNER="$(gh api user -q .login)"
REMOTE="https://github.com/${OWNER}/${REPO_NAME}.git"

if git remote get-url origin >/dev/null 2>&1; then
  echo "Remote 'origin' already exists — pushing to main..."
  /usr/bin/git push -u origin main
else
  echo "Creating public repo ${OWNER}/${REPO_NAME}..."
  gh repo create "$REPO_NAME" \
    --public \
    --source=. \
    --remote=origin \
    --push \
    --description "501 Fun interview task — Feature Cards / CTA module"
fi

echo "Enabling GitHub Pages..."
gh api \
  --method POST \
  "/repos/${OWNER}/${REPO_NAME}/pages" \
  -f 'build_type=legacy' \
  -f 'source[branch]=main' \
  -f 'source[path]=/' \
  2>/dev/null || gh api "/repos/${OWNER}/${REPO_NAME}/pages" -X PUT \
  -f 'build_type=legacy' \
  -f 'source[branch]=main' \
  -f 'source[path]=/'

LIVE_URL="https://${OWNER}.github.io/${REPO_NAME}/"
echo ""
echo "Done!"
echo "  GitHub:  https://github.com/${OWNER}/${REPO_NAME}"
echo "  Live:    ${LIVE_URL}"
echo ""
echo "Pages may take 1–2 minutes to become available."
