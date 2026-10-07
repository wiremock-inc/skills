#!/usr/bin/env node

/**
 * Packages codex/ as the OpenAI plugin directory upload: dist/wiremock-cloud-openai-<version>.zip
 * with the package contents at the ZIP root (plugin.json, mcp.json, skills/, assets/ and the legacy
 * Codex files), plus a .sha256 file to compare against what was uploaded.
 *
 * Run via `npm run package:openai`, which builds and validates (--release) first. The ZIP is
 * reproducible: entries are sorted, permissions and (UTC) timestamps normalised, and extra
 * attributes dropped (`zip -X`), so the same tree gives the same checksum on any machine with
 * Info-ZIP 3.0 (checked: macOS and Debian produce identical bytes).
 */

import { execFileSync } from 'child_process';
import crypto from 'crypto';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_DIR = path.join(ROOT, 'codex');
const DIST_DIR = path.join(ROOT, 'dist');
const { version } = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
const FIXED_MTIME = new Date('1980-01-02T00:00:00Z');

function listFiles(dir, rel = '') {
  return fs.readdirSync(path.join(dir, rel), { withFileTypes: true }).flatMap(entry => {
    const entryRel = path.posix.join(rel, entry.name);
    return entry.isDirectory() ? listFiles(dir, entryRel) : [entryRel];
  });
}

function main() {
  const zipName = `wiremock-cloud-openai-${version}.zip`;
  const zipPath = path.join(DIST_DIR, zipName);
  fs.mkdirSync(DIST_DIR, { recursive: true });
  fs.rmSync(zipPath, { force: true });

  // Stage a copy so permissions and timestamps can be normalised without touching the repo.
  const stage = fs.mkdtempSync(path.join(os.tmpdir(), 'wiremock-openai-'));
  try {
    fs.cpSync(SOURCE_DIR, stage, { recursive: true });
    const files = listFiles(stage).sort();
    for (const file of files) {
      const abs = path.join(stage, file);
      fs.chmodSync(abs, 0o644);
      fs.utimesSync(abs, FIXED_MTIME, FIXED_MTIME);
    }
    // ZIP timestamps are stored in local time, so pin the zone or the bytes differ across machines.
    execFileSync('zip', ['-q', '-X', '-D', '-9', zipPath, '-@'], {
      cwd: stage,
      input: files.join('\n') + '\n',
      env: { ...process.env, TZ: 'UTC' }
    });
  } finally {
    fs.rmSync(stage, { recursive: true, force: true });
  }

  const entries = execFileSync('unzip', ['-Z1', zipPath], { encoding: 'utf8' }).trim().split('\n');
  for (const required of ['plugin.json', 'mcp.json', '.codex-plugin/plugin.json', '.mcp.json']) {
    if (!entries.includes(required)) throw new Error(`${zipName} is missing ${required} at its root`);
  }
  if (!entries.some(e => e.startsWith('skills/'))) throw new Error(`${zipName} has no skills/`);
  if (entries.some(e => e.startsWith('codex/') || e.startsWith('codex-local/'))) throw new Error(`${zipName} has an enclosing folder`);

  const sha256 = crypto.createHash('sha256').update(fs.readFileSync(zipPath)).digest('hex');
  fs.writeFileSync(`${zipPath}.sha256`, `${sha256}  ${zipName}\n`);

  console.log(`📦 ${path.relative(ROOT, zipPath)} (${entries.length} files)`);
  console.log(`   sha256 ${sha256}`);
}

try {
  main();
} catch (error) {
  console.error(`❌ ${error.message}`);
  process.exit(1);
}
