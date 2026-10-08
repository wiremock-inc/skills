#!/usr/bin/env node

/**
 * Validates the OpenAI plugin package (the portable Agent Plugins layout in codex/).
 *
 * Usage: node scripts/validate-openai-plugin.mjs [--release] [plugin-dir]   (default dir: codex)
 *
 * Without --release it checks everything the repository controls: both manifests and MCP configs
 * against the pinned Agent Plugins 1.0.0 schemas, endpoint/version parity with the legacy Codex
 * files, listing field limits, paths, skills, build residue, secrets and stray files. CI runs this
 * on every pull request.
 *
 * --release (used by `npm run package:openai`) also requires the owner-supplied inputs a
 * submission needs — listing images, exactly 5 positive and 3 negative review cases from the live
 * server, and a demo recording URL — and lists whichever are still missing.
 */

import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import Ajv2020 from 'ajv/dist/2020.js';

const require = createRequire(import.meta.url);
const { findExampleSecrets } = require('./utils/example-secrets.js');

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SCHEMAS_DIR = path.join(ROOT, 'scripts', 'schemas');
const PACKAGE = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));

const PLUGIN_NAME = 'wiremock-cloud';
const ENDPOINT = 'https://mcp.wiremock.cloud/mcp';
const TEXT_EXTENSIONS = new Set(['.md', '.json', '.yaml', '.yml', '.py', '.sh', '.txt']);

// skills/references holds reference docs shared by several skills; it isn't a skill itself.
const NON_SKILL_DIRS = new Set(['references']);

const FORBIDDEN_FILES = [
  { re: /^\.env(\..*)?$/, why: 'environment file' },
  { re: /^\.DS_Store$|^__MACOSX$|^Thumbs\.db$/, why: 'OS metadata' },
  { re: /^node_modules$|^\.git$/, why: 'repository/dependency folder' },
  { re: /\.(pem|key|p12|pfx)$/, why: 'key material' },
  { re: /openai-apps-challenge/, why: 'domain challenge token' }
];

// Unresolved placeholders. Manifests must contain none of these; the bundled docs legitimately use
// example hosts and TODO prose, so only the brief's explicit placeholder tokens are banned there.
const MANIFEST_PLACEHOLDER_RE = /OWNER_INPUT|\bTODO\b|CHANGEME|example\.com/i;
const ANY_FILE_PLACEHOLDER_RE = /OWNER_INPUT|CHANGEME/;
const BUILD_RESIDUE_RE = /\{\{[A-Z0-9_]+\}\}|^[ \t]*# @(?:end)?variant/m;
const PRIVATE_KEY_RE = /-----BEGIN [A-Z ]*PRIVATE KEY-----(?:\r?\n|\\n)[ \t]*(?!<|\.\.\.)[A-Za-z0-9+/=]{8,}/;

const LIMITS = { displayName: 30, shortDescription: 30, longDescription: 4000, developerName: 80 };
const LISTING_URL_KEYS = ['websiteURL', 'supportURL', 'privacyPolicyURL', 'termsOfServiceURL'];
const ICON_KEYS = ['logo', 'composerIcon', 'logoDark', 'composerIconDark'];
const MAX_ICON_BYTES = 5 * 1024 * 1024;

const errors = [];
const ownerInputs = [];
const fail = (message) => errors.push(message);

function readJson(dir, rel) {
  const file = path.join(dir, rel);
  if (!fs.existsSync(file)) {
    fail(`missing ${rel}`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`${rel} is not valid JSON: ${error.message}`);
    return null;
  }
}

function validateSchemas(manifest, mcp) {
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  const check = (schemaFile, data, rel) => {
    const validate = ajv.compile(JSON.parse(fs.readFileSync(path.join(SCHEMAS_DIR, schemaFile), 'utf8')));
    if (!validate(data)) {
      for (const e of validate.errors) fail(`${rel}${e.instancePath || ''} ${e.message} (Agent Plugins 1.0.0 schema)`);
    }
  };
  if (manifest) check('agent-plugins-1.0.0-plugin.schema.json', manifest, 'plugin.json');
  if (mcp) check('agent-plugins-1.0.0-mcp.schema.json', mcp, 'mcp.json');
}

