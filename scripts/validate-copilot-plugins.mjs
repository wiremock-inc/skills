#!/usr/bin/env node

/**
 * Validates the GitHub Copilot plugins (copilot/ and copilot-local/) and the repository marketplace
 * (.github/plugin/marketplace.json).
 *
 * These use Copilot's legacy plugin manifest format, for which GitHub publishes field documentation
 * but no JSON schema, so this is a structural check rather than schema validation: stable names and
 * sources, versions matching package.json, skills/MCP paths resolving inside each plugin root, and
 * the shared MCP and skill checks (scripts/utils/plugin-checks.mjs).
 *
 * Usage: node scripts/validate-copilot-plugins.mjs
 */

import { PACKAGE, readJson, checkMcp, checkSkills, report } from './utils/plugin-checks.mjs';

const PLUGINS = [
  { name: 'wiremock-cloud', root: 'copilot', backend: 'remote' },
  { name: 'wiremock-cloud-local', root: 'copilot-local', backend: 'local' }
];

const errors = [];
const fail = (message) => errors.push(message);

const marketplaceRel = '.github/plugin/marketplace.json';
const marketplace = readJson(marketplaceRel, fail);
if (marketplace) {
  if (marketplace.metadata?.version !== PACKAGE.version) fail(`${marketplaceRel} metadata.version ${marketplace.metadata?.version} doesn't match package.json ${PACKAGE.version}`);
  const entries = (marketplace.plugins || []).map(p => `${p.name} → ${p.source}`);
  const expected = PLUGINS.map(p => `${p.name} → ./${p.root}`);
  if (JSON.stringify(entries) !== JSON.stringify(expected)) fail(`${marketplaceRel} plugins must be ${expected.join(', ')}; got ${entries.join(', ')}`);
  for (const entry of marketplace.plugins || []) {
    if (entry.version !== PACKAGE.version) fail(`${marketplaceRel} ${entry.name} version ${entry.version} doesn't match package.json ${PACKAGE.version}`);
  }
}

for (const plugin of PLUGINS) {
  const rel = `${plugin.root}/plugin.json`;
  const manifest = readJson(rel, fail);
  if (!manifest) continue;
  if (manifest.name !== plugin.name) fail(`${rel} name must be "${plugin.name}"`);
  if (manifest.version !== PACKAGE.version) fail(`${rel} version ${manifest.version} doesn't match package.json ${PACKAGE.version}`);
  checkMcp(plugin.root, plugin.backend, manifest.mcpServers, fail);
  checkSkills(plugin.root, manifest.skills, fail);
}

report('Copilot plugins', errors, `Copilot plugins valid (${PLUGINS.map(p => p.root).join(', ')} + marketplace; structural, no official schema)`);
