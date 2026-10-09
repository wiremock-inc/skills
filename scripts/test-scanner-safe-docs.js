#!/usr/bin/env node

/**
 * Table-driven check of scripts/utils/scanner-safe-docs.js: every "trigger" case must be flagged
 * and rewritten (idempotently), and every "fine" case must be left exactly as it is.
 */

const assert = require('assert');
const { makeDocsScannerSafe, findScannerTriggers } = require('./utils/scanner-safe-docs');

const TRIGGERS = [
  'docker run \\\n  -v $(pwd):/work \\\n  wiremock/wiremock-cli:latest',
  'docker run -v ${PWD}:/work wiremock/wiremock-cli',
  'docker run -v $PWD:/work wiremock/wiremock-cli',
  'If you are hosting a repository on a server that you maintain, adding the key to your repository will generally involve\n' +
    "adding it to the Git user's `.ssh/authorized_keys` file.\n" +
    'For example, if your Git repository address is `git-user@my-git-server.com:path/to/repository.git`, you will likely have\n' +
    'to append the key to the contents of `/home/git-user/.ssh/authorized_keys` on the server that `my-git-server.com`\n' +
    'addresses.\n' +
    'Approaches may vary, so it is best to consult your system administrator.\n',
  'Create `.github/workflows/deploy.yml`:\n\n```yaml theme={null}\nsteps:\n  - name: Configure\n    env:\n      WIREMOCK_API_TOKEN: ${{ secrets.WIREMOCK_API_TOKEN }}\n    run: wiremock config set api_token $WIREMOCK_API_TOKEN\n```\n'
];

const FINE = [
  'docker run -v /absolute/path/to/your/project:/work wiremock/wiremock-cli',
  'wiremock mock-apis push --all --profile staging',
  '1. Verify the `WIREMOCK_API_TOKEN` secret is set correctly in GitHub',
  '```bash\ngit add .github/workflows/deploy-staging.yml\n```\n',
  'Add the public key as a deploy key in your repository settings.'
];

// Triggers with no safe automatic rewrite: they stay flagged, so the build fails until a rule covers them.
const UNFIXABLE = [
  'Copy the key into `~/.ssh/id_ed25519` first.'
];

let failures = 0;
function check(name, fn) {
  try { fn(); } catch (error) { failures++; console.error(`✗ ${name}\n  ${error.message}`); }
}

for (const input of TRIGGERS) {
  check(`rewrites ${JSON.stringify(input.slice(0, 50))}`, () => {
    assert.ok(findScannerTriggers(input).length > 0, 'not flagged');
    const rewritten = makeDocsScannerSafe(input);
    assert.notStrictEqual(rewritten, input, 'not rewritten');
    assert.deepStrictEqual(findScannerTriggers(rewritten), [], `still flagged after rewrite: ${rewritten}`);
    assert.strictEqual(makeDocsScannerSafe(rewritten), rewritten, 'rewrite not idempotent');
  });
}

for (const input of FINE) {
  check(`leaves ${JSON.stringify(input)}`, () => {
    assert.deepStrictEqual(findScannerTriggers(input), [], 'flagged');
    assert.strictEqual(makeDocsScannerSafe(input), input, 'changed');
  });
}

for (const input of UNFIXABLE) {
  check(`flags but cannot rewrite ${JSON.stringify(input)}`, () => {
    assert.ok(findScannerTriggers(input).length > 0, 'not flagged');
    assert.strictEqual(makeDocsScannerSafe(input), input, 'changed');
  });
}

const total = TRIGGERS.length + FINE.length + UNFIXABLE.length;
if (failures > 0) {
  console.error(`\n❌ ${failures}/${total} scanner-safe-docs cases failed`);
  process.exit(1);
}
console.log(`✅ ${total} scanner-safe-docs cases passed`);
