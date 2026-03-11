/**
 * Common utility functions for documentation update scripts
 */

const fs = require('fs');
const path = require('path');

/**
 * Format bytes to human readable string
 * @param {number} bytes - Byte count
 * @returns {string} - Formatted string (e.g., "1.5M", "512K", "256B")
 */
function formatBytes(bytes) {
  if (bytes < 1024) return bytes + 'B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'K';
  return (bytes / (1024 * 1024)).toFixed(1) + 'M';
}

/**
 * Get directory size recursively
 * @param {string} dir - Directory path
 * @returns {number} - Total size in bytes
 */
function getDirectorySize(dir) {
  let size = 0;

  if (!fs.existsSync(dir)) {
    return 0;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      size += getDirectorySize(fullPath);
    } else {
      size += fs.statSync(fullPath).size;
    }
  }

  return size;
}

/**
 * Count markdown files in directory recursively
 * @param {string} dir - Directory path
 * @returns {number} - Count of .md files
 */
function countMarkdownFiles(dir) {
  let count = 0;

  if (!fs.existsSync(dir)) {
    return 0;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += countMarkdownFiles(fullPath);
    } else if (entry.name.endsWith('.md')) {
      count++;
    }
  }

  return count;
}

/**
 * Ensure directory exists (creates recursively if needed)
 * @param {string} dirPath - Directory path to create
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * List subdirectory names in a directory
 * @param {string} dir - Directory path
 * @returns {string[]} - Sorted array of subdirectory names
 */
function listSubdirectories(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort();
}

/**
 * Copy directory recursively
 * @param {string} source - Source directory path
 * @param {string} dest - Destination directory path
 */
function copyRecursive(source, dest) {
  if (!fs.existsSync(source)) {
    return;
  }

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(source, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyRecursive(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  }
}

/**
 * Copy file if it exists
 * @param {string} source - Source file path
 * @param {string} dest - Destination file path
 * @returns {boolean} - True if file was copied, false otherwise
 */
function copyFileIfExists(source, dest) {
  if (fs.existsSync(source) && fs.statSync(source).isFile()) {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(source, dest);
    return true;
  }
  return false;
}

module.exports = {
  formatBytes,
  getDirectorySize,
  countMarkdownFiles,
  ensureDir,
  listSubdirectories,
  copyRecursive,
  copyFileIfExists
};
