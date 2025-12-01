#!/usr/bin/env bash

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Run Node.js script - prompts go to stderr, token to stdout
TOKEN=$(node "$SCRIPT_DIR/get-q2-token.cjs")

if [[ -z "$TOKEN" ]]; then
    echo -e "${RED}✗ No token received${NC}"
    exit 1
fi

export LOCAL_TOKEN="$TOKEN"
echo ""
echo -e "${GREEN}${BOLD}✓ Token extracted and set!${NC}"
echo -e "${CYAN}  Token expires in ~1 hour${NC}"
