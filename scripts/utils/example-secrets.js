/**
 * Redaction of credential-like example values in the docs synced from docs.wiremock.io.
 *
 * The upstream docs illustrate certificates, API keys and passwords with literal values. They
 * are examples, but scanners (e.g. Anthropic's plugin directory review) can't tell them apart
 * from leaked secrets, so the sync script rewrites them to obvious placeholders and the build
 * refuses to ship anything that still looks like one.
 */

// Matches a PEM block, capturing its BEGIN line, the indentation of its first body line, and
// its END line. The body (base64 data, or an elided excerpt of it) is replaced wholesale.
const PEM_BLOCK_RE = /^([ \t]*-----BEGIN ([A-Z0-9 ]+)-----\n)([ \t]*)(?:(?![ \t]*-----END)[^\n]*\n)+?([ \t]*-----END \2-----)$/gm;

// `key: value` / `key=value` pairs whose literal value should become a placeholder. A value
// already written as a placeholder (`<...>`), an env/template reference (`${...}`, `{{...}}`)
// or a GitHub Actions secret (`secrets.X`) is left alone.
const LITERAL_RULES = [
  { key: 'hmacSecret', placeholder: '<YOUR_HMAC_SECRET>' },
  { key: 'apiKey', placeholder: '<YOUR_API_KEY>' },
  { key: 'apiToken', placeholder: '<YOUR_API_TOKEN>' },
  { key: 'password', placeholder: '<YOUR_PASSWORD>' },
  { key: 'token', placeholder: '<YOUR_TOKEN>' },
  { key: 'X-API-Key', placeholder: '<YOUR_API_KEY>' },
  { key: 'Authorization', placeholder: '<YOUR_TOKEN>' }
];

const LITERAL_VALUE = String.raw`(?!<|\$\{|\{\{|secrets\.|(?:Token|Bearer|Basic)\b)[A-Za-z0-9_+/=.\-]{6,}`;

function literalRegex(key) {
  // `key: value`, `key: "value"`, or `key=value` (as in a query string), optionally with an
  // HTTP auth scheme in front of the value (`Authorization: Bearer value`)
  return new RegExp(String.raw`(\b${key}[ \t]*(?::[ \t]*|=)(?:(?:Token|Bearer|Basic)[ \t]+)?)("?)${LITERAL_VALUE}\2`, 'g');
}

function pemPlaceholder(label) {
  return `<YOUR_${label.trim().replace(/\s+/g, '_')}_BASE64>`;
}

/**
 * Replace credential-like example values with unmistakable placeholders.
 * @param {string} content
 * @returns {string}
 */
function redactExampleSecrets(content) {
  let result = content.replace(PEM_BLOCK_RE, (_, begin, label, indent, end) =>
    `${begin}${indent}${pemPlaceholder(label)}\n${end}`);
  for (const { key, placeholder } of LITERAL_RULES) {
    result = result.replace(literalRegex(key), (_, prefix, quote) => `${prefix}${quote}${placeholder}${quote}`);
  }
  return result;
}

/**
 * Describe every credential-like example value left in `content` (empty if none). Used by the
 * build to fail rather than ship a value the sync-time redaction missed.
 * @param {string} content
 * @returns {string[]}
 */
function findExampleSecrets(content) {
  return content === redactExampleSecrets(content)
    ? []
    : diffLines(content, redactExampleSecrets(content));
}

function diffLines(before, after) {
  const afterLines = new Set(after.split('\n'));
  return before.split('\n').filter(line => !afterLines.has(line)).map(line => line.trim());
}

module.exports = { redactExampleSecrets, findExampleSecrets };
