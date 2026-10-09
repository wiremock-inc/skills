#!/usr/bin/env node

/**
 * Fixture tests for scripts/validate-openai-plugin.mjs: copies the built codex/ package, breaks it
 * one way per case, and checks the validator rejects it with the expected message (and accepts the
 * untouched copy, plus a copy with every owner input filled in under --release).
 */

import { spawnSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const VALIDATOR = path.join(ROOT, 'scripts', 'validate-openai-plugin.mjs');
const SOURCE = path.join(ROOT, 'codex');

const readJson = (dir, rel) => JSON.parse(fs.readFileSync(path.join(dir, rel), 'utf8'));
const writeJson = (dir, rel, value) => fs.writeFileSync(path.join(dir, rel), JSON.stringify(value, null, 2));
const openai = (dir) => readJson(dir, 'plugin.json').extensions['com.openai'];

function editOpenAI(dir, edit) {
  const manifest = readJson(dir, 'plugin.json');
  edit(manifest.extensions['com.openai']);
  writeJson(dir, 'plugin.json', manifest);
  // keep the mirrored legacy interface in step so only the intended rule fails
  const legacy = readJson(dir, '.codex-plugin/plugin.json');
  legacy.interface = manifest.extensions['com.openai'].interface;
  writeJson(dir, '.codex-plugin/plugin.json', legacy);
}

function png(width, height) {
  const buf = Buffer.alloc(33);
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(buf, 0);
  buf.writeUInt32BE(13, 8);
  buf.write('IHDR', 12, 'ascii');
  buf.writeUInt32BE(width, 16);
  buf.writeUInt32BE(height, 20);
  return buf;
}

function addIcons(dir, logo = png(512, 512)) {
  fs.mkdirSync(path.join(dir, 'assets'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'assets', 'logo.png'), logo);
  fs.writeFileSync(path.join(dir, 'assets', 'composer-icon.png'), png(96, 96));
  editOpenAI(dir, o => Object.assign(o.interface, { logo: './assets/logo.png', composerIcon: './assets/composer-icon.png' }));
}

function fillOwnerInputs(dir) {
  addIcons(dir);
  const positive = { description: 'd', prompt: 'p', tools_triggered: 't', expected_behavior: 'e' };
  editOpenAI(dir, o => {
    o.review.test_cases = { positive: Array(5).fill(positive), negative: Array(3).fill({ description: 'd', prompt: 'p' }) };
    o.review.demo_recording_url = 'https://www.wiremock.io/demo';
  });
}

const CASES = [
  { name: 'built package passes', expect: 'pass' },
  { name: 'all owner inputs present passes --release', release: true, expect: 'pass', setup: fillOwnerInputs },
  { name: 'missing owner inputs block --release', release: true, expect: 'blocked on owner inputs', setup: d => editOpenAI(d, o => { o.review.test_cases = { positive: [], negative: [] }; }) },
  { name: 'non-WireMock / non-https listing URL', expect: 'public https WireMock URL', setup: d => editOpenAI(d, o => { o.interface.supportURL = 'http://example.com/help'; }) },
  { name: 'placeholder in manifest', expect: 'unresolved placeholder', setup: d => editOpenAI(d, o => { o.publication.release_notes = 'OWNER_INPUT_RELEASE_NOTES'; }) },
  { name: 'field limit', expect: 'max 30', setup: d => editOpenAI(d, o => { o.interface.shortDescription = 'x'.repeat(31); }) },
  { name: 'too many starter prompts', expect: 'max 3', setup: d => editOpenAI(d, o => { o.interface.defaultPrompt.push('one more'); }) },
  { name: 'low-contrast brandColor', expect: '2:1 contrast', setup: d => editOpenAI(d, o => { o.interface.brandColor = '#FFFF00'; }) },
  { name: 'local stdio server', expect: 'must be streamable-http', setup: d => writeJson(d, 'mcp.json', { $schema: 'https://agent-plugins.org/schemas/1.0.0/mcp.schema.json', mcpServers: { wiremock: { type: 'stdio', command: 'wiremock', args: ['mcp'] } } }) },
  { name: 'legacy endpoint drift', expect: 'endpoint differs', setup: d => writeJson(d, '.mcp.json', { mcpServers: { wiremock: { type: 'http', url: 'https://mcp.wiremock.cloud/other' } } }) },
  { name: 'version drift', expect: 'version', setup: d => { const m = readJson(d, 'plugin.json'); m.version = '0.0.1'; writeJson(d, 'plugin.json', m); } },
  { name: 'unknown manifest key (schema)', expect: 'Agent Plugins 1.0.0 schema', setup: d => { const m = readJson(d, 'plugin.json'); m.skills = './skills'; writeJson(d, 'plugin.json', m); } },
  { name: 'positive case missing tools_triggered', expect: 'missing tools_triggered', setup: d => editOpenAI(d, o => { o.review.test_cases.positive = [{ description: 'd', prompt: 'p', expected_behavior: 'e' }]; }) },
  { name: 'wrong review case count', release: true, expect: 'exactly 3 negative', setup: d => { fillOwnerInputs(d); editOpenAI(d, o => { o.review.test_cases.negative.pop(); }); } },
  { name: 'non-square icon', expect: 'must be square', setup: d => addIcons(d, png(512, 256)) },
  { name: 'icon outside package', expect: 'escapes the package', setup: d => editOpenAI(d, o => { o.interface.logo = './../logo.png'; }) },
  { name: 'secret in a skill', expect: 'credential-like', setup: d => fs.appendFileSync(path.join(d, 'skills/create-stubs/SKILL.md'), '\n"apiKey": "abcd1234efgh"\n') },
  { name: 'private key material', expect: 'private key material', setup: d => fs.writeFileSync(path.join(d, 'skills/create-stubs/notes.md'), '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEF\n-----END PRIVATE KEY-----\n') },
  { name: 'build-token residue', expect: 'residue', setup: d => fs.appendFileSync(path.join(d, 'skills/create-stubs/SKILL.md'), '\nUse {{WIREMOCK_TOOL_PREFIX}}list\n') },
  { name: 'OS metadata file', expect: 'OS metadata', setup: d => fs.writeFileSync(path.join(d, 'skills/.DS_Store'), '') },
  { name: 'challenge token file', expect: 'domain challenge token', setup: d => fs.writeFileSync(path.join(d, 'openai-apps-challenge'), 'token') },
  { name: 'symlink', expect: 'symlink', setup: d => fs.symlinkSync('/etc/hosts', path.join(d, 'skills/hosts')) },
  { name: 'skill without SKILL.md', expect: 'has no SKILL.md', setup: d => fs.mkdirSync(path.join(d, 'skills/empty-skill')) }
];

let failures = 0;
const work = fs.mkdtempSync(path.join(os.tmpdir(), 'openai-validator-'));
try {
  for (const testCase of CASES) {
    const dir = path.join(work, String(CASES.indexOf(testCase)));
    fs.cpSync(SOURCE, dir, { recursive: true });
    testCase.setup?.(dir);
    const args = [VALIDATOR, ...(testCase.release ? ['--release'] : []), dir];
    const { status, stdout, stderr } = spawnSync(process.execPath, args, { encoding: 'utf8' });
    const output = stdout + stderr;
    const ok = testCase.expect === 'pass' ? status === 0 : status !== 0 && output.includes(testCase.expect);
    if (!ok) {
      failures++;
      console.error(`✗ ${testCase.name} (expected ${testCase.expect === 'pass' ? 'pass' : `failure mentioning "${testCase.expect}"`})\n${output.replace(/^/gm, '    ')}`);
    }
  }
} finally {
  fs.rmSync(work, { recursive: true, force: true });
}

if (failures > 0) {
  console.error(`\n❌ ${failures}/${CASES.length} OpenAI validator cases failed`);
  process.exit(1);
}
console.log(`✅ ${CASES.length} OpenAI validator cases passed`);
