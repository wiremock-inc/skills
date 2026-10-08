/**
 * Checks shared by the per-marketplace plugin validators (validate-cursor-plugins.mjs,
 * validate-copilot-plugins.mjs): paths stay inside the plugin, the MCP server is the hosted HTTP
 * endpoint (remote) or `wiremock mcp` over stdio (local), and the plugin ships exactly the eight
 * skills with portable frontmatter.
 *
 * Each check reports problems through `fail(message)` rather than throwing, so a validator can
 * list every problem in one run.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const PACKAGE = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));

const ENDPOINT = 'https://mcp.wiremock.cloud/mcp';
const EXPECTED_SKILLS = 8;
// skills/references holds reference docs shared by several skills; it isn't a skill itself.
const NON_SKILL_DIRS = new Set(['references']);

/** Parse a repo-relative JSON file, reporting a missing or invalid file. */
export function readJson(rel, fail) {
  try {
    return JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
  } catch (error) {
    fail(`${rel}: ${error.code === 'ENOENT' ? 'missing' : `invalid JSON (${error.message})`}`);
    return null;
  }
}

/** Resolve `rel` against a plugin root; report (and return null) if it escapes the root or doesn't exist. */
export function resolveInside(pluginRoot, rel, label, fail) {
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

/** The plugin's MCP file declares exactly the `wiremock` server for its backend. */
export function checkMcp(pluginRoot, backend, mcpRel, fail) {
  const file = resolveInside(pluginRoot, mcpRel || '', 'mcpServers', fail);
  if (!file) return;
  const servers = JSON.parse(fs.readFileSync(file, 'utf8')).mcpServers || {};
  const server = servers.wiremock;
  if (!server || Object.keys(servers).length !== 1) return fail(`${pluginRoot}: ${mcpRel} must declare exactly one server, "wiremock"`);
  if (backend === 'remote' && (server.type !== 'http' || server.url !== ENDPOINT)) {
    fail(`${pluginRoot}: wiremock server must be type http at ${ENDPOINT}`);
  }
  if (backend === 'local' && (server.type !== 'stdio' || server.command !== 'wiremock' || JSON.stringify(server.args) !== '["mcp"]')) {
    fail(`${pluginRoot}: wiremock server must run \`wiremock mcp\` over stdio`);
  }
}

/** Exactly eight skills, each with matching name/description frontmatter and nothing Claude-only. */
export function checkSkills(pluginRoot, skillsRel, fail) {
  const skillsDir = resolveInside(pluginRoot, skillsRel || '', 'skills', fail);
  if (!skillsDir) return;
  const skills = fs.readdirSync(skillsDir, { withFileTypes: true }).filter(e => e.isDirectory() && !NON_SKILL_DIRS.has(e.name));
  if (skills.length !== EXPECTED_SKILLS) fail(`${pluginRoot}: expected ${EXPECTED_SKILLS} skills, found ${skills.length}`);
  for (const skill of skills) {
    const rel = `${pluginRoot}/skills/${skill.name}/SKILL.md`;
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

/** Print the outcome and exit non-zero if anything failed. */
export function report(label, errors, okMessage) {
  if (errors.length > 0) {
    console.error(`❌ ${label}: ${errors.length} problem(s)\n${errors.map(e => `   - ${e}`).join('\n')}`);
    process.exit(1);
  }
  console.log(`✅ ${okMessage}`);
}
