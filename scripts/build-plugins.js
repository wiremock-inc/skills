#!/usr/bin/env node

/**
 * Builds installable plugins from the shared source in common/skills/, applying each
 * variant's tool-prefix token and resolving `# @variant:<name>` ... `# @endvariant` blocks.
 *
 * Two kinds of variant:
 *   - "claude-plugin"  (default): the existing wiremock-cloud / wiremock-cloud-local
 *     Claude Code plugins — skill frontmatter (incl. `allowed-tools`, `model`) is passed
 *     through untouched.
 *   - "open-standard": portable plugins for Cursor / Codex CLI / GitHub Copilot, built from
 *     the same source but with Claude-only frontmatter (`allowed-tools`, `model`) and the
 *     Claude-only `${CLAUDE_SKILL_DIR}` env var stripped, since neither is part of the open
 *     Agent Skills standard those tools share. Each also gets a per-tool `plugin.json`
 *     manifest, and all variants sharing a `target` are aggregated into that tool's
 *     `marketplace.json`.
 */

const fs = require('fs');
const path = require('path');

const { ensureDir } = require('./utils/docs-utils');

// ============================================================================
// CONFIGURATION
// ============================================================================

const ROOT = path.join(__dirname, '..');
const COMMON_SKILLS_DIR = path.join(ROOT, 'common', 'skills');
const VARIANTS_DIR = path.join(ROOT, 'variants');

const TEXT_EXTENSIONS = new Set(['.md', '.json', '.yaml', '.yml', '.py', '.sh']);

const TOKEN_RE = /\{\{([A-Z0-9_]+)\}\}/g;
const VARIANT_GROUP_RE = /^[ \t]*# @variant:\S[^\n]*\n[\s\S]*?^[ \t]*# @endvariant[^\n]*\n?/gm;
const VARIANT_SECTION_RE = /^[ \t]*# @variant:(\S+)/;

const GENERATED_BANNER =
  '<!-- AUTO-GENERATED from common/skills/... — do not edit directly; edit the source and run `npm run build`. -->\n';

// Per-target conventions for the "open-standard" plugin kind. `mcpOutputPath` and
// `manifestRelPath` are relative to the variant's own outputRoot; `marketplacePath` is
// relative to the repo root and shared by every variant with that target.
const TARGET_DEFAULTS = {
  cursor: {
    manifestRelPath: path.join('.cursor-plugin', 'plugin.json'),
    mcpOutputPath: 'mcp.json',
    marketplacePath: path.join(ROOT, '.cursor-plugin', 'marketplace.json'),
    buildManifest: (v) => ({ name: v.pluginName, description: v.description, version: '1.0.0' }),
    buildMarketplace: (entries) => ({
      name: MARKETPLACE_NAME,
      owner: MARKETPLACE_OWNER,
      metadata: MARKETPLACE_METADATA,
      plugins: entries.map(e => ({ name: e.pluginName, description: e.description, version: '1.0.0', source: `./${e.outputRoot}` }))
    })
  },
  codex: {
    manifestRelPath: path.join('.codex-plugin', 'plugin.json'),
    mcpOutputPath: '.mcp.json',
    marketplacePath: path.join(ROOT, '.agents', 'plugins', 'marketplace.json'),
    buildManifest: (v) => ({
      name: v.pluginName,
      version: '1.0.0',
      description: v.description,
      skills: './skills',
      mcpServers: './.mcp.json'
    }),
    buildMarketplace: (entries) => ({
      name: MARKETPLACE_NAME,
      interface: { displayName: 'WireMock Cloud' },
      plugins: entries.map(e => ({
        name: e.pluginName,
        description: e.description,
        version: '1.0.0',
        source: { source: 'local', path: `./${e.outputRoot}` },
        category: 'Productivity'
      }))
    })
  },
  copilot: {
    manifestRelPath: 'plugin.json',
    mcpOutputPath: '.mcp.json',
    marketplacePath: path.join(ROOT, '.github', 'plugin', 'marketplace.json'),
    buildManifest: (v) => ({ name: v.pluginName, description: v.description, version: '1.0.0', skills: 'skills/', mcpServers: '.mcp.json' }),
    buildMarketplace: (entries) => ({
      name: MARKETPLACE_NAME,
      owner: MARKETPLACE_OWNER,
      metadata: MARKETPLACE_METADATA,
      plugins: entries.map(e => ({ name: e.pluginName, description: e.description, version: '1.0.0', source: `./${e.outputRoot}` }))
    })
  }
};

