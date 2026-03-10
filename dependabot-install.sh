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

for branch in $branches; do
  echo "========================================="
  echo "Processing: $branch"
  echo "========================================="

  git checkout -B "$branch" "origin/$branch"
  git rebase -X theirs origin/main
  pnpm install

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

echo "Done. Switching back to $original_branch."
git checkout "$original_branch"
