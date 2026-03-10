#!/bin/bash
set -euo pipefail

# Find all remote dependabot branches, rebase on main, run pnpm install, and push.
#
# Dependabot-brancher har kun package.json i diff. Eventuelle rebase-konflikter
# vil derfor alltid være i pnpm-lock.yaml. Vi bruker -X theirs for å automatisk
# løse disse, og regenererer lockfilen med pnpm install etterpå.

git fetch origin main

branches=$(git branch -r | grep 'origin/dependabot/' | sed 's/^ *//' | sed 's|origin/||')

if [ -z "$branches" ]; then
  echo "No dependabot branches found."
  exit 0
fi

echo "Found dependabot branches:"
echo "$branches"
echo ""

original_branch=$(git branch --show-current)

failed_branches=()

for branch in $branches; do
  echo "========================================="
  echo "Processing: $branch"
  echo "========================================="

  if ! git checkout -B "$branch" "origin/$branch" ||
     ! git rebase -X theirs origin/main; then
    echo "FEIL: $branch — avbryter rebase og hopper videre."
    git rebase --abort 2>/dev/null || true
    failed_branches+=("$branch")
    echo ""
    continue
  fi

  if ! pnpm install; then
    echo "FEIL: $branch — pnpm install feilet, hopper videre."
    failed_branches+=("$branch")
    echo ""
    continue
  fi

  if git diff --quiet pnpm-lock.yaml 2>/dev/null; then
    echo "No lockfile changes on $branch."
  else
    git add pnpm-lock.yaml
    git commit -m "pnpm install"
  fi

  git push --force-with-lease
  echo "Pushed $branch."
  echo ""
done

echo "Switching back to $original_branch."
git checkout "$original_branch"

if [ ${#failed_branches[@]} -gt 0 ]; then
  echo ""
  echo "Følgende brancher feilet:"
  printf '  - %s\n' "${failed_branches[@]}"
  exit 1
fi

echo "Done. Alle brancher prosessert uten feil."
