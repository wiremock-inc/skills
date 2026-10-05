#!/usr/bin/env node

/**
 * Builds installable plugins from the shared source in common/skills/, applying each
 * variant's tool-prefix token and resolving `# @variant:<name>` ... `# @endvariant` blocks.
 *
 * Three kinds of variant:
 *   - "claude-plugin"  (default): the existing wiremock-cloud / wiremock-cloud-local
 *     Claude Code plugins — skill frontmatter (incl. `allowed-tools`, `model`) is passed
 *     through untouched. Each is a self-contained plugin folder (the Claude directory
 *     submits one folder at a time): `.claude-plugin/plugin.json`, the variant's README.md,
 *     and the shared LICENSE / assets/icon.* when present, aggregated into the root
 *     `.claude-plugin/marketplace.json` by name/source only.
 *   - "open-standard": portable plugins for Cursor / Codex CLI / GitHub Copilot, built from
 *     the same source but with Claude-only frontmatter (`allowed-tools`, `model`) and the
 *     Claude-only `${CLAUDE_SKILL_DIR}` env var stripped, since neither is part of the open
 *     Agent Skills standard those tools share. Each also gets a per-tool `plugin.json`
 *     manifest, and all variants sharing a `target` are aggregated into that tool's
 *     `marketplace.json`.
 *   - "standalone": a bare, unwrapped `skills/` tree (same portable transform as
 *     "open-standard", no plugin.json/marketplace) for dropping into any agent that reads
 *     the open Agent Skills format directly but that we don't build a dedicated plugin for.
 */

const fs = require('fs');
const path = require('path');

const { ensureDir } = require('./utils/docs-utils');
const { findExampleSecrets } = require('./utils/example-secrets');

// ============================================================================
// CONFIGURATION
// ============================================================================

const ROOT = path.join(__dirname, '..');
const COMMON_SKILLS_DIR = path.join(ROOT, 'common', 'skills');
const VARIANTS_DIR = path.join(ROOT, 'variants');
// Top-level folders a variant's outputRoot may never be, since the build deletes it wholesale.
const RESERVED_ROOTS = new Set(['common', 'variants', 'scripts', 'node_modules', 'todos', 'assets']);
const PACKAGE = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));

// Copied into each Claude plugin root when present: the license is shared by every plugin,
// the icon is the directory-listing icon referenced from plugin.json.
const CLAUDE_SHARED_FILES = [
  { from: path.join(ROOT, 'LICENSE'), to: 'LICENSE' },
  { from: path.join(ROOT, 'assets', 'icon.svg'), to: 'icon.svg', manifestKey: 'icon' },
  { from: path.join(ROOT, 'assets', 'icon.png'), to: 'icon.png', manifestKey: 'icon' }
];

const TEXT_EXTENSIONS = new Set(['.md', '.json', '.yaml', '.yml', '.py', '.sh']);

const TOKEN_RE = /\{\{([A-Z0-9_]+)\}\}/g;
const VARIANT_GROUP_RE = /^[ \t]*# @variant:\S[^\n]*\n[\s\S]*?^[ \t]*# @endvariant[^\n]*\n?/gm;
const VARIANT_SECTION_RE = /^[ \t]*# @variant:(\S+)/;

const GENERATED_BANNER =
  '<!-- AUTO-GENERATED from common/skills/... — do not edit directly; edit the source and run `npm run build`. -->\n';

