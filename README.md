# WireMock Cloud Agent Skills

This repository contains a collection of [agent skills](https://agentskills.io/home) intended to work with WireMock Cloud.

## Available Skills

| Skill | Description |
|-------|-------------|
| `/build-api-simulation` | Generate a complete mock API for any REST API — OpenAPI spec, Arazzo test workflows, and WireMock stubs, optionally recorded from a live sandbox |
| Create Stubs | Create and import WireMock stubs for a mock API |
| Convert to Stateful | Convert existing stubs to be stateful using the key-value state store |
| Convert to Data-Driven | Convert existing stubs to use CSV or database data sources |
| Validate and Fix Stubs | Validate stubs against the OpenAPI schema and fix any errors |
| Author Response Templates | Author and debug Handlebars response templates for WireMock stubs |
| Search WireMock Cloud Docs | Search cached WireMock Cloud documentation for accurate answers about stubs, request matching, response templating, CLI, Runner, and more |

`/build-api-simulation` is a user-invocable slash command. The remaining skills are triggered automatically by context when relevant.

Each supported tool ships the same 8 skills as two plugins, differing only in which WireMock Cloud MCP server they talk to:

| Plugin | MCP server |
|--------|------------|
| `wiremock-cloud` | Remote, hosted HTTP server (`mcp.wiremock.cloud`). No local install beyond the plugin itself. |
| `wiremock-cloud-local` | Local, stdio server launched via the WireMock CLI (`wiremock mcp`). Requires `npm i -g @wiremock/cli` and `wiremock login` first. |

Install whichever matches your setup — not both, since they'd both register an MCP server named `wiremock`.

## Installation

### Claude Code

Add the marketplace registry, then install one of the two plugins:

```
/plugin marketplace add wiremock-inc/skills
/plugin install wiremock-cloud@wiremock-inc-skills
```

or, for the local MCP server variant:

```
/plugin marketplace add wiremock-inc/skills
/plugin install wiremock-cloud-local@wiremock-inc-skills
```

### Cursor

```
/plugin marketplace add wiremock-inc/skills
/plugin install wiremock-cloud@wiremock-inc-skills
```

or, for the local MCP server variant, `/plugin install wiremock-cloud-local@wiremock-inc-skills`. Run `/reload-plugins` afterwards.

### Codex CLI

```
codex plugin marketplace add wiremock-inc/skills
```

then install `wiremock-cloud` (or `wiremock-cloud-local`) from the `/plugins` picker, or your Codex CLI version's equivalent install command.

`codex/` is also the package submitted to OpenAI's plugin directory for ChatGPT and Codex.

### GitHub Copilot

```
copilot plugin marketplace add wiremock-inc/skills
copilot plugin install wiremock-cloud
```

or, for the local MCP server variant, `copilot plugin install wiremock-cloud-local`.

> The Cursor/Codex/Copilot plugins carry the same skill instructions as the Claude Code ones, minus two Claude-only `SKILL.md` frontmatter fields (`allowed-tools`, `model`) that aren't part of the portable [Agent Skills](https://agentskills.io/home) standard those tools share.

### Other tools

For any agent that reads the open [Agent Skills](https://agentskills.io/home) format directly but that we don't build a dedicated plugin for, copy `skills/` (remote, WireMock Cloud-hosted MCP server — pair with the `.mcp.json` alongside it) or `local-skills/` (local WireMock CLI-based MCP server — configure that yourself, see the [installation guide](https://docs.wiremock.io/ai-mcp/installation)) straight into your tool's skills directory.

## Repository structure

Skill content is authored once in `common/skills/` and built into all plugins by `npm run build` (`scripts/build-plugins.js`), which resolves `{{WIREMOCK_TOOL_PREFIX}}` tokens and `# @variant:remote` / `# @variant:local` blocks per variant, and — for the Cursor/Codex/Copilot/standalone variants — strips Claude-only `SKILL.md` frontmatter (`allowed-tools`, `model`) and rewrites the Claude-only `${CLAUDE_SKILL_DIR}` script path prefix. The generated output is committed to the repo; edit `common/skills/` and re-run the build rather than editing the generated files directly:

| Tool | Remote plugin | Local plugin | Marketplace manifest |
|------|---------------|--------------|-----------------------|
| Claude Code | `claude/` | `claude-local/` | `.claude-plugin/marketplace.json` |
| Cursor | `cursor/` | `cursor-local/` | `.cursor-plugin/marketplace.json` |
| Codex CLI | `codex/` | `codex-local/` | `.agents/plugins/marketplace.json` |
| GitHub Copilot | `copilot/` | `copilot-local/` | `.github/plugin/marketplace.json` |
| Other tools (manual copy) | `skills/` (+ `.mcp.json`) | `local-skills/` | _none — not plugin-packaged_ |

`codex/` has two layouts. The legacy `.codex-plugin/plugin.json` and `.mcp.json` serve existing Codex installs. The portable Agent Plugins 1.0.0 `plugin.json`, `mcp.json` and `assets/` are what the OpenAI plugin directory reads. The build generates the portable files from `variants/codex/openai.json` (listing text, links and review cases) and `variants/codex/assets/` (listing images). Both MCP files come from the same endpoint source. `npm run validate:openai` checks the package against the vendored schemas in `scripts/schemas/`, and `npm run package:openai` produces the upload ZIP in `dist/`.

Each Claude plugin folder is self-contained, as Anthropic's plugin directory requires: the build writes its `.claude-plugin/plugin.json`, copies its `README.md` from `variants/<variant>/README.md`, and copies the shared root `LICENSE` and `assets/icon.svg` (or `icon.png`) when they exist. The build owns every plugin output folder entirely and clears it on each run, so put hand-written content in `common/` or `variants/`, never in the generated folders.

The Claude plugin version comes from `version` in `package.json`. Claude Code keeps users on an installed version until it changes, so bump it whenever the Claude plugins change. `npm run check-version` (run in CI on pull requests) fails if `claude/`, `claude-local/` or `.claude-plugin/` changed without a version increase.

Docs synced by `scripts/sync-wiremock-cloud-docs.js` have credential-like example values (PEM bodies, API keys, passwords, tokens, and recognisable formats such as JWTs and AWS/GitHub keys) rewritten to placeholders such as `<YOUR_API_KEY>` by `scripts/utils/example-secrets.js`. The build fails if any value matching those rules remains in `common/skills/`. `npm test` checks the rules against known examples; add a case there when you change them.

## License

This repository and the plugins built from it are licensed under the [Apache License 2.0](LICENSE).
