#!/usr/bin/env node

/**
 * Script to update WireMock Cloud skill documentation from docs.wiremock.io
 * Fetches llms.txt to discover documentation links and downloads all markdown files
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const {
  formatBytes,
  getDirectorySize,
  ensureDir,
  listSubdirectories
} = require('./utils/docs-utils');

// ============================================================================
// CONFIGURATION
// ============================================================================

const LLMS_TXT_URL = 'https://docs.wiremock.io/llms.txt';
const BASE_URL = 'https://docs.wiremock.io/';
const SKILL_DIR = path.join(__dirname, '..', 'skills', 'search-wiremock-cloud-docs');
const DOCS_DIR = path.join(SKILL_DIR, 'references');

// Concurrency limit for parallel downloads
const CONCURRENCY_LIMIT = 5;

// ============================================================================
// UTILITY FUNCTIONS (script-specific)
// ============================================================================

/**
 * Fetch content from a URL
 * @param {string} url - URL to fetch
 * @returns {Promise<string>} - Response body
 */
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        // Follow redirect
        fetchUrl(res.headers.location).then(resolve).catch(reject);
        return;
      }

      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }

      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

/**
 * Parse markdown links from llms.txt content
 * Only parses links in the "## Docs" section (stops at "## Optional")
 * @param {string} content - llms.txt content
 * @returns {Array<{title: string, url: string, path: string}>}
 */
function parseDocLinks(content) {
  const links = [];
  const lines = content.split('\n');

  let inDocsSection = false;

  for (const line of lines) {
    // Start of Docs section
    if (line.trim() === '## Docs') {
      inDocsSection = true;
      continue;
    }

    // End of Docs section (start of Optional or other section)
    if (line.startsWith('## ') && inDocsSection) {
      break;
    }

    if (!inDocsSection) continue;

    // Parse markdown links: - [Title](url): description
    const match = line.match(/^\s*-\s*\[([^\]]+)\]\(([^)]+)\)/);
    if (match) {
      const [, title, url] = match;

      // Only process .md URLs from docs.wiremock.io
      if (url.endsWith('.md') && url.startsWith(BASE_URL)) {
        // Extract path relative to base URL
        const relativePath = url.replace(BASE_URL, '');
        links.push({ title, url, path: relativePath });
      }
    }
  }

  return links;
}

/**
 * Download a single document
 * @param {string} url - URL to download
 * @param {string} destPath - Destination file path
 * @returns {Promise<{success: boolean, size: number, error?: string}>}
 */
async function downloadDoc(url, destPath) {
  try {
    let content = await fetchUrl(url);
    content = content.replace(/\nBuilt with \[Mintlify\]\(https:\/\/mintlify\.com\)\.\s*$/m, '');
    ensureDir(path.dirname(destPath));
    fs.writeFileSync(destPath, content, 'utf8');
    return { success: true, size: Buffer.byteLength(content, 'utf8') };
  } catch (error) {
    return { success: false, size: 0, error: error.message };
  }
}

/**
 * Run async tasks with concurrency limit
 * @param {Array} items - Items to process
 * @param {number} limit - Concurrency limit
 * @param {Function} fn - Async function to run for each item
 * @returns {Promise<Array>}
 */
async function runWithConcurrency(items, limit, fn) {
  const results = [];
  const executing = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const p = Promise.resolve().then(() => fn(item, i, items.length));
    results.push(p);

    if (limit <= items.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= limit) {
        await Promise.race(executing);
      }
    }
  }

  return Promise.all(results);
}

// ============================================================================
// MAIN SCRIPT
// ============================================================================

async function main() {
  console.log('🔄 Updating WireMock Cloud skill documentation...');
  console.log(`📍 Source: ${LLMS_TXT_URL}`);
  console.log('');

  // Step 1: Fetch llms.txt
  console.log('📦 Fetching llms.txt...');
  let llmsTxt;
  try {
    llmsTxt = await fetchUrl(LLMS_TXT_URL);
  } catch (error) {
    console.error(`❌ Failed to fetch llms.txt: ${error.message}`);
    process.exit(1);
  }

  // Step 2: Parse doc links
  const docLinks = parseDocLinks(llmsTxt);
  console.log(`📋 Found ${docLinks.length} documentation links`);
  console.log('');

  if (docLinks.length === 0) {
    console.error('❌ No documentation links found in llms.txt');
    process.exit(1);
  }

  // Step 3: Ensure skill directory exists
  if (!fs.existsSync(SKILL_DIR)) {
    console.log('📁 Creating skill directory...');
    fs.mkdirSync(SKILL_DIR, { recursive: true });
  }

  // Step 4: Clean existing documentation
  console.log('🧹 Cleaning existing documentation...');
  if (fs.existsSync(DOCS_DIR)) {
    fs.rmSync(DOCS_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(DOCS_DIR, { recursive: true });

  // Step 5: Download all docs in parallel
  console.log(`📥 Downloading ${docLinks.length} documents (concurrency: ${CONCURRENCY_LIMIT})...`);
  console.log('');

  let successCount = 0;
  let failCount = 0;
  let totalSize = 0;
  const failures = [];

  const results = await runWithConcurrency(docLinks, CONCURRENCY_LIMIT, async (link, index, total) => {
    const destPath = path.join(DOCS_DIR, link.path);
    const result = await downloadDoc(link.url, destPath);

    const progress = `[${String(index + 1).padStart(3)}/${total}]`;

    if (result.success) {
      successCount++;
      totalSize += result.size;
      console.log(`   ${progress} ✓ ${link.path}`);
    } else {
      failCount++;
      failures.push({ path: link.path, error: result.error });
      console.log(`   ${progress} ✗ ${link.path} - ${result.error}`);
    }

    return result;
  });

  // Step 6: Report results
  console.log('');
  console.log('✅ Documentation update complete!');
  console.log('');
  console.log('📊 Statistics:');
  console.log(`   - Location: ${DOCS_DIR}`);
  console.log(`   - Downloaded: ${successCount} files`);
  if (failCount > 0) {
    console.log(`   - Failed: ${failCount} files`);
  }
  console.log(`   - Total size: ${formatBytes(getDirectorySize(DOCS_DIR))}`);

  // List created subdirectories
  const subdirs = listSubdirectories(DOCS_DIR);
  if (subdirs.length > 0) {
    console.log(`   - Directories: ${subdirs.join(', ')}`);
  }

  console.log('');
  console.log('💡 Documentation is now ready for the wiremock-cloud skill');

  // Report failures if any
  if (failures.length > 0) {
    console.log('');
    console.log('⚠️  Failed downloads:');
    for (const failure of failures) {
      console.log(`   - ${failure.path}: ${failure.error}`);
    }
  }
}

// Run the script
main().catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