function validateIdentity(manifest, legacyManifest) {
  if (manifest.name !== PLUGIN_NAME) fail(`plugin.json name must be "${PLUGIN_NAME}", got "${manifest.name}"`);
  if (manifest.version !== PACKAGE.version) fail(`plugin.json version ${manifest.version} doesn't match package.json ${PACKAGE.version}`);
  if (PACKAGE.license && manifest.license !== PACKAGE.license) fail(`plugin.json license ${manifest.license} doesn't match package.json ${PACKAGE.license}`);
  if (legacyManifest) {
    if (legacyManifest.name !== manifest.name) fail('.codex-plugin/plugin.json name differs from plugin.json');
    if (legacyManifest.version !== manifest.version) fail('.codex-plugin/plugin.json version differs from plugin.json');
    const iface = manifest.extensions?.['com.openai']?.interface;
    if (JSON.stringify(legacyManifest.interface) !== JSON.stringify(iface)) {
      fail('.codex-plugin/plugin.json interface differs from plugin.json extensions.com.openai.interface');
    }
  }
}

function validateMcp(mcp, legacyMcp) {
  const servers = Object.entries(mcp?.mcpServers || {});
  if (servers.length === 0) fail('mcp.json declares no servers');
  for (const [name, server] of servers) {
    if (server.type !== 'streamable-http') fail(`mcp.json server "${name}" must be streamable-http (no local stdio servers in the public package)`);
    if (server.url !== ENDPOINT) fail(`mcp.json server "${name}" url must be exactly ${ENDPOINT}, got ${server.url}`);
  }
  for (const [name, server] of Object.entries(legacyMcp?.mcpServers || {})) {
    if (server.command || server.type === 'stdio') fail(`.mcp.json server "${name}" is a local stdio server`);
    if (server.url !== mcp?.mcpServers?.[name]?.url) fail(`.mcp.json server "${name}" endpoint differs from mcp.json`);
  }
}

