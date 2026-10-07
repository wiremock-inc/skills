<!-- AUTO-GENERATED from common/skills/... — do not edit directly; edit the source and run `npm run build`. -->

# Build gRPC Simulation - Claude Code Skill

A [Claude Code](https://docs.anthropic.com/en/docs/claude-code) skill that generates complete gRPC API simulations in [WireMock Cloud](https://www.wiremock.io/) from a Protocol Buffers definition.

Given a `.proto` file or a pre-built descriptor set (`.dsc`), the skill will:

1. Compile the proto to a descriptor set (or use the supplied `.dsc`)
2. Create and configure a gRPC mock API in WireMock Cloud
3. Upload the descriptor set so WireMock can validate requests and responses
4. Populate the mock with stubs — either probed from a live gRPC endpoint or generated from the proto
5. Verify the mock with grpcurl and fix issues iteratively
6. Optionally convert the mock to be stateful, so that created resources can be subsequently retrieved and listed

## Prerequisites

### MCP Server

This skill requires the following MCP server to be configured in your Claude Code settings:

#### WireMock Cloud MCP

Provides tools for managing mock APIs, stubs, and file uploads (including gRPC descriptor sets).

No manual setup is needed beyond installing this plugin — a `.mcp.json` bundled with the plugin configures the WireMock Cloud MCP server automatically. The first tool call that needs it will prompt you to sign in to your WireMock Cloud account in the browser.

### grpcurl

[grpcurl](https://github.com/fullstorydev/grpcurl) is required for inspecting descriptor sets, probing live endpoints, and testing stubs.

```bash
brew install grpcurl   # macOS
```

Or download a release from https://github.com/fullstorydev/grpcurl/releases.

### protoc

[protoc](https://grpc.io/docs/protoc-installation/) (Protocol Buffers compiler) is required only when the input is a `.proto` file. Not needed when you supply a pre-built descriptor set (`.dsc`).

```bash
brew install protobuf   # macOS
```



## Usage

In a Claude Code session, invoke the skill with:

```
/build-grpc-simulation <path-to-proto-or-dsc-file>
```

For example:

```
/build-grpc-simulation ./protos/orders.proto
```

or:

```
/build-grpc-simulation ./orders.dsc
```

The skill will prompt you for additional information:
- Mock API name (and whether to reuse an existing one)
- Whether a live gRPC endpoint is available to probe (host:port, TLS, reflection)
- Whether the mock should be stateful

## Project Structure

```
.
├── SKILL.md                    # Skill definition and instructions
└── ../references/              # Shared reference documentation
    ├── grpc-stub-rules.md
    ├── grpc-stateful-stubbing.md
    ├── stub-creation.md
    └── file-transfer.md
```
