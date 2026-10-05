#!/usr/bin/env node

/**
 * Validates the Cursor Marketplace plugins (cursor/ and cursor-local/) and the repository
 * marketplace (.cursor-plugin/marketplace.json):
 *   - manifests and marketplace against the pinned official Cursor schemas (scripts/schemas/)
 *   - stable names and sources, version/license matching package.json and the root LICENSE
 *   - logo, skills and MCP paths resolving inside each plugin root
 *   - the shared MCP and skill checks (scripts/utils/plugin-checks.mjs)
 *
 * Usage: node scripts/validate-cursor-plugins.mjs
 */

import fs from 'fs';
import path from 'path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { ROOT, PACKAGE, readJson, resolveInside, checkMcp, checkSkills, report } from './utils/plugin-checks.mjs';

const SCHEMAS_DIR = path.join(ROOT, 'scripts', 'schemas');
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

function checkSchema(validate, data, rel) {
  if (!validate(data)) {
    for (const e of validate.errors) fail(`${rel}${e.instancePath || ''} ${e.message} (official Cursor schema)`);
  }
}

function checkLicense(manifest, rel) {
  if (manifest.license !== PACKAGE.license) fail(`${rel} license "${manifest.license}" doesn't match package.json "${PACKAGE.license}"`);
  const licenseFile = path.join(ROOT, 'LICENSE');
  if (!fs.existsSync(licenseFile)) return fail('root LICENSE is missing');
  const heading = LICENSE_HEADINGS[manifest.license];
  if (!heading) return fail(`${rel} license "${manifest.license}" has no known LICENSE text to check against`);
  if (!heading.test(fs.readFileSync(licenseFile, 'utf8').slice(0, 300))) fail(`root LICENSE is not the ${manifest.license} text`);
}

const marketplaceRel = '.cursor-plugin/marketplace.json';
const marketplace = readJson(marketplaceRel, fail);
if (marketplace) {
  checkSchema(validateMarketplace, marketplace, marketplaceRel);
  const entries = (marketplace.plugins || []).map(p => `${p.name} → ${p.source}`);
  const expected = PLUGINS.map(p => `${p.name} → ./${p.root}`);
  if (JSON.stringify(entries) !== JSON.stringify(expected)) fail(`${marketplaceRel} plugins must be ${expected.join(', ')}; got ${entries.join(', ')}`);
}

for (const plugin of PLUGINS) {
  const rel = `${plugin.root}/.cursor-plugin/plugin.json`;
  const manifest = readJson(rel, fail);
  if (!manifest) continue;
  checkSchema(validatePlugin, manifest, rel);
  if (manifest.name !== plugin.name) fail(`${rel} name must be "${plugin.name}"`);
  if (manifest.version !== PACKAGE.version) fail(`${rel} version ${manifest.version} doesn't match package.json ${PACKAGE.version}`);
  checkLicense(manifest, rel);
  if (manifest.logo) resolveInside(plugin.root, manifest.logo, 'logo', fail);
  else fail(`${rel} has no logo`);
  checkMcp(plugin.root, plugin.backend, manifest.mcpServers, fail);
  checkSkills(plugin.root, manifest.skills, fail);
}

report('Cursor plugins', errors, `Cursor plugins valid (${PLUGINS.map(p => p.root).join(', ')} + marketplace, official schema)`);