// Per-target conventions: `claude` for the "claude-plugin" kind, the rest for "open-standard".
// `mcpOutputPath` and
// `manifestRelPath` are relative to the variant's own outputRoot; `marketplacePath` is
// relative to the repo root and shared by every variant with that target.
const TARGET_DEFAULTS = {
  // Claude Code plugins. Directory-listing fields (icon, privacyPolicyUrl, ...) are only valid
  // in plugin.json, so the marketplace entry carries nothing but name/description/source;
  // skills/ and .mcp.json sit at their default locations and need no manifest key.
  claude: {
    manifestRelPath: path.join('.claude-plugin', 'plugin.json'),
    mcpOutputPath: '.mcp.json',
    marketplacePath: path.join(ROOT, '.claude-plugin', 'marketplace.json'),
    buildManifest: (v, extras) => ({
      name: v.pluginName,
      displayName: v.displayName,
      version: PACKAGE.version,
      description: v.description,
      author: { name: MARKETPLACE_OWNER.name, email: MARKETPLACE_OWNER.email, url: 'https://www.wiremock.io' },
      homepage: 'https://docs.wiremock.io',
      repository: 'https://github.com/wiremock-inc/skills',
      license: PACKAGE.license,
      keywords: ['wiremock', 'api-mocking', 'api-simulation', 'mcp', 'testing'],
      icon: extras.icon,
      documentationUrl: 'https://docs.wiremock.io',
      supportUrl: 'https://www.wiremock.io/contact-now',
      privacyPolicyUrl: 'https://www.wiremock.io/privacy-policy'
    }),
    buildMarketplace: (entries) => ({
      name: MARKETPLACE_NAME,
      owner: MARKETPLACE_OWNER,
      // Claude Code pins installs to plugin.json's version, so the marketplace reports the same one
      metadata: { ...MARKETPLACE_METADATA, version: PACKAGE.version },
      plugins: entries.map(e => ({ name: e.pluginName, description: e.description, source: `./${e.outputRoot}` }))
    })
  },
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

// Kinds whose skill content gets the portable transform (Claude-only frontmatter/env var
// stripped) because they're not Claude Code plugins.
const PORTABLE_KINDS = new Set(['open-standard', 'standalone']);

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

  // Each build wipes every variant's whole outputRoot, so it must be its own top-level folder:
  // never the repo root, a source folder, outside the repo, or shared with another variant.
  const outputRoots = new Map();
  for (const [name, config] of configs) {
    const outputRoot = config.outputRoot;
    if (typeof outputRoot !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(outputRoot) || RESERVED_ROOTS.has(outputRoot)) {
      throw new BuildError(path.join(VARIANTS_DIR, name, 'config.json'), name, `"outputRoot" must be a single non-reserved top-level folder name, got ${JSON.stringify(outputRoot)}`);
    }
    if (outputRoots.has(outputRoot)) {
      throw new BuildError(path.join(VARIANTS_DIR, name, 'config.json'), name, `"outputRoot" "${outputRoot}" is also used by variant "${outputRoots.get(outputRoot)}"`);
    }
    outputRoots.set(outputRoot, name);
  }

  return names.map(name => {
    const config = configs.get(name);
    const kind = config.kind || 'claude-plugin';

    for (const field of ['pluginName', 'outputRoot']) {
      if (!config[field]) {
        throw new BuildError(path.join(VARIANTS_DIR, name, 'config.json'), name, `missing required field "${field}"`);
      }
    }
    if (kind === 'claude-plugin') {
      for (const field of ['toolPrefix', 'displayName', 'description']) {
        if (!config[field]) {
          throw new BuildError(path.join(VARIANTS_DIR, name, 'config.json'), name, `missing required field "${field}"`);
        }
      }
      if (config.target !== 'claude') {
        throw new BuildError(path.join(VARIANTS_DIR, name, 'config.json'), name, '"target" must be "claude" for claude-plugin variants');
      }
      if (!fs.existsSync(path.join(VARIANTS_DIR, name, 'README.md'))) {
        throw new BuildError(path.join(VARIANTS_DIR, name, 'README.md'), name, 'missing README.md (copied to the plugin root)');
      }
    }
    if (kind !== 'claude-plugin' && config.target === 'claude') {
      throw new BuildError(path.join(VARIANTS_DIR, name, 'config.json'), name, '"target": "claude" is only valid for claude-plugin variants');
    }
    if (kind === 'open-standard' && !TARGET_DEFAULTS[config.target]) {
      throw new BuildError(path.join(VARIANTS_DIR, name, 'config.json'), name, `missing/unknown "target" (expected one of: ${Object.keys(TARGET_DEFAULTS).join(', ')})`);
    }
    if (config.backend !== 'remote' && config.backend !== 'local') {
      throw new BuildError(path.join(VARIANTS_DIR, name, 'config.json'), name, 'missing/invalid "backend" (must be "remote" or "local" — selects which `# @variant:` body block this variant resolves to)');
    }

    // "standalone" variants only need an mcp.json if they declare where to put one
    // (mcpDest) — e.g. the local-skills variant deliberately ships without one.
    const needsMcp = !(kind === 'standalone' && !config.mcpDest);

    let mcpJsonPath = null;
    if (needsMcp) {
      mcpJsonPath = path.join(VARIANTS_DIR, name, 'mcp.json');
      if (config.mcpSource) {
        if (!configs.has(config.mcpSource)) {
          throw new BuildError(path.join(VARIANTS_DIR, name, 'config.json'), name, `mcpSource "${config.mcpSource}" is not a known variant`);
        }
        mcpJsonPath = path.join(VARIANTS_DIR, config.mcpSource, 'mcp.json');
      }
      if (!fs.existsSync(mcpJsonPath)) {
        throw new BuildError(mcpJsonPath, name, 'missing mcp.json');
      }
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
      displayName: config.displayName,
      description: config.description,
      toolPrefix: config.toolPrefix,
      outputRootAbs: path.join(ROOT, config.outputRoot),
      outputRoot: config.outputRoot,
      mcpJsonPath,
      // Relative to ROOT — only set for "standalone" variants that want an mcp.json written
      // alongside their skills/ (see kind === 'standalone' handling in buildVariant).
      mcpDest: config.mcpDest || null
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
  if (PORTABLE_KINDS.has(variant.kind)) {
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
  if (PORTABLE_KINDS.has(variant.kind)) {
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

/**
 * Copy the plugin-root files a Claude plugin ships besides skills/ and .mcp.json: the variant's
 * own README.md, plus the shared LICENSE / icon when they exist.
 * @returns {Object<string, string>} manifest fields pointing at the copied files (e.g. icon)
 */
function writeClaudeRootFiles(variant) {
  fs.copyFileSync(path.join(VARIANTS_DIR, variant.name, 'README.md'), path.join(variant.outputRootAbs, 'README.md'));

  const extras = {};
  for (const { from, to, manifestKey } of CLAUDE_SHARED_FILES) {
    if (!fs.existsSync(from)) continue;
    if (manifestKey && extras[manifestKey]) {
      throw new BuildError(from, variant.name, `more than one file provides "${manifestKey}"`);
    }
    fs.copyFileSync(from, path.join(variant.outputRootAbs, to));
    if (manifestKey) extras[manifestKey] = `./${to}`;
  }
  return extras;
}

/**
 * Fail before any output is touched if a source file still carries a credential-like example
 * value (normally redacted at docs-sync time — see scripts/utils/example-secrets.js).
 */
function assertNoExampleSecrets(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const srcPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      assertNoExampleSecrets(srcPath);
    } else if (isTextFile(srcPath)) {
      const secrets = findExampleSecrets(fs.readFileSync(srcPath, 'utf8'));
      if (secrets.length > 0) {
        throw new BuildError(srcPath, null, `credential-like example value(s) must be placeholders: ${secrets.join(' | ')}`);
      }
    }
  }
}

function buildVariant(variant) {
  // "standalone" variants ARE a bare skills/ tree — no nested skills/ subfolder, no
  // plugin.json, no marketplace entry.
  // Every output root is fully generated, so clear the whole thing: a file dropped from the
  // build (or renamed) must not linger in the published plugin.
  fs.rmSync(variant.outputRootAbs, { recursive: true, force: true });

  const outSkillsDir = variant.kind === 'standalone'
    ? variant.outputRootAbs
    : path.join(variant.outputRootAbs, 'skills');
  copyTree(COMMON_SKILLS_DIR, outSkillsDir, variant);

  if (variant.kind === 'claude-plugin' || variant.kind === 'open-standard') {
    const mcpDescriptor = fs.readFileSync(variant.mcpJsonPath, 'utf8');
    const targetDefaults = TARGET_DEFAULTS[variant.target];

    const mcpDest = path.join(variant.outputRootAbs, targetDefaults.mcpOutputPath);
    ensureDir(path.dirname(mcpDest));
    fs.writeFileSync(mcpDest, mcpDescriptor, 'utf8');

    const extras = variant.kind === 'claude-plugin' ? writeClaudeRootFiles(variant) : {};

    const manifestDest = path.join(variant.outputRootAbs, targetDefaults.manifestRelPath);
    ensureDir(path.dirname(manifestDest));
    fs.writeFileSync(manifestDest, JSON.stringify(targetDefaults.buildManifest(variant, extras), null, 2) + '\n', 'utf8');
  } else if (variant.mcpDest) {
    const mcpDescriptor = fs.readFileSync(variant.mcpJsonPath, 'utf8');
    const mcpDest = path.join(ROOT, variant.mcpDest);
    ensureDir(path.dirname(mcpDest));
    fs.writeFileSync(mcpDest, mcpDescriptor, 'utf8');
  }

  console.log(`   ✓ ${variant.pluginName} → ${path.relative(ROOT, variant.outputRootAbs) || '.'}`);
}

function writeMarketplaces(variants) {
  const pluginVariants = variants.filter(v => v.kind === 'claude-plugin' || v.kind === 'open-standard');
  const byTarget = new Map();
  for (const variant of pluginVariants) {
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

  assertNoExampleSecrets(COMMON_SKILLS_DIR);
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
