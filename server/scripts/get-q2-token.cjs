#!/usr/bin/env node

const readline = require('readline');
const { exec } = require('child_process');

const TOKEN_URL = 'https://tokenx-token-generator.intern.dev.nav.no/api/obo?aud=dev-gcp:teammelosys:melosys-skjema-api';

// Colors
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
};

// Open browser
exec(`xdg-open "${TOKEN_URL}" 2>/dev/null || open "${TOKEN_URL}" 2>/dev/null`);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stderr
});

console.error('');
console.error(`${c.cyan}${c.bold}┌─────────────────────────────────────────────────┐${c.reset}`);
console.error(`${c.cyan}${c.bold}│${c.reset}  ${c.magenta}Q2 Token Generator${c.reset}                          ${c.cyan}${c.bold}│${c.reset}`);
console.error(`${c.cyan}${c.bold}└─────────────────────────────────────────────────┘${c.reset}`);
console.error('');
console.error(`${c.green}✓${c.reset} Browser opened for login`);
console.error('');
console.error(`${c.yellow}→${c.reset} Paste the JSON response or token below`);
console.error(`${c.dim}  (Press Enter twice when done)${c.reset}`);
console.error('');

let input = '';
let emptyLines = 0;

rl.on('line', (line) => {
  if (line.trim() === '') {
    emptyLines++;
    if (emptyLines >= 1 && input.trim()) {
      processInput();
    }
  } else {
    emptyLines = 0;
    input += line;
  }
});

function processInput() {
  rl.close();

  let token = input.trim();

  // Try to parse as JSON
  if (token.startsWith('{')) {
    try {
      const json = JSON.parse(token);
      token = json.access_token;
    } catch {
      const match = token.match(/"access_token"\s*:\s*"([^"]+)"/);
      if (match) {
        token = match[1];
      }
    }
  }

  if (!token) {
    console.error('ERROR: Could not extract token');
    process.exit(1);
  }

  // Output only the token to stdout
  console.log(token);
  process.exit(0);
}
