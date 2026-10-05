#!/usr/bin/env node

/**
 * Fails when the built Claude plugins changed relative to a base ref but package.json's version
 * didn't increase. Claude Code keeps users on the version in plugin.json, so shipping changed
 * plugin content under an unchanged version means existing installs never receive it.
 *
 * Usage: node scripts/check-version-bump.js [base-ref]   (default: origin/main)
 */

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CLAUDE_PLUGIN_PATHS = ['claude', 'claude-local', '.claude-plugin'];

function git(...args) {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
}

function parseVersion(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version || '');
  return match ? match.slice(1).map(Number) : null;
}

function isGreater(a, b) {
  for (let i = 0; i < 3; i++) {
    if (a[i] !== b[i]) return a[i] > b[i];
  }
  return false;
}

function main() {
  const baseRef = process.argv[2] || 'origin/main';
  const mergeBase = git('merge-base', baseRef, 'HEAD');

  // Compare the working tree, not just HEAD, so the check also covers uncommitted builds.
  const changed = git('diff', '--name-only', mergeBase, '--', ...CLAUDE_PLUGIN_PATHS);
  if (!changed) {
    console.log(`✅ Claude plugins unchanged since ${baseRef}; no version bump needed`);
    return;
  }

  const current = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).version;
  const base = JSON.parse(git('show', `${mergeBase}:package.json`)).version;
  const currentParts = parseVersion(current);
  if (!currentParts) {
    throw new Error(`package.json version "${current}" is not MAJOR.MINOR.PATCH`);
  }
  const baseParts = parseVersion(base);
  if (baseParts && !isGreater(currentParts, baseParts)) {
    const files = changed.split('\n');
    throw new Error(
      `Claude plugin content changed since ${baseRef} (${files.length} file(s), e.g. ${files[0]}) ` +
      `but package.json version is still ${current}. Bump "version" in package.json and run \`npm run build\`.`
    );
  }
  console.log(`✅ Claude plugins changed and version bumped ${base || '(none)'} → ${current}`);
}

try {
  main();
} catch (error) {
  console.error(`❌ ${error.message}`);
  process.exit(1);
}