function relativeLuminance(hex) {
  const channel = (i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}

function readPngSize(file) {
  const header = Buffer.alloc(24);
  const fd = fs.openSync(file, 'r');
  fs.readSync(fd, header, 0, 24, 0);
  fs.closeSync(fd);
  const isPng = header.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
    && header.toString('ascii', 12, 16) === 'IHDR';
  return isPng ? { width: header.readUInt32BE(16), height: header.readUInt32BE(20) } : null;
}

function validateAsset(dir, key, rel) {
  if (typeof rel !== 'string' || !rel.startsWith('./')) return fail(`interface.${key} must be a ./ path inside the package`);
  const file = path.resolve(dir, rel);
  if (!file.startsWith(path.resolve(dir) + path.sep)) return fail(`interface.${key} (${rel}) escapes the package`);
  if (!fs.existsSync(file)) return fail(`interface.${key} (${rel}) does not exist`);
  if (!rel.endsWith('.png')) return fail(`interface.${key} (${rel}) must be a PNG`);
  if (fs.statSync(file).size > MAX_ICON_BYTES) fail(`interface.${key} (${rel}) is larger than 5 MiB`);
  const size = readPngSize(file);
  if (!size) return fail(`interface.${key} (${rel}) is not a valid PNG`);
  if (size.width !== size.height) fail(`interface.${key} (${rel}) must be square, got ${size.width}x${size.height}`);
  if (size.width < 48 || size.width > 4096) fail(`interface.${key} (${rel}) must be 48–4096 px, got ${size.width}`);
}

function validateInterface(dir, iface) {
  if (!iface) return fail('plugin.json is missing extensions.com.openai.interface');
  for (const [key, max] of Object.entries(LIMITS)) {
    if (typeof iface[key] !== 'string' || iface[key].length === 0) fail(`interface.${key} is required`);
    else if (iface[key].length > max) fail(`interface.${key} is ${iface[key].length} chars (max ${max})`);
  }
  const capabilities = iface.capabilities || [];
  if (capabilities.length > 20) fail(`interface.capabilities has ${capabilities.length} entries (max 20)`);
  capabilities.forEach((c, i) => c.length > 120 && fail(`interface.capabilities[${i}] is ${c.length} chars (max 120)`));
  const prompts = iface.defaultPrompt || [];
  if (prompts.length > 3) fail(`interface.defaultPrompt has ${prompts.length} entries (max 3)`);
  prompts.forEach((p, i) => p.length > 128 && fail(`interface.defaultPrompt[${i}] is ${p.length} chars (max 128)`));
  for (const key of LISTING_URL_KEYS) {
    if (iface[key] === undefined) continue;
    if (!/^https:\/\/[^\s/]*wiremock\.(io|cloud|org)(\/|$)/.test(iface[key])) fail(`interface.${key} must be a public https WireMock URL, got ${iface[key]}`);
  }
  if (iface.brandColor !== undefined) {
    if (!/^#[0-9A-Fa-f]{6}$/.test(iface.brandColor)) fail(`interface.brandColor must be #RRGGBB, got ${iface.brandColor}`);
    else if (1.05 / (relativeLuminance(iface.brandColor) + 0.05) < 2) fail(`interface.brandColor ${iface.brandColor} has less than 2:1 contrast against white`);
  }
  for (const key of ICON_KEYS) {
    if (iface[key] !== undefined) validateAsset(dir, key, iface[key]);
  }
}

function validateReviewCases(review = {}) {
  const cases = review.test_cases || {};
  const shapes = { positive: ['description', 'prompt', 'tools_triggered', 'expected_behavior'], negative: ['description', 'prompt'] };
  for (const [kind, fields] of Object.entries(shapes)) {
    (cases[kind] || []).forEach((testCase, i) => {
      for (const field of fields) {
        if (typeof testCase[field] !== 'string' || testCase[field].trim() === '') fail(`review.test_cases.${kind}[${i}] is missing ${field}`);
      }
    });
  }
}

function walk(dir, visit, rel = '') {
  for (const entry of fs.readdirSync(path.join(dir, rel), { withFileTypes: true })) {
    const entryRel = path.join(rel, entry.name);
    visit(entry, entryRel);
    if (entry.isDirectory() && !entry.isSymbolicLink()) walk(dir, visit, entryRel);
  }
}

function validateFiles(dir) {
  walk(dir, (entry, rel) => {
    if (entry.isSymbolicLink()) return fail(`${rel} is a symlink`);
    const forbidden = FORBIDDEN_FILES.find(({ re }) => re.test(entry.name));
    if (forbidden) return fail(`${rel} must not be in the package (${forbidden.why})`);
    if (!entry.isFile() || !TEXT_EXTENSIONS.has(path.extname(entry.name))) return;

    const content = fs.readFileSync(path.join(dir, rel), 'utf8');
    const isManifest = !rel.includes(path.sep + 'skills') && !rel.startsWith('skills') && rel.endsWith('.json');
    if ((isManifest ? MANIFEST_PLACEHOLDER_RE : ANY_FILE_PLACEHOLDER_RE).test(content)) fail(`${rel} contains an unresolved placeholder`);
    if (BUILD_RESIDUE_RE.test(content)) fail(`${rel} contains build-token or variant-directive residue`);
    if (PRIVATE_KEY_RE.test(content)) fail(`${rel} contains private key material`);
    const secrets = findExampleSecrets(content);
    if (secrets.length > 0) fail(`${rel} contains credential-like values: ${secrets.join(' | ')}`);
  });
}

function validateSkills(dir) {
  const skillsDir = path.join(dir, 'skills');
  if (!fs.existsSync(skillsDir)) return fail('missing skills/');
  const skills = fs.readdirSync(skillsDir, { withFileTypes: true }).filter(e => e.isDirectory() && !NON_SKILL_DIRS.has(e.name));
  if (skills.length === 0) fail('skills/ contains no skills');
  for (const skill of skills) {
    const skillFile = path.join(skillsDir, skill.name, 'SKILL.md');
    if (!fs.existsSync(skillFile)) {
      fail(`skills/${skill.name} has no SKILL.md`);
      continue;
    }
    const frontmatter = /^---\n([\s\S]*?)\n---\n/.exec(fs.readFileSync(skillFile, 'utf8'));
    if (!frontmatter) fail(`skills/${skill.name}/SKILL.md has no frontmatter`);
    else {
      const name = /^name:\s*(.+)$/m.exec(frontmatter[1])?.[1]?.trim();
      if (name !== skill.name) fail(`skills/${skill.name}/SKILL.md frontmatter name is "${name}"`);
      if (!/^description:/m.test(frontmatter[1])) fail(`skills/${skill.name}/SKILL.md frontmatter has no description`);
    }
  }
}

function checkOwnerInputs(openai) {
  const iface = openai?.interface || {};
  const review = openai?.review || {};
  const need = (condition, input) => condition || ownerInputs.push(input);
  need(iface.logo, 'logo: approved square PNG at variants/codex/assets/logo.png');
  need(iface.composerIcon, 'composer icon: approved square PNG at variants/codex/assets/composer-icon.png');
  for (const key of ['supportURL', 'websiteURL', 'category']) need(iface[key], `interface.${key}`);
  need((review.test_cases?.positive || []).length === 5, `exactly 5 positive review cases run on the live server (have ${(review.test_cases?.positive || []).length})`);
  need((review.test_cases?.negative || []).length === 3, `exactly 3 negative review cases run on the live server (have ${(review.test_cases?.negative || []).length})`);
  need(/^https:\/\//.test(review.demo_recording_url || ''), 'review.demo_recording_url: reviewer-accessible https walkthrough');
  need(openai?.publication?.release_notes, 'publication.release_notes');
}

function main() {
  const args = process.argv.slice(2);
  const release = args.includes('--release');
  const dir = path.resolve(ROOT, args.find(a => !a.startsWith('--')) || 'codex');

  const manifest = readJson(dir, 'plugin.json');
  const mcp = readJson(dir, 'mcp.json');
  const legacyManifest = readJson(dir, path.join('.codex-plugin', 'plugin.json'));
  const legacyMcp = readJson(dir, '.mcp.json');

  validateSchemas(manifest, mcp);
  if (manifest) {
    validateIdentity(manifest, legacyManifest);
    validateInterface(dir, manifest.extensions?.['com.openai']?.interface);
    validateReviewCases(manifest.extensions?.['com.openai']?.review);
  }
  validateMcp(mcp, legacyMcp);
  validateSkills(dir);
  validateFiles(dir);
  if (release) checkOwnerInputs(manifest?.extensions?.['com.openai']);

  const label = path.relative(ROOT, dir) || '.';
  if (errors.length > 0) {
    console.error(`❌ ${label}: ${errors.length} problem(s)\n${errors.map(e => `   - ${e}`).join('\n')}`);
  }
  if (ownerInputs.length > 0) {
    console.error(`⛔ ${label}: not releasable, blocked on owner inputs:\n${ownerInputs.map(e => `   - ${e}`).join('\n')}`);
  }
  if (errors.length > 0 || ownerInputs.length > 0) process.exit(1);
  console.log(`✅ ${label}: OpenAI plugin package valid${release ? ' for release' : ' (structure; run with --release before submitting)'}`);
}

main();
