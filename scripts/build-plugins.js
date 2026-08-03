#!/usr/bin/env node

/**
 * Builds the wiremock-cloud (remote MCP) and wiremock-cloud-local (local MCP) plugins
 * from the shared source in common/skills/, applying each variant's tool-prefix token
 * and resolving `# @variant:<name>` ... `# @endvariant` blocks.
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

class BuildError extends Error {
  constructor(filePath, variantName, message) {
    super(`${filePath}${variantName ? ` [${variantName}]` : ''}: ${message}`);
  }
}

// ============================================================================
// VARIANT LOADING
// ============================================================================

/**
 * Load every variant under variants/<name>/ (config.json + mcp.json)
 * @returns {Array<{name: string, pluginName: string, toolPrefix: string, outputRootAbs: string, mcpJsonPath: string}>}
 */
function loadVariants() {
  const names = fs.readdirSync(VARIANTS_DIR, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort();

  return names.map(name => {
    const dir = path.join(VARIANTS_DIR, name);
    const configPath = path.join(dir, 'config.json');
    const mcpJsonPath = path.join(dir, 'mcp.json');

    if (!fs.existsSync(configPath)) {
      throw new BuildError(configPath, name, 'missing config.json');
    }
    if (!fs.existsSync(mcpJsonPath)) {
      throw new BuildError(mcpJsonPath, name, 'missing mcp.json');
    }

    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    for (const field of ['pluginName', 'toolPrefix', 'outputRoot']) {
      if (!config[field]) {
        throw new BuildError(configPath, name, `missing required field "${field}"`);
      }
    }

    return {
      name,
      pluginName: config.pluginName,
      toolPrefix: config.toolPrefix,
      outputRootAbs: path.join(ROOT, config.outputRoot),
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
 * Resolve every `# @variant:...` / `# @endvariant` block to the content for one variant
 */
function resolveVariantBlocks(content, variantName, filePath) {
  return content.replace(VARIANT_GROUP_RE, (block) => {
    const sections = splitIntoNamedSections(block);
    if (!(variantName in sections)) {
      throw new BuildError(filePath, variantName, `no "# @variant:${variantName}" section in a variant block (found: ${Object.keys(sections).join(', ') || 'none'})`);
    }
    const resolved = sections[variantName];
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

function assertNoLeftoverMarkers(content, filePath, variantName) {
  if (/\{\{[A-Z0-9_]+\}\}/.test(content)) {
    throw new BuildError(filePath, variantName, 'unresolved {{TOKEN}} remains after build');
  }
  if (/# @variant:|# @endvariant/.test(content)) {
    throw new BuildError(filePath, variantName, 'unresolved/orphan @variant marker remains after build');
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
  content = resolveVariantBlocks(content, variant.name, srcPath);
  content = substituteTokens(content, variant, srcPath);
  assertNoLeftoverMarkers(content, destPath, variant.name);

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

  const mcpDest = path.join(variant.outputRootAbs, '.mcp.json');
  ensureDir(path.dirname(mcpDest));
  fs.copyFileSync(variant.mcpJsonPath, mcpDest);

  console.log(`   ✓ ${variant.pluginName} → ${path.relative(ROOT, variant.outputRootAbs) || '.'}`);
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

  console.log('');
  console.log(`✅ Built ${variants.length} plugin variant(s): ${variants.map(v => v.pluginName).join(', ')}`);
}

try {
  main();
} catch (error) {
  console.error(`❌ Build failed: ${error.message}`);
  process.exit(1);
}
