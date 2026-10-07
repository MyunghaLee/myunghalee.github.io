#!/usr/bin/env bash
#
# Generates assets/updated.json for the deployed site. It runs during
# deployment (see .github/workflows/deploy.yml) and is never committed back to
# the repository; the file is listed in .gitignore.
#
#   cv:   latest release or GitHub Pages deployment of myunghalee/cv
#   site: committer date of the deployed commit
#
# If a lookup fails, the previously deployed values are kept; if there are no
# previous values either, the dates hardcoded in the HTML remain on the page.
# Requires GNU date, curl, and jq (available on GitHub's Ubuntu runners).

set -uo pipefail

repo_root="$(cd "$(dirname "$0")/../.." && pwd)"
output="$repo_root/assets/updated.json"

# Performs a GitHub API request. The workflow token only grants access to this
# repository, so fall back to an anonymous request (used for myunghalee/cv).
api() {
  local url="https://api.github.com$1"
  local headers=(-H "Accept: application/vnd.github+json")
  if [ -n "${GH_TOKEN:-}" ]; then
    headers+=(-H "Authorization: Bearer $GH_TOKEN")
  fi
  curl -fsSL --max-time 20 "${headers[@]}" "$url" 2>/dev/null && return 0
  curl -fsSL --max-time 20 -H "Accept: application/vnd.github+json" \
    "$url" 2>/dev/null || true
}

# Normalizes a timestamp such as 2026-10-07T13:53:00+09:00 to UTC ISO 8601.
to_utc() {
  [ -n "${1:-}" ] || return 0
  date -u -d "$1" +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || true
}

# Reads one field from the currently deployed dates file.
prev() {
  curl -fsSL --max-time 20 "https://myunghalee.github.io/assets/updated.json" \
    2>/dev/null | jq -r --arg key "$1" '.[$key] // empty' 2>/dev/null || true
}

prev_cv="$(prev cv)"
prev_site="$(prev site)"

cv_release="$(api /repos/myunghalee/cv/releases/latest |
  jq -r '.published_at // .created_at // empty' 2>/dev/null || true)"
cv_pages="$(api "/repos/myunghalee/cv/deployments?environment=github-pages&per_page=5" |
  jq -r '[.[].created_at] | max // empty' 2>/dev/null || true)"

cv="$({ to_utc "$cv_release"; to_utc "$cv_pages"; } | sort | tail -n 1)"
[ -n "$cv" ] || cv="$prev_cv"

site="$(to_utc "$(git -C "$repo_root" log -1 --format=%cI 2>/dev/null || true)")"
[ -n "$site" ] || site="$prev_site"

jq -n --arg cv "$cv" --arg site "$site" '{cv: $cv, site: $site}' > "$output"
cat "$output"
