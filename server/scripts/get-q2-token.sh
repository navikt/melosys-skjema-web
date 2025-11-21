#!/bin/bash

TOKEN_URL="https://tokenx-token-generator.intern.dev.nav.no/api/obo?aud=dev-gcp:teammelosys:melosys-skjema-api"
TOKEN_FILE="$(dirname "$0")/../.local-token"

echo "Opening browser for Q2 login..."
xdg-open "$TOKEN_URL" 2>/dev/null || open "$TOKEN_URL" 2>/dev/null

echo ""
echo "After logging in, copy the 'access_token' value from the JSON and paste it here:"
read -r TOKEN

echo "$TOKEN" > "$TOKEN_FILE"
echo "Token saved to .local-token"
