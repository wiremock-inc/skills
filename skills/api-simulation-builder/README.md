# API Simulation Builder - Claude Code Skill

A [Claude Code](https://docs.anthropic.com/en/docs/claude-code) skill that generates complete API simulations in [WireMock Cloud](https://www.wiremock.io/) for any REST API.

Given an API name and optional sandbox URL, the skill will:

1. Find or generate an OpenAPI description for the API
2. Generate Arazzo test workflows covering the API's functionality
3. Create and configure a mock API in WireMock Cloud
4. Populate the mock with stubs — either recorded from a live sandbox or generated from the OpenAPI spec
5. Verify the mock by running the Arazzo workflows against it and fixing issues iteratively
6. Optionally convert the mock to be stateful, so that created resources can be subsequently retrieved, updated, and deleted

## Prerequisites

### MCP Servers

This skill requires two MCP servers to be configured in your Claude Code settings:

#### WireMock Cloud MCP

Provides tools for managing mock APIs, stubs, recordings, and OpenAPI documents.

Follow the [WireMock MCP installation guide](https://docs.wiremock.io/ai-mcp/installation) to install the WireMock CLI, log in to your WireMock Cloud account, and configure the MCP server for Claude Code.

#### Arazzo Runner MCP

Provides the `run_workflow` tool for executing [Arazzo](https://spec.openapis.org/arazzo/latest.html) workflow specifications against APIs.

Install via the Claude Code CLI:

```bash
claude mcp add --transport stdio arazzo-runner -- npx @wiremock/arazzo-runner mcp
```

Or add it manually to your MCP config (`~/.claude/mcp.json` or project-level):

```json
{
  "mcpServers": {
    "arazzo-runner": {
      "type": "stdio",
      "command": "npx",
      "args": ["@wiremock/arazzo-runner", "mcp"]
    }
  }
}
```

### Node.js

[Node.js](https://nodejs.org/) v18 or later is required for the MCP servers.

## Installation

Clone this repository (or download it), then copy the skill into your Claude Code skills directory.

**For personal use (available in all projects):**

```bash
git clone git@github.com:wiremock-inc/make-simulation-skill.git
mkdir -p ~/.claude/skills
cp -r make-simulation-skill ~/.claude/skills/api-simulation-builder
```

**For a specific project:**

```bash
git clone git@github.com:wiremock-inc/make-simulation-skill.git
mkdir -p /path/to/your/project/.claude/skills
cp -r make-simulation-skill /path/to/your/project/.claude/skills/api-simulation-builder
```

## Usage

In a Claude Code session, invoke the skill with:

```
/api-simulation-builder <api-name>
```

For example:

```
/api-simulation-builder Stripe Payments
```

The skill will prompt you for additional information:
- Whether a sandbox/test environment is available (and its base URL)
- Paths to any authenticator config files for the sandbox
- URLs or file paths to existing OpenAPI specs or API documentation
- Whether the mock should be stateful

## Project Structure

```
.
├── SKILL.md              # Skill definition and instructions
└── references/           # Bundled reference documentation
    ├── stub-creation.md
    ├── stateful-stubbing.md
    ├── api-crawling.md
    ├── data-driven-stubbing.md
    └── validating-and-fixing.md
```
