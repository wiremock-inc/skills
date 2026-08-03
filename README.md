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

Two plugins ship the same 8 skills, differing only in which WireMock Cloud MCP server they talk to:

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

## Repository structure

Skill content is authored once in `common/skills/` and built into both plugins by `npm run build` (`scripts/build-plugins.js`), which resolves `{{WIREMOCK_TOOL_PREFIX}}` tokens and `# @variant:remote` / `# @variant:local` blocks per variant. The generated output — root `skills/` + `.mcp.json` (the `wiremock-cloud` plugin) and `local/skills/` + `local/.mcp.json` (the `wiremock-cloud-local` plugin) — is committed to the repo; edit `common/skills/` and re-run the build rather than editing the generated files directly.
