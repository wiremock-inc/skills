# WireMock Cloud for Claude

[WireMock Cloud](https://www.wiremock.io) is a hosted API simulation platform. Teams use it to build mock APIs that stand in for real services during development, testing and CI, without running or maintaining any mock infrastructure themselves.

This plugin connects Claude to your WireMock Cloud account and teaches it how to build and maintain realistic API simulations. It provides:

- **The hosted WireMock Cloud MCP server** at `https://mcp.wiremock.cloud/mcp`, which gives Claude tools for managing mock APIs, stubs, recordings and OpenAPI documents in your account.
- **Eight Agent Skills** that guide Claude through common WireMock Cloud workflows.

## Skills

| Skill | What it does |
|-------|--------------|
| `build-api-simulation` | Builds a complete mock API for any REST API: an OpenAPI description, Arazzo test workflows and WireMock stubs, optionally recorded from a live sandbox. Run it with `/wiremock-cloud:build-api-simulation`. |
| `create-stubs` | Creates stub mappings and imports them into a mock API. |
| `convert-to-stateful` | Makes stubs stateful with the key-value state store, so created resources can be retrieved, updated and deleted. |
| `convert-to-data-driven` | Drives stub responses from CSV or database data sources, with optional pagination. |
| `validate-and-fix-stubs` | Checks stub responses against the OpenAPI schema and fixes the ones that don't conform. |
| `author-response-templates` | Writes and debugs Handlebars response templates. |
| `review-api-simulation` | Reviews an existing simulation against its source documentation, OpenAPI description and Arazzo workflows. |
| `search-wiremock-cloud-docs` | Answers WireMock Cloud questions from a bundled copy of the official documentation. |

Apart from `build-api-simulation`, the skills load automatically when your request matches them. For example, ask Claude to "make the orders API mock stateful" or "why isn't my request matching this stub?".

## Setup

1. Install the plugin in Claude Code:

   ```
   /plugin marketplace add wiremock-inc/skills
   /plugin install wiremock-cloud@wiremock-inc-skills
   ```

2. The first time Claude uses a WireMock Cloud tool, you are asked to sign in. Authentication uses WireMock Cloud's OAuth flow in your browser. The plugin contains no API keys and never reads tokens or credentials from your machine.

You need a WireMock Cloud account, which you can create at https://app.wiremock.cloud.

## What the plugin sends and runs

**Data sent to WireMock Cloud.** To carry out what you ask, Claude sends the relevant instructions and API-simulation content to the WireMock Cloud MCP server, and it is stored in your account. That content includes mock API names, stub mappings, OpenAPI and Arazzo documents, and recording settings. When you record from a sandbox, the traffic captured through WireMock Cloud's recorder, including your sandbox's responses, is saved as stubs in your account. WireMock Cloud handles this data under its [privacy policy](https://www.wiremock.io/privacy-policy).

**Commands run on your machine.** Some skills ask Claude to run these local commands:

- `python3` on four bundled, read-only helper scripts in `skills/build-api-simulation/scripts/`. They summarise or sanity-check local OpenAPI, Arazzo and stub files. They need PyYAML and make no network calls.
- `curl`, to send test requests to your mock API's URL and to download a publicly published OpenAPI description when you build a simulation of an existing API.
- `npx @wiremock/arazzo-runner@1.4.0`, which runs Arazzo test workflows against your sandbox or mock API. With `build-api-simulation`, it also uses `npx swagger2openapi@7.0.8` to convert Swagger 2.0 specs. On first use, `npx` downloads these exact, pinned package versions from the npm registry. Both need Node.js 18 or later.

**Your sandbox credentials.** If your sandbox needs authentication, Claude creates an authenticator file containing placeholder values and asks you to fill in the real credentials yourself. It doesn't look up or read credentials from your environment.

The documentation under `skills/search-wiremock-cloud-docs/references/` is reference material. Its shell, `curl` and CI examples are for you to run; the plugin doesn't run them automatically.

## Running the MCP server locally instead

The hosted MCP server needs nothing installed on your machine. If you'd rather run the MCP server locally through the WireMock CLI, install the `wiremock-cloud-local` plugin instead. Don't install both, because they register the same server name.

## Links

- Documentation: https://docs.wiremock.io
- MCP server setup: https://docs.wiremock.io/ai-mcp/installation
- Support: https://www.wiremock.io/contact-now or support@wiremock.io
- Privacy policy: https://www.wiremock.io/privacy-policy
- Source: https://github.com/wiremock-inc/skills