const MARKETPLACE_NAME = 'wiremock-inc-skills';
const MARKETPLACE_OWNER = { name: 'WireMock Inc', email: 'info@wiremock.io' };
const MARKETPLACE_METADATA = { description: 'Agent skills for API simulation and testing with WireMock Cloud', version: '1.0.0' };

class BuildError extends Error {
  constructor(filePath, variantName, message) {
    super(`${filePath}${variantName ? ` [${variantName}]` : ''}: ${message}`);
  }
}

// ============================================================================
// VARIANT LOADING
// ============================================================================

/**
 * Load every variant under variants/<name>/ (config.json + mcp.json, or config.json alone
 * with `mcpSource` pointing at another variant's mcp.json).
 */
function loadVariants() {
  const names = fs.readdirSync(VARIANTS_DIR, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort();

  const configs = new Map();
  for (const name of names) {
    const configPath = path.join(VARIANTS_DIR, name, 'config.json');
    if (!fs.existsSync(configPath)) {
      throw new BuildError(configPath, name, 'missing config.json');
    }
    configs.set(name, JSON.parse(fs.readFileSync(configPath, 'utf8')));
  }

  return names.map(name => {
    const config = configs.get(name);
    const kind = config.kind || 'claude-plugin';

    for (const field of ['pluginName', 'outputRoot']) {
      if (!config[field]) {
        throw new BuildError(path.join(VARIANTS_DIR, name, 'config.json'), name, `missing required field "${field}"`);
      }
    }
    if (kind === 'claude-plugin' && !config.toolPrefix) {
      throw new BuildError(path.join(VARIANTS_DIR, name, 'config.json'), name, 'missing required field "toolPrefix"');
    }
    if (kind === 'open-standard' && !TARGET_DEFAULTS[config.target]) {
      throw new BuildError(path.join(VARIANTS_DIR, name, 'config.json'), name, `missing/unknown "target" (expected one of: ${Object.keys(TARGET_DEFAULTS).join(', ')})`);
    }
    if (config.backend !== 'remote' && config.backend !== 'local') {
      throw new BuildError(path.join(VARIANTS_DIR, name, 'config.json'), name, 'missing/invalid "backend" (must be "remote" or "local" — selects which `# @variant:` body block this variant resolves to)');
    }

    let mcpJsonPath = path.join(VARIANTS_DIR, name, 'mcp.json');
    if (config.mcpSource) {
      if (!configs.has(config.mcpSource)) {
        throw new BuildError(path.join(VARIANTS_DIR, name, 'config.json'), name, `mcpSource "${config.mcpSource}" is not a known variant`);
      }
      mcpJsonPath = path.join(VARIANTS_DIR, config.mcpSource, 'mcp.json');
    }
    if (!fs.existsSync(mcpJsonPath)) {
      throw new BuildError(mcpJsonPath, name, 'missing mcp.json');
    }

    return {
      name,
      kind,
      target: config.target,
      // The `# @variant:remote` / `# @variant:local` blocks in common/skills/ are keyed by
      // MCP backend, not by tool or variant/directory name — resolved from the explicit
      // `backend` field.
      backend: config.backend,
      pluginName: config.pluginName,
      description: config.description,
      toolPrefix: config.toolPrefix,
      outputRootAbs: path.join(ROOT, config.outputRoot),
      outputRoot: config.outputRoot,
      mcpJsonPath
    };
  });
}

// ============================================================================
// TEMPLATE PROCESSING
// ============================================================================

function isTextFile(filePath) {
  return TEXT_EXTENSIONS.has(path.extname(filePath));
}

/**
 * Split a `# @variant:x ... # @variant:y ... # @endvariant` block into named sections
 * @param {string} block
 * @returns {Object<string, string>}
 */
function splitIntoNamedSections(block) {
  const lines = block.split('\n');
  const sections = {};
  let currentName = null;
  let currentLines = [];

  const flush = () => {
    if (currentName !== null) {
      sections[currentName] = currentLines.join('\n');
    }
  };

  for (const line of lines) {
    const match = line.match(VARIANT_SECTION_RE);
    if (match) {
      flush();
      currentName = match[1];
      currentLines = [];
    } else if (/^[ \t]*# @endvariant/.test(line)) {
      flush();
      currentName = null;
      currentLines = [];
    } else if (currentName !== null) {
      currentLines.push(line);
    }
  }

  return sections;
}

/**
 * Resolve every `# @variant:...` / `# @endvariant` block to the content for one backend
 * (the blocks are keyed by MCP backend — "remote" / "local" — not by tool/variant name)
 */
function resolveVariantBlocks(content, backend, filePath) {
  return content.replace(VARIANT_GROUP_RE, (block) => {
    const sections = splitIntoNamedSections(block);
    if (!(backend in sections)) {
      throw new BuildError(filePath, backend, `no "# @variant:${backend}" section in a variant block (found: ${Object.keys(sections).join(', ') || 'none'})`);
    }
    const resolved = sections[backend];
    // Trim exactly one trailing blank line so resolved output doesn't accumulate gaps
    return resolved.replace(/\n$/, '') + '\n';
  });
}

/**
 * Substitute {{TOKEN}} placeholders for the given variant
 */
function substituteTokens(content, variant, filePath) {
  return content.replace(TOKEN_RE, (match, name) => {
    if (name === 'WIREMOCK_TOOL_PREFIX') return variant.toolPrefix;
    throw new BuildError(filePath, variant.name, `unknown token {{${name}}}`);
  });
}

/**
 * Remove a top-level frontmatter key and any indented continuation lines that follow it
 * (e.g. a `key:\n  - ...` YAML block, or a plain `key: value` scalar line).
 */
function stripFrontmatterKey(content, key) {
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!fmMatch) return content;

  const lines = fmMatch[1].split('\n');
  const keyLineRe = new RegExp(`^${key}:`);
  const outLines = [];
  let skipping = false;
  for (const line of lines) {
    if (skipping) {
      if (/^[ \t]/.test(line)) continue;
      skipping = false;
    }
    if (keyLineRe.test(line)) {
      skipping = true;
      continue;
    }
    outLines.push(line);
  }

  const newFrontmatter = `---\n${outLines.join('\n')}\n---\n`;
  return content.slice(0, fmMatch.index) + newFrontmatter + content.slice(fmMatch.index + fmMatch[0].length);
}

