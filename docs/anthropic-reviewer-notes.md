# Anthropic plugin directory: reviewer notes

Notes to give Anthropic's reviewers with a Claude plugin directory submission of `claude/` (the `wiremock-cloud` plugin). They answer the policy-hold findings raised against version 1.1.0. Paste the **Reviewer notes** section into the submission form. The rest of this page records what changed and how the build keeps it that way.

## Reviewer notes

**Shell permissions.** No skill pre-approves `curl` or unrestricted `Bash`. A skill's `allowed-tools` lists only its WireMock MCP tools, `Read` (plus `Grep` and `Glob` for the documentation search skill), the plugin's own Python validation scripts in `skills/build-api-simulation/scripts/`, and two version-pinned `npx` packages (`swagger2openapi@7.0.8`, `@wiremock/arazzo-runner@1.4.0`). When a skill needs `curl`, for example to call the user's mock API, Claude Code asks the user for permission as usual.

**Credentials.** The plugin doesn't read, store or send any credential from the user's machine. It authenticates to the hosted WireMock MCP server (`https://mcp.wiremock.cloud/mcp`) through Claude Code's standard MCP OAuth flow and has no `user_config`.

The `search-wiremock-cloud-docs` skill bundles a static copy of the public docs at docs.wiremock.io as reference text. Its instructions tell Claude to quote the shell, CLI and CI snippets in those docs and not run them unless the user asks, and never to read existing credentials to fill in placeholders.

`skills/search-wiremock-cloud-docs/references/runner/promoting-apis-with-git-and-ci.md` contains a sample GitHub Actions workflow that reads `WIREMOCK_API_TOKEN` from GitHub Secrets. `WIREMOCK_API_TOKEN` is the user's WireMock Cloud API token. When the user runs the workflow in their own repository, GitHub Actions passes it straight to the WireMock CLI. Claude never reads the token and the plugin never forwards it, because the plugin never runs the workflow. The doc now says so in a note above the workflow.

The doc examples that were also flagged have been reworded. The Docker example in `cli/local-playback.md` now mounts `/absolute/path/to/your/project` instead of `$(pwd)`. `openAPI/openapi-git-integration.md` now describes the server administrator adding the public key, without naming an SSH file path.

## What changed

- `common/skills/*/SKILL.md`: removed `Bash(curl:*)` from seven skills, `Bash(head:*)` from `build-api-simulation` (it now reads the spec's first lines with `Read`) and `Bash` from `search-wiremock-cloud-docs`. That skill now points Claude at the `Grep` tool for searching its references.
- `scripts/utils/scanner-safe-docs.js`: rewrites the flagged passages when docs are synced. `npm run build` fails if a source file still contains one, so a docs refresh can't bring them back. If upstream rewords a passage and a rewrite stops matching, update the rule in that file, not the generated reference. `npm test` covers the rules (`scripts/test-scanner-safe-docs.js`).
