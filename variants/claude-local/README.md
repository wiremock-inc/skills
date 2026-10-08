# WireMock Cloud for Claude (Local CLI)

[WireMock Cloud](https://www.wiremock.io) is a hosted API simulation platform for building mock APIs that stand in for real services during development, testing and CI.

This plugin provides the same eight WireMock Cloud Agent Skills as the `wiremock-cloud` plugin: building API simulations, creating and validating stubs, converting stubs to stateful or data-driven behaviour, authoring response templates, reviewing simulations and searching the WireMock Cloud documentation. The difference is the MCP server. Instead of the hosted server, this plugin starts a **local MCP server through the WireMock CLI** (`wiremock mcp`) on your machine, which then talks to WireMock Cloud on your behalf.

Choose this plugin if you already use the WireMock CLI, or if you need the MCP server to run inside your own environment. Otherwise, use `wiremock-cloud`. Don't install both, because they register the same server name.

## Requirements

- The [WireMock CLI](https://docs.wiremock.io/cli/overview), installed and on your `PATH`. Install it with `npm i -g @wiremock/cli`.
- A WireMock Cloud account. Sign in once with `wiremock login` before using the plugin.

## Where it works

The plugin's MCP server is a local (stdio) process, so it works in **Claude Code** and **Cowork**. It is **not available on claude.ai on the web**, which can't start programs on your computer. On the web, use the `wiremock-cloud` plugin and its hosted MCP server instead.

## Setup

```
/plugin marketplace add wiremock-inc/skills
/plugin install wiremock-cloud-local@wiremock-inc-skills
```

## What the plugin sends and runs

- **MCP server:** Claude Code runs `wiremock mcp` from your installed WireMock CLI. The CLI uses the session you created with `wiremock login`. The plugin itself contains no credentials and doesn't read any.
- **Data sent to WireMock Cloud:** to carry out what you ask, the CLI sends the relevant instructions and API-simulation content to your WireMock Cloud account. That includes mock API names, stub mappings, OpenAPI and Arazzo documents, and recordings. See the [privacy policy](https://www.wiremock.io/privacy-policy).
- **Local commands:** the skills may run the bundled read-only Python helper scripts in `skills/build-api-simulation/scripts/`. They may use `curl` to send test requests to your mock API or download a public OpenAPI description. They may also run the pinned `npx @wiremock/arazzo-runner@1.4.0` and `npx swagger2openapi@7.0.8`, which `npx` downloads from the npm registry on first use.

The documentation under `skills/search-wiremock-cloud-docs/references/` is reference material, and the plugin doesn't run its examples automatically.

## Links

- Documentation: https://docs.wiremock.io
- WireMock CLI: https://docs.wiremock.io/cli/overview
- Support: https://www.wiremock.io/contact-now or support@wiremock.io
- Privacy policy: https://www.wiremock.io/privacy-policy
- Source: https://github.com/wiremock-inc/skills

## License

Apache License 2.0. See [LICENSE](LICENSE).