/**
 * `${CLAUDE_SKILL_DIR}/scripts/x.py` -> `scripts/x.py` — the open Agent Skills standard
 * expects agents to resolve relative paths against the skill's own directory rather than
 * via a Claude-Code-only env var.
 */
function stripSkillDirVar(content) {
  return content.replace(/\$\{CLAUDE_SKILL_DIR\}\//g, '');
}

function applyOpenStandardTransform(content) {
  content = stripFrontmatterKey(content, 'allowed-tools');
  content = stripFrontmatterKey(content, 'model');
  content = stripSkillDirVar(content);
  return content;
}

function assertNoLeftoverMarkers(content, filePath, variant) {
  if (/\{\{[A-Z0-9_]+\}\}/.test(content)) {
    throw new BuildError(filePath, variant.name, 'unresolved {{TOKEN}} remains after build');
  }
  if (/# @variant:|# @endvariant/.test(content)) {
    throw new BuildError(filePath, variant.name, 'unresolved/orphan @variant marker remains after build');
  }
  if (variant.kind === 'open-standard') {
    if (/^allowed-tools:/m.test(content)) {
      throw new BuildError(filePath, variant.name, 'allowed-tools frontmatter survived the open-standard transform');
    }
    if (/^model:/m.test(content)) {
      throw new BuildError(filePath, variant.name, 'model frontmatter survived the open-standard transform');
    }
    if (content.includes('${CLAUDE_SKILL_DIR}')) {
      throw new BuildError(filePath, variant.name, '${CLAUDE_SKILL_DIR} survived the open-standard transform');
    }
  }
}

/**
 * Insert the generated-file banner right after frontmatter (or at the top for files with none)
 */
function insertGeneratedBanner(content) {
  if (content.startsWith('---\n')) {
    const closingIndex = content.indexOf('\n---\n', 4);
    if (closingIndex !== -1) {
      const splitAt = closingIndex + '\n---\n'.length;
      return content.slice(0, splitAt) + '\n' + GENERATED_BANNER + content.slice(splitAt);
    }
  }
  return GENERATED_BANNER + '\n' + content;
}

function processFile(srcPath, destPath, variant) {
  if (!isTextFile(srcPath)) {
    ensureDir(path.dirname(destPath));
    fs.copyFileSync(srcPath, destPath);
    return;
  }

  let content = fs.readFileSync(srcPath, 'utf8');
  if (variant.kind === 'open-standard') {
    content = applyOpenStandardTransform(content);
  }
  content = resolveVariantBlocks(content, variant.backend, srcPath);
  content = substituteTokens(content, variant, srcPath);
  assertNoLeftoverMarkers(content, destPath, variant);

  if (path.extname(srcPath) === '.md') {
    content = insertGeneratedBanner(content);
  }

  ensureDir(path.dirname(destPath));
  fs.writeFileSync(destPath, content, 'utf8');
}

function copyTree(srcDir, destDir, variant) {
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyTree(srcPath, destPath, variant);
    } else {
      processFile(srcPath, destPath, variant);
    }
  }
}

