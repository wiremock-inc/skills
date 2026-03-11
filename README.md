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

## Installation

### Claude Code

Add the marketplace registry, then install the plugin:

```
/plugin marketplace add wiremock-inc/skills
/plugin install wiremock-cloud@wiremock-inc-skills
```

This installs all 7 skills as a single plugin.
