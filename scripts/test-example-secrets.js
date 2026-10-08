#!/usr/bin/env node

/**
 * Table-driven check of scripts/utils/example-secrets.js: every "secret" case must be flagged and
 * redacted (idempotently), and every "fine" case must be left exactly as it is.
 */

const assert = require('assert');
const { redactExampleSecrets, findExampleSecrets } = require('./utils/example-secrets');

const SECRETS = [
  'hmacSecret: sup3r-s3cr3t-hmac-k3y',
  'apiKey: 3b35fdee8ff9cf5055d062c28675ee22',
  '"apiKey": "abcd1234efgh"',
  '"password": "hunter2secret",',
  "password: 'p@ss!word#1'",
  'password = mysecretpassword',
  'PASSWORD=supersecret1',
  'client_secret=abcdef123456',
  'access_token=abcdef123456&foo=bar',
  '"accessToken": "abcdef123456"',
  'private_key: abcdef123456',
  'token: "very-secret-123"',
  'X-API-Key: sk-1234567890abcdef',
  'x-api-key: abcdef123456',
  'authorization: Bearer abcdefgh1234',
  "-H 'Authorization:Token 1kj3h98f7sihjfsf' \\",
  '`https://example.wiremockapi.cloud/__admin/mappings?apiToken=1kj3h98f7sihjfsf`.',
  'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U',
  'AKIAIOSFODNN7EXAMPLE',
  'ghp_abcdefghijklmnopqrstuvwxyz0123',
  'sk_live_abcdefghijkl1234',
  'https://admin:hunter2@db.example.com/x',
  '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDHIpsyRDeM1lFQ\n-----END PRIVATE KEY-----',
  '-----BEGIN PRIVATE KEY-----\r\nMIIEvQIBADANBgkqhkiG9w0BAQEF\r\n-----END PRIVATE KEY-----',
  '-----BEGIN RSA PRIVATE KEY-----\nMIIEvQ\n-----END PRIVATE KEY-----',
  '    key: |-\n      -----BEGIN RSA PRIVATE KEY-----\n      MIIEvQIBADANBgkqhkiG9w0BAQEF\n      -----END RSA PRIVATE KEY-----',
  '"key": "-----BEGIN RSA PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEF\\n-----END RSA PRIVATE KEY-----\\n"'
];

const FINE = [
  'password: string',
  'token: required',
  'apiKey: <YOUR_API_KEY>',
  'password: ${DB_PASSWORD}',
  'token: {{request.headers.token}}',
  'WIREMOCK_API_TOKEN: ${{ secrets.WIREMOCK_API_TOKEN }}',
  'the token: refreshes every hour',
  'Your password: choose one carefully.',
  '"hs256Secret": "...",',
  "WMC_API_TOKEN='your-api-token-here'",
  'Authorization: Bearer <YOUR_TOKEN>',
  'description: The password of the user to connect to the database as.',
  '"rs256PrivateKey": "-----BEGIN RSA PRIVATE KEY-----\\n...\\n-----END RSA PRIVATE KEY-----\\n"',
  '-----BEGIN CERTIFICATE-----\n<YOUR_CERTIFICATE_BASE64>\n-----END CERTIFICATE-----',
  'https://user:<YOUR_PASSWORD>@host/x',
  'tokenAuth: []',
  '  headers = {"Authorization: {token_response.token_type} {token_response.access_token}"}',
  'data = "grant_type=refresh_token&refresh_token={token_response.refresh_token}"',
  '    rsa256PrivateKey: |-\n      -----BEGIN RSA PRIVATE KEY-----\n      <YOUR_RSA_PRIVATE_KEY_BASE64>\n      -----END RSA PRIVATE KEY-----'
];

let failures = 0;
function check(name, fn) {
  try { fn(); } catch (error) { failures++; console.error(`✗ ${name}\n  ${error.message}`); }
}

for (const input of SECRETS) {
  check(`flags ${JSON.stringify(input)}`, () => {
    assert.ok(findExampleSecrets(input).length > 0, 'not flagged');
    const redacted = redactExampleSecrets(input);
    assert.notStrictEqual(redacted, input, 'not redacted');
    assert.deepStrictEqual(findExampleSecrets(redacted), [], `still flagged after redaction: ${redacted}`);
    assert.strictEqual(redactExampleSecrets(redacted), redacted, 'redaction not idempotent');
  });
}

for (const input of FINE) {
  check(`leaves ${JSON.stringify(input)}`, () => {
    assert.deepStrictEqual(findExampleSecrets(input), [], 'flagged');
    assert.strictEqual(redactExampleSecrets(input), input, 'changed');
  });
}

const total = SECRETS.length + FINE.length;
if (failures > 0) {
  console.error(`\n❌ ${failures}/${total} example-secrets cases failed`);
  process.exit(1);
}
console.log(`✅ ${total} example-secrets cases passed`);
