#!/usr/bin/env bash
# Estimate LOC in a git repo, ignoring files matched by .gitignore.
# Usage:
#   ./estimate_loc.sh           # total LOC
#   ./estimate_loc.sh --by-ext  # breakdown by file extension + total

set -euo pipefail

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Error: run this inside a git repository (needed to honor .gitignore)." >&2
  exit 1
fi

MODE="${1:-total}"

# Get all tracked + untracked, but NOT ignored files (null-separated for safety)
files() {
  git ls-files --cached --others --exclude-standard -z
}

if [[ "$MODE" == "total" ]]; then
  # Sum line counts
  total=$(
    files \
    | while IFS= read -r -d '' f; do
        [[ -f "$f" ]] || continue
        # LC_ALL=C avoids locale issues on some binaries; errors -> 0
        LC_ALL=C wc -l <"$f" 2>/dev/null || echo 0
      done \
    | awk '{s+=$1} END{print s+0}'
  )
  echo "Estimated LOC (ignoring .gitignore): $total"
  exit 0
fi

if [[ "$MODE" == "--by-ext" ]]; then
  tmp="$(mktemp)"
  # Emit "ext<TAB>lines" per file
  files \
  | while IFS= read -r -d '' f; do
      [[ -f "$f" ]] || continue
      lines=$(LC_ALL=C wc -l <"$f" 2>/dev/null || echo 0)
      # derive extension (lowercased); mark none as (noext)
      base="${f##*/}"
      if [[ "$base" == *.* && "$base" != .* ]]; then
        ext="${base##*.}"
        ext="$(printf '%s' "$ext" | tr '[:upper:]' '[:lower:]')"
      else
        ext="(noext)"
      fi
      printf "%s\t%s\n" "$ext" "$lines"
    done >"$tmp"

  echo "LOC by extension (ignoring .gitignore):"
  # Sum per extension, print sorted descending
  awk -F'\t' '{a[$1]+=$2; t+=$2} END{for (k in a) printf "%-16s %12d\n", k, a[k]; printf "%s\n%-16s %12d\n", "------------------------------", "TOTAL", t}' "$tmp" \
  | sort -k2,2nr -k1,1
  rm -f "$tmp"
  exit 0
fi

echo "Usage: $0 [--by-ext]"
exit 1
