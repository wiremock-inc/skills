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

### GitHub Copilot

```
copilot plugin marketplace add wiremock-inc/skills
copilot plugin install wiremock-cloud
```

or, for the local MCP server variant, `copilot plugin install wiremock-cloud-local`.

> The Cursor/Codex/Copilot plugins carry the same skill instructions as the Claude Code ones, minus two Claude-only `SKILL.md` frontmatter fields (`allowed-tools`, `model`) that aren't part of the portable [Agent Skills](https://agentskills.io/home) standard those tools share.

## Repository structure

Skill content is authored once in `common/skills/` and built into all plugins by `npm run build` (`scripts/build-plugins.js`), which resolves `{{WIREMOCK_TOOL_PREFIX}}` tokens and `# @variant:remote` / `# @variant:local` blocks per variant, and — for the Cursor/Codex/Copilot variants — strips Claude-only `SKILL.md` frontmatter (`allowed-tools`, `model`) and rewrites the Claude-only `${CLAUDE_SKILL_DIR}` script path prefix. The generated output is committed to the repo; edit `common/skills/` and re-run the build rather than editing the generated files directly:

| Tool | Remote plugin | Local plugin | Marketplace manifest |
|------|---------------|--------------|-----------------------|
| Claude Code | `claude/` | `claude-local/` | `.claude-plugin/marketplace.json` |
| Cursor | `cursor/` | `cursor-local/` | `.cursor-plugin/marketplace.json` |
| Codex CLI | `codex/` | `codex-local/` | `.agents/plugins/marketplace.json` |
| GitHub Copilot | `copilot/` | `copilot-local/` | `.github/plugin/marketplace.json` |
