/**
 * Redaction of credential-like example values in the docs synced from docs.wiremock.io.
 *
 * The upstream docs illustrate certificates, API keys and passwords with literal values. They
 * are examples, but scanners (e.g. Anthropic's plugin directory review) can't tell them apart
 * from leaked secrets, so the sync script rewrites them to obvious placeholders and the build
 * refuses to ship anything that still looks like one.
 *
 * Every rule is used both ways: `redactExampleSecrets` replaces matches, `findExampleSecrets`
 * reports them. Run `npm test` after changing a rule (scripts/test-example-secrets.js).
 */

// A value that is already a placeholder or a reference rather than a literal: `<...>`, `${...}`,
// `{...}`/`{{...}}` templates, `secrets.X`, `...`, an obvious `your-...` stand-in, or a schema type/prose word.
const NOT_A_LITERAL = String.raw`(?!<|\$\{|\{|secrets\.|\.\.\.|your[-_]|(?:string|boolean|integer|number|object|array|required|optional|null|true|false)\b)`;

// Key names whose literal value is a credential. Matched case-insensitively, as a bare key,
// a quoted JSON/YAML key, an HTTP header or a query parameter.
const CREDENTIAL_KEYS = [
  'hmac_?secret', 'client_?secret', 'secret',
  'api_?key', 'x-api-key', 'api_?token', 'access_?token', 'refresh_?token', 'auth_?token', 'token',
  'password', 'passwd', 'private_?key', 'authorization'
].join('|');

const KEY_VALUE_RE = new RegExp(
  String.raw`(?<![A-Za-z0-9])(["']?)(?:${CREDENTIAL_KEYS})\1[ \t]*[:=][ \t]*` + // key and separator
  String.raw`(["']?)((?:Token|Bearer|Basic)[ \t]+)?` +                          // optional quote and auth scheme
  String.raw`${NOT_A_LITERAL}([^\s"'\x60<>,;)}\]\\]{6,})\2` +                    // the literal value
  String.raw`(?=[ \t]*(?:$|[\x60"',;)}\]#\\]))`,                                 // ...ending the value, not mid-sentence
  'gim'
);

// A PEM block: BEGIN line, body (base64, or an elided excerpt of it), END line. Handles CRLF and
// mismatched labels; the body is replaced wholesale.
const PEM_BLOCK_RE = /^([ \t]*-----BEGIN ([A-Z0-9 ]+)-----\r?\n)(?![ \t]*<)([ \t]*)(?:(?![ \t]*-----END)[^\n]*\n)+?([ \t]*-----END [A-Z0-9 ]+-----)/gm;

// A PEM block written on one line with escaped newlines, as in a JSON string.
const ESCAPED_PEM_RE = /(-----BEGIN ([A-Z0-9 ]+)-----\\n)(?!<|\.\.\.\\n)(?:(?!-----END)[A-Za-z0-9+/=]|\\n)+?(\\n-----END [A-Z0-9 ]+-----)/g;

const RULES = [
  { re: PEM_BLOCK_RE, replace: (_, begin, label, indent, end) => `${begin}${indent}${pemPlaceholder(label)}\n${end}` },
  { re: ESCAPED_PEM_RE, replace: (_, begin, label, end) => `${begin}${pemPlaceholder(label)}${end}` },
  { re: KEY_VALUE_RE, replace: (match, keyQuote, quote, scheme = '', value) =>
      match.slice(0, match.length - value.length - quote.length) + placeholderFor(match) + quote },
  // Credential formats recognisable without a key name.
  { re: /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g, replace: () => '<EXAMPLE_JWT>' },
  { re: /\bAKIA[0-9A-Z]{16}\b/g, replace: () => '<YOUR_AWS_ACCESS_KEY_ID>' },
  { re: /\bgh[pousr]_[A-Za-z0-9]{20,}\b/g, replace: () => '<YOUR_GITHUB_TOKEN>' },
  { re: /\b(?:sk|rk)_(?:live|test)_[A-Za-z0-9]{10,}\b|\bsk-[A-Za-z0-9]{16,}\b/g, replace: () => '<YOUR_API_KEY>' },
  { re: /(https?:\/\/[^\s/:@<>]+:)(?!<)[^\s/@<>]+@/g, replace: (_, prefix) => `${prefix}<YOUR_PASSWORD>@` }
];

function pemPlaceholder(label) {
  return `<YOUR_${label.trim().replace(/\s+/g, '_')}_BASE64>`;
}

function placeholderFor(match) {
  const key = match.split(/[:=]/)[0].toLowerCase();
  if (/password|passwd/.test(key)) return '<YOUR_PASSWORD>';
  if (/secret/.test(key)) return '<YOUR_SECRET>';
  if (/private_?key/.test(key)) return '<YOUR_PRIVATE_KEY>';
  if (/api_?key|x-api-key/.test(key)) return '<YOUR_API_KEY>';
  return '<YOUR_TOKEN>';
}

/**
 * Replace credential-like example values with unmistakable placeholders. Idempotent.
 * @param {string} content
 * @returns {string}
 */
function redactExampleSecrets(content) {
  return RULES.reduce((result, { re, replace }) => result.replace(re, replace), content);
}

/**
 * List every credential-like example value left in `content` (empty if none), each truncated so
 * a build log never prints a whole key. Used by the build to fail rather than ship a value the
 * sync-time redaction missed.
 * @param {string} content
 * @returns {string[]}
 */
function findExampleSecrets(content) {
  return RULES.flatMap(({ re }) => [...content.matchAll(re)].map(m => truncate(m[0])));
}

function truncate(text) {
  const oneLine = text.replace(/\s+/g, ' ').trim();
  return oneLine.length > 40 ? `${oneLine.slice(0, 40)}…` : oneLine;
}

module.exports = { redactExampleSecrets, findExampleSecrets };
