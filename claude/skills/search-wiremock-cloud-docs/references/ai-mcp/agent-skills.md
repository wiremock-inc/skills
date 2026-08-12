<!-- AUTO-GENERATED from common/skills/... — do not edit directly; edit the source and run `npm run build`. -->

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# WireMock Cloud agent skills

> Install the WireMock Cloud agent skills plugin to give your coding agent the ability to build, validate, and manage mock APIs

<iframe width="100%" style={{ aspectRatio: '16/9' }} src="https://www.youtube.com/embed/zGRrmHS6Hpw" title="WireMock Cloud agent skills" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />

The WireMock Cloud [agent skills](https://agentskills.io/home) plugin gives coding agents specialised knowledge and workflows for building and managing mock APIs in WireMock Cloud. Once installed, your agent can generate complete API simulations, create and validate stubs, convert stubs to stateful or data-driven variants, author response templates, and search the WireMock Cloud documentation - all without leaving your editor or terminal.

Agent Skills is an open format for extending AI agents with domain-specific capabilities. A skill is a folder containing a `SKILL.md` file with instructions and optional supporting resources. Agents discover skills at startup, load them when relevant, and follow the instructions to complete tasks.

## Available skills

The plugin bundles seven skills:

| Skill                      | Description                                                                                                                                      |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/build-api-simulation`    | Generate a complete mock API for any REST API - OpenAPI spec, Arazzo test workflows, and WireMock stubs, optionally recorded from a live sandbox |
| Create stubs               | Create and import WireMock stubs for a mock API                                                                                                  |
| Convert to stateful        | Convert existing stubs to be stateful using the key-value state store                                                                            |
| Convert to data-driven     | Convert existing stubs to use CSV or database data sources                                                                                       |
| Validate and fix stubs     | Validate stubs against the OpenAPI schema and fix any errors                                                                                     |
| Author response templates  | Author and debug Handlebars response templates for WireMock stubs                                                                                |
| Search WireMock Cloud docs | Search cached WireMock Cloud documentation for accurate answers about stubs, request matching, response templating, CLI, Runner, and more        |

`/build-api-simulation` is a user-invocable slash command - type it to kick off a full API simulation workflow. The remaining skills are triggered automatically by context when relevant to the task at hand.

## Prerequisites

Before using the skills you need the WireMock CLI installed and authenticated, as several skills interact with the WireMock Cloud API through MCP:

```bash theme={null}
npm i -g @wiremock/cli
wiremock login
```

You should also have the WireMock MCP server configured in your agent. See the [MCP installation guide](/ai-mcp/installation) for setup instructions.

## Supported agents

The Agent Skills format is supported by a growing number of coding agents. The table below lists agents that can use the WireMock Cloud skills plugin, with installation instructions for each.

<Tabs>
  <Tab title="Claude Code">
    Claude Code has native support for agent skills via its [plugin system](https://code.claude.com/docs/en/skills).

    Add the marketplace registry containing the WireMock skills, then install the plugin from your terminal:

    ```bash theme={null}
    claude plugin marketplace add wiremock-inc/skills
    claude plugin install wiremock-cloud@wiremock-inc-skills
    ```

    Or within an interactive Claude Code session:

    ```
    /plugin marketplace add wiremock-inc/skills
    /plugin install wiremock-cloud@wiremock-inc-skills
    ```

    This installs all seven skills. You can verify by asking Claude Code:

    ```
    What skills are available?
    ```

    You should see the WireMock Cloud skills listed. You can invoke the main skill directly:

    ```
    /build-api-simulation
    ```
  </Tab>

  <Tab title="GitHub Copilot">
    The [GitHub Copilot coding agent](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills) and VS Code agent mode discover skills from `.github/skills/` or `.claude/skills/` directories in your repository.

    Clone the skills into your project's `.github/skills/` directory:

    ```bash theme={null}
    git clone https://github.com/wiremock-inc/skills.git /tmp/wiremock-skills
    cp -r /tmp/wiremock-skills/skills/* .github/skills/
    rm -rf /tmp/wiremock-skills
    ```

    Alternatively, add them as a Git submodule for easier updates:

    ```bash theme={null}
    git submodule add https://github.com/wiremock-inc/skills.git .github/wiremock-skills
    ```

    The skills will be discovered automatically by the Copilot coding agent and in VS Code agent mode.

    <Note>
      Always review shared skills before using them. See the [GitHub Copilot agent skills documentation](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills) for details.
    </Note>
  </Tab>

  <Tab title="GitHub Copilot CLI">
    [GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-finding-installing) has a built-in plugin system for installing skills from marketplaces and Git repositories.

    Add the marketplace registry containing the WireMock skills, then install the plugin:

    ```bash theme={null}
    copilot plugin marketplace add wiremock-inc/skills
    copilot plugin install wiremock-cloud@wiremock-inc-skills
    ```

    Or within an interactive session:

    ```
    /plugin marketplace add wiremock-inc/skills
    /plugin install wiremock-cloud@wiremock-inc-skills
    ```

    You can also install directly from the GitHub repository without adding a marketplace first:

    ```bash theme={null}
    copilot plugin install wiremock-inc/skills
    ```

    Verify the installation:

    ```bash theme={null}
    copilot plugin list
    ```

    You can then invoke the main skill directly:

    ```
    /build-api-simulation
    ```
  </Tab>

  <Tab title="VS Code + Copilot">
    VS Code discovers agent skills from `.github/skills/` or `.claude/skills/` directories in your workspace.

    Copy the skills into your project:

    ```bash theme={null}
    git clone https://github.com/wiremock-inc/skills.git /tmp/wiremock-skills
    cp -r /tmp/wiremock-skills/skills/* .github/skills/
    rm -rf /tmp/wiremock-skills
    ```

    After reloading VS Code, the skills will be available in Copilot chat agent mode. See the [VS Code agent skills documentation](https://code.visualstudio.com/docs/copilot/customization/agent-skills) for more details.
  </Tab>

  <Tab title="Cursor">
    Cursor automatically discovers skills from `.cursor/skills/` or `.claude/skills/` directories.

    **Option 1: Import from GitHub (recommended)**

    1. Open Cursor Settings (`Cmd+Shift+J` on Mac, `Ctrl+Shift+J` on Windows/Linux).
    2. Navigate to **Rules**.
    3. In the **Project Rules** section, click **Add Rule**.
    4. Select **Remote Rule (Github)**.
    5. Enter `https://github.com/wiremock-inc/skills`.

    **Option 2: Copy manually**

    ```bash theme={null}
    git clone https://github.com/wiremock-inc/skills.git /tmp/wiremock-skills
    cp -r /tmp/wiremock-skills/skills/* .cursor/skills/
    rm -rf /tmp/wiremock-skills
    ```

    Verify the skills are loaded in **Cursor Settings → Rules**, where they should appear in the "Agent Decides" section.
  </Tab>

  <Tab title="Cursor CLI">
    The [Cursor CLI](https://cursor.com/docs/cli/overview) provides terminal-based access to the Cursor agent. It automatically discovers skills from the same directories as the Cursor editor - `.cursor/skills/` and `.claude/skills/` in your project.

    Copy the skills into your project:

    ```bash theme={null}
    git clone https://github.com/wiremock-inc/skills.git /tmp/wiremock-skills
    mkdir -p .cursor/skills
    cp -r /tmp/wiremock-skills/skills/* .cursor/skills/
    rm -rf /tmp/wiremock-skills
    ```

    Start an interactive session and the skills will be available:

    ```bash theme={null}
    cursor agent
    ```

    You can then invoke the main skill directly:

    ```
    /build-api-simulation
    ```
  </Tab>

  <Tab title="Other agents">
    The Agent Skills format is supported by many other coding agents including Gemini CLI, OpenAI Codex, JetBrains Junie, Windsurf, Goose, Roo Code, and more. See [agentskills.io](https://agentskills.io/home) for the full list.

    For any compatible agent, clone the skills repository and copy the `skills/` directory contents into the location your agent expects:

    ```bash theme={null}
    git clone https://github.com/wiremock-inc/skills.git /tmp/wiremock-skills
    cp -r /tmp/wiremock-skills/skills/* <your-agent-skills-directory>/
    rm -rf /tmp/wiremock-skills
    ```

    Common skill directory locations:

    | Agent           | Directory         |
    | --------------- | ----------------- |
    | Gemini CLI      | `.gemini/skills/` |
    | OpenAI Codex    | `.codex/skills/`  |
    | JetBrains Junie | `.junie/skills/`  |
    | Goose           | `.goose/skills/`  |
    | Roo Code        | `.roo/skills/`    |

    Consult your agent's documentation for the exact path and any additional configuration.
  </Tab>
</Tabs>

## Skills vs MCP

The WireMock Cloud agent skills and the [WireMock MCP server](/ai-mcp/installation) are complementary:

* **MCP** gives your agent *tools* - the ability to call the WireMock Cloud API, search stubs, manage mock APIs, and make HTTP requests.
* **Skills** give your agent *expertise* - knowledge of WireMock Cloud concepts, best practices, and multi-step workflows that orchestrate those tools effectively.

For the best experience, install both. The skills rely on MCP tools to interact with WireMock Cloud, while MCP tools are more effective when the agent has the domain knowledge that skills provide.
