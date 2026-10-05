#!/usr/bin/env node

/**
 * Validates the Cursor Marketplace plugins (cursor/ and cursor-local/) and the repository
 * marketplace (.cursor-plugin/marketplace.json):
 *   - manifests and marketplace against the pinned official Cursor schemas (scripts/schemas/)
 *   - stable names and sources, version/license matching package.json and the root LICENSE
 *   - logo, skills and MCP paths resolving inside each plugin root
 *   - the remote plugin using the hosted HTTP endpoint and the local plugin `wiremock mcp` over stdio
 *   - exactly eight skills, each with name/description frontmatter and no Claude-only frontmatter
 *
 * Usage: node scripts/validate-cursor-plugins.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SCHEMAS_DIR = path.join(ROOT, 'scripts', 'schemas');
const PACKAGE = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));

const ENDPOINT = 'https://mcp.wiremock.cloud/mcp';
const EXPECTED_SKILLS = 8;
// skills/references holds reference docs shared by several skills; it isn't a skill itself.
const NON_SKILL_DIRS = new Set(['references']);
// First line of the license text each SPDX identifier must correspond to.
const LICENSE_HEADINGS = { 'Apache-2.0': /Apache License\s+Version 2\.0/ };

const PLUGINS = [
  { name: 'wiremock-cloud', root: 'cursor', backend: 'remote' },
  { name: 'wiremock-cloud-local', root: 'cursor-local', backend: 'local' }
];

const errors = [];
const fail = (message) => errors.push(message);

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const schemaValidator = (file) => ajv.compile(JSON.parse(fs.readFileSync(path.join(SCHEMAS_DIR, file), 'utf8')));
const validatePlugin = schemaValidator('cursor-plugin.schema.json');
const validateMarketplace = schemaValidator('cursor-marketplace.schema.json');

function readJson(rel) {
  try {
    return JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
  } catch (error) {
    fail(`${rel}: ${error.code === 'ENOENT' ? 'missing' : `invalid JSON (${error.message})`}`);
    return null;
  }
}

function checkSchema(validate, data, rel) {
  if (!validate(data)) {
    for (const e of validate.errors) fail(`${rel}${e.instancePath || ''} ${e.message} (official Cursor schema)`);
  }
}

function resolveInside(pluginRoot, rel, label) {
  const abs = path.resolve(ROOT, pluginRoot, rel);
  if (!abs.startsWith(path.resolve(ROOT, pluginRoot) + path.sep)) {
    fail(`${pluginRoot}: ${label} "${rel}" resolves outside the plugin root`);
    return null;
  }
  if (!fs.existsSync(abs)) {
    fail(`${pluginRoot}: ${label} "${rel}" does not exist`);
    return null;
  }
  return abs;
}

function checkLicense(manifest, rel) {
  if (manifest.license !== PACKAGE.license) fail(`${rel} license "${manifest.license}" doesn't match package.json "${PACKAGE.license}"`);
  const licenseFile = path.join(ROOT, 'LICENSE');
  if (!fs.existsSync(licenseFile)) return fail('root LICENSE is missing');
  const heading = LICENSE_HEADINGS[manifest.license];
  if (!heading) return fail(`${rel} license "${manifest.license}" has no known LICENSE text to check against`);
  if (!heading.test(fs.readFileSync(licenseFile, 'utf8').slice(0, 300))) fail(`root LICENSE is not the ${manifest.license} text`);
}

function checkMcp(plugin, manifest) {
  const file = resolveInside(plugin.root, manifest.mcpServers || '', 'mcpServers');
  if (!file) return;
  const servers = JSON.parse(fs.readFileSync(file, 'utf8')).mcpServers || {};
  const server = servers.wiremock;
  if (!server || Object.keys(servers).length !== 1) return fail(`${plugin.root}: mcp.json must declare exactly one server, "wiremock"`);
  if (plugin.backend === 'remote' && (server.type !== 'http' || server.url !== ENDPOINT)) {
    fail(`${plugin.root}: wiremock server must be type http at ${ENDPOINT}`);
  }
  if (plugin.backend === 'local' && (server.type !== 'stdio' || server.command !== 'wiremock' || JSON.stringify(server.args) !== '["mcp"]')) {
    fail(`${plugin.root}: wiremock server must run \`wiremock mcp\` over stdio`);
  }
}

function checkSkills(plugin, manifest) {
  const skillsDir = resolveInside(plugin.root, manifest.skills || '', 'skills');
  if (!skillsDir) return;
  const skills = fs.readdirSync(skillsDir, { withFileTypes: true }).filter(e => e.isDirectory() && !NON_SKILL_DIRS.has(e.name));
  if (skills.length !== EXPECTED_SKILLS) fail(`${plugin.root}: expected ${EXPECTED_SKILLS} skills, found ${skills.length}`);
  for (const skill of skills) {
    const rel = `${plugin.root}/skills/${skill.name}/SKILL.md`;
    const file = path.join(skillsDir, skill.name, 'SKILL.md');
    if (!fs.existsSync(file)) {
      fail(`${rel} is missing`);
      continue;
    }
    const content = fs.readFileSync(file, 'utf8');
    const frontmatter = /^---\n([\s\S]*?)\n---\n/.exec(content)?.[1];
    if (!frontmatter) {
      fail(`${rel} has no frontmatter`);
      continue;
    }
    if (/^name:\s*(.+)$/m.exec(frontmatter)?.[1].trim() !== skill.name) fail(`${rel} frontmatter name doesn't match its folder`);
    if (!/^description:/m.test(frontmatter)) fail(`${rel} frontmatter has no description`);
    for (const key of ['allowed-tools', 'model']) {
      if (new RegExp(`^${key}:`, 'm').test(frontmatter)) fail(`${rel} has Claude-only "${key}" frontmatter`);
    }
    if (content.includes('${CLAUDE_SKILL_DIR}')) fail(`${rel} references Claude-only \${CLAUDE_SKILL_DIR}`);
  }
}

function main() {
  const marketplaceRel = '.cursor-plugin/marketplace.json';
  const marketplace = readJson(marketplaceRel);
  if (marketplace) {
    checkSchema(validateMarketplace, marketplace, marketplaceRel);
    const entries = (marketplace.plugins || []).map(p => `${p.name} → ${p.source}`);
    const expected = PLUGINS.map(p => `${p.name} → ./${p.root}`);
    if (JSON.stringify(entries) !== JSON.stringify(expected)) fail(`${marketplaceRel} plugins must be ${expected.join(', ')}; got ${entries.join(', ')}`);
  }

  for (const plugin of PLUGINS) {
    const rel = `${plugin.root}/.cursor-plugin/plugin.json`;
    const manifest = readJson(rel);
    if (!manifest) continue;
    checkSchema(validatePlugin, manifest, rel);
    if (manifest.name !== plugin.name) fail(`${rel} name must be "${plugin.name}"`);
    if (manifest.version !== PACKAGE.version) fail(`${rel} version ${manifest.version} doesn't match package.json ${PACKAGE.version}`);
    checkLicense(manifest, rel);
    if (manifest.logo) resolveInside(plugin.root, manifest.logo, 'logo');
    else fail(`${rel} has no logo`);
    checkMcp(plugin, manifest);
    checkSkills(plugin, manifest);
  }

  if (errors.length > 0) {
    console.error(`❌ Cursor plugins: ${errors.length} problem(s)\n${errors.map(e => `   - ${e}`).join('\n')}`);
    process.exit(1);
  }
  console.log(`✅ Cursor plugins valid (${PLUGINS.map(p => p.root).join(', ')} + marketplace, official schema)`);
}

main();
