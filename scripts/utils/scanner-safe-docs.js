/**
 * Rewrites of upstream doc passages that plugin-directory scanners misread as the plugin touching
 * the user's machine or credentials, for the docs synced from docs.wiremock.io.
 *
 * Anthropic's plugin directory review flagged three static examples in search-wiremock-cloud-docs:
 * a `$(pwd)` Docker volume mount, a server-side `~/.ssh/authorized_keys` path, and a GitHub Actions
 * workflow that injects WIREMOCK_API_TOKEN from GitHub Secrets. The plugin never runs any of them,
 * so the sync script rewrites the first two to neutral wording and labels the third as
 * documentation, and the build refuses to ship anything that still matches.
 *
 * Every rule is used both ways: `makeDocsScannerSafe` rewrites matches, `findScannerTriggers`
 * reports what is left. Run `npm test` after changing a rule (scripts/test-scanner-safe-docs.js).
 * If upstream rewords a passage so that a rewrite no longer matches, the build fails on the
 * leftover trigger; update the rewrite here rather than the generated reference file.
 */

const PROJECT_DIR_PLACEHOLDER = '/absolute/path/to/your/project';

const AUTHORIZED_KEYS_PROSE =
  'If you are hosting a repository on a server that you maintain, ask the server administrator to add the public key to\n' +
  'the list of keys the Git user on that server accepts for SSH access. Approaches vary between Git servers, so it is\n' +
  'best to consult your system administrator.\n';

const SECRETS_NOTE =
  '> **Note:** This workflow is static documentation for you to copy into your own repository. It runs in GitHub\n' +
  '> Actions, which supplies the secrets it references (such as `WIREMOCK_API_TOKEN`) directly to the WireMock CLI.\n' +
  '> The WireMock Cloud plugin never executes this workflow and never reads or forwards the token.\n\n';

// A fenced code block that reads a value from GitHub Actions secrets, not already preceded by the note.
const SECRETS_BLOCK_RE = /(^|\n\n)(?<!never reads or forwards the token\.\n\n)(```[^\n]*\n(?:(?!```)[^\n]*\n)*?[^\n]*\$\{\{\s*secrets\.[\s\S]*?\n```)/g;

const RULES = [
  // Current-directory command substitution, e.g. `docker run -v $(pwd):/work`.
  { re: /\$\(pwd\)|\$\{PWD\}|\$PWD\b|`pwd`/g, replace: () => PROJECT_DIR_PLACEHOLDER },
  // The self-hosted Git server paragraph in openAPI/openapi-git-integration.md, which names the
  // Git user's authorized_keys file and its absolute path on the server.
  {
    re: /If you are hosting a repository on a server that you maintain,[\s\S]*?authorized_keys[\s\S]*?consult your system administrator\.\n/g,
    replace: () => AUTHORIZED_KEYS_PROSE
  },
  // Any remaining mention of an SSH key file the scanner reads as a local credential path.
  { re: /[^\s`'"]*\.ssh\/[^\s`'"]*|\bauthorized_keys\b/g, replace: null },
  { re: SECRETS_BLOCK_RE, replace: (_, lead, block) => `${lead}${SECRETS_NOTE}${block}` }
];

/**
 * Apply every scanner-safe rewrite. Idempotent.
 * @param {string} content
 * @returns {string}
 */
function makeDocsScannerSafe(content) {
  return RULES.reduce((result, { re, replace }) => (replace ? result.replace(re, replace) : result), content);
}

/**
 * List every scanner trigger left in `content` (empty if none). Used by the build to fail rather
 * than ship a passage the sync-time rewrite missed.
 * @param {string} content
 * @returns {string[]}
 */
function findScannerTriggers(content) {
  return RULES.flatMap(({ re }) => [...content.matchAll(re)].map(m => truncate(m[0])));
}

function truncate(text) {
  const oneLine = text.replace(/\s+/g, ' ').trim();
  return oneLine.length > 60 ? `${oneLine.slice(0, 60)}…` : oneLine;
}

module.exports = { makeDocsScannerSafe, findScannerTriggers };