// ============================================================================
// MAIN
// ============================================================================

function buildVariant(variant) {
  const outSkillsDir = path.join(variant.outputRootAbs, 'skills');
  fs.rmSync(outSkillsDir, { recursive: true, force: true });
  copyTree(COMMON_SKILLS_DIR, outSkillsDir, variant);

  const mcpDescriptor = fs.readFileSync(variant.mcpJsonPath, 'utf8');

  if (variant.kind === 'claude-plugin') {
    const mcpDest = path.join(variant.outputRootAbs, '.mcp.json');
    ensureDir(path.dirname(mcpDest));
    fs.writeFileSync(mcpDest, mcpDescriptor, 'utf8');
  } else {
    const targetDefaults = TARGET_DEFAULTS[variant.target];

    const mcpDest = path.join(variant.outputRootAbs, targetDefaults.mcpOutputPath);
    ensureDir(path.dirname(mcpDest));
    fs.writeFileSync(mcpDest, mcpDescriptor, 'utf8');

    const manifestDest = path.join(variant.outputRootAbs, targetDefaults.manifestRelPath);
    ensureDir(path.dirname(manifestDest));
    fs.writeFileSync(manifestDest, JSON.stringify(targetDefaults.buildManifest(variant), null, 2) + '\n', 'utf8');
  }

  console.log(`   ✓ ${variant.pluginName} → ${path.relative(ROOT, variant.outputRootAbs) || '.'}`);
}

function writeMarketplaces(variants) {
  const openStandardVariants = variants.filter(v => v.kind === 'open-standard');
  const byTarget = new Map();
  for (const variant of openStandardVariants) {
    if (!byTarget.has(variant.target)) byTarget.set(variant.target, []);
    byTarget.get(variant.target).push(variant);
  }

  for (const [target, entries] of byTarget) {
    const targetDefaults = TARGET_DEFAULTS[target];
    const marketplace = targetDefaults.buildMarketplace(entries);
    ensureDir(path.dirname(targetDefaults.marketplacePath));
    fs.writeFileSync(targetDefaults.marketplacePath, JSON.stringify(marketplace, null, 2) + '\n', 'utf8');
    console.log(`   ✓ ${target} marketplace → ${path.relative(ROOT, targetDefaults.marketplacePath)}`);
  }
}

function main() {
  console.log('🔧 Building plugin variants from common/skills/...');
  console.log('');

  const variants = loadVariants();
  if (variants.length === 0) {
    console.error('❌ No variants found under variants/');
    process.exit(1);
  }

  for (const variant of variants) {
    buildVariant(variant);
  }
  writeMarketplaces(variants);

  console.log('');
  console.log(`✅ Built ${variants.length} plugin variant(s): ${variants.map(v => v.pluginName).join(', ')}`);
}

try {
  main();
} catch (error) {
  console.error(`❌ Build failed: ${error.message}`);
  process.exit(1);
}
