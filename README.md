# WireMock Cloud Agent Skills

This repository contains a collection of [agent skills](https://agentskills.io/home) intended to work with WireMock Cloud.

## Available Skills

| Skill | Command | Description |
|-------|---------|-------------|
| Build API Simulation | `/build-api-simulation` | Generate a complete mock API for any REST API — OpenAPI spec, Arazzo test workflows, and WireMock stubs, optionally recorded from a live sandbox |
| Create Stubs | `/create-stubs` | Create and import WireMock stubs for a mock API |
| Convert to Stateful | `/convert-to-stateful` | Convert existing stubs to be stateful using the key-value state store |
| Convert to Data-Driven | `/convert-to-data-driven` | Convert existing stubs to use CSV or database data sources |
| Validate and Fix Stubs | `/validate-and-fix-stubs` | Validate stubs against the OpenAPI schema and fix any errors |
| Author Response Templates | `/author-response-templates` | Author and debug Handlebars response templates for WireMock stubs |

## Installation

### Claude Code
To add this skills repository to your Claude Code config, type the following in Claude Code:

```
/plugin marketplace add wiremock-inc/skills
```

Then install the WireMock Cloud plugin (includes all skills):

```
/plugin install wiremock-cloud@wiremock-inc-skills
```
