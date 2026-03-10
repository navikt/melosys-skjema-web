#!/bin/bash
set -euo pipefail

# Find all remote dependabot branches, rebase on main, run pnpm install, and push

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

  # Rebase on main, resolve lockfile conflicts by regenerating
  if ! git rebase origin/main; then
    # Accept theirs for lockfile conflicts and regenerate with pnpm install
    if git diff --name-only --diff-filter=U | grep -q pnpm-lock.yaml; then
      git checkout --theirs pnpm-lock.yaml
      pnpm install
      git add pnpm-lock.yaml
      GIT_EDITOR="true" git rebase --continue || true
    else
      echo "SKIPPING $branch — rebase conflict is not lockfile-related"
      git rebase --abort
      echo ""
      continue
    fi
  fi

  # Run pnpm install (may produce changes even without rebase conflict)
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
