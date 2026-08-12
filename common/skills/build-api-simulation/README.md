# Build API Simulation - Claude Code Skill

A [Claude Code](https://docs.anthropic.com/en/docs/claude-code) skill that generates complete API simulations in [WireMock Cloud](https://www.wiremock.io/) for any REST API.

Given an API name and optional sandbox URL, the skill will:

1. Find or generate an OpenAPI description for the API
2. Generate Arazzo test workflows covering the API's functionality
3. Create and configure a mock API in WireMock Cloud
4. Populate the mock with stubs — either recorded from a live sandbox or generated from the OpenAPI spec
5. Verify the mock by running the Arazzo workflows against it and fixing issues iteratively
6. Optionally convert the mock to be stateful, so that created resources can be subsequently retrieved, updated, and deleted

## Prerequisites

### MCP Server

This skill requires the following MCP server to be configured in your Claude Code settings:

#### WireMock Cloud MCP

Provides tools for managing mock APIs, stubs, recordings, and OpenAPI documents.

# @variant:remote
No manual setup is needed beyond installing this plugin — a `.mcp.json` bundled with the plugin configures the WireMock Cloud MCP server automatically. The first tool call that needs it will prompt you to sign in to your WireMock Cloud account in the browser.
# @variant:local
Install the WireMock CLI and log in to your WireMock Cloud account:

```bash
npm i -g @wiremock/cli
wiremock login
```

A `.mcp.json` bundled with this plugin then launches `wiremock mcp` automatically — no manual `claude mcp add` step is needed. See the [WireMock MCP installation guide](https://docs.wiremock.io/ai-mcp/installation) for details.
# @endvariant

### Arazzo Runner CLI

[Arazzo](https://spec.openapis.org/arazzo/latest.html) workflows are executed via the `@wiremock/arazzo-runner` CLI (run with `npx @wiremock/arazzo-runner run ...`), not an MCP tool. No separate installation step is required — `npx` fetches it on first use.

### Node.js

[Node.js](https://nodejs.org/) v18 or later is required for the Arazzo Runner CLI.
# @variant:remote
# @variant:local
It is also required for the WireMock CLI.
# @endvariant

## Usage

In a Claude Code session, invoke the skill with:

```
/build-api-simulation <api-name>
```

For example:

```
/build-api-simulation Stripe Payments
```

The skill will prompt you for additional information:
- Whether a sandbox/test environment is available (and its base URL)
- Paths to any authenticator config files for the sandbox
- URLs or file paths to existing OpenAPI specs or API documentation
- Whether the mock should be stateful

## Project Structure

```
.
├── SKILL.md                    # Skill definition and instructions
└── ../references/              # Shared reference documentation
    ├── stub-creation.md
    ├── stateful-stubbing.md
    ├── data-driven-stubbing.md
    ├── validating-and-fixing.md
    └── response-templating.md
```
