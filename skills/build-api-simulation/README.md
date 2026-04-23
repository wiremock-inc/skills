# Build API Simulation - Claude Code Skill

A [Claude Code](https://docs.anthropic.com/en/docs/claude-code) skill that generates complete API simulations in [WireMock Cloud](https://www.wiremock.io/) for any REST API.

Given an API name and optional sandbox URL, the skill will:

1. Find or generate an OpenAPI description for the API
2. Create and configure a mock API in WireMock Cloud
3. Populate the mock with stubs — either recorded from a live sandbox or generated from the OpenAPI spec
4. Verify the mock by sending a request for every operation in the OpenAPI spec and checking responses for validation errors, fixing issues iteratively
5. Optionally convert the mock to be stateful, so that created resources can be subsequently retrieved, updated, and deleted

## Prerequisites

### MCP Server

This skill requires the WireMock Cloud MCP server to be configured in your Claude Code settings.

#### WireMock Cloud MCP

Provides tools for managing mock APIs, stubs, recordings, and OpenAPI documents.

Follow the [WireMock MCP installation guide](https://docs.wiremock.io/ai-mcp/installation) to install the WireMock CLI, log in to your WireMock Cloud account, and configure the MCP server for Claude Code.

### Node.js

[Node.js](https://nodejs.org/) v18 or later is required for the MCP server.

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
