> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Installing WireMock Cloud AI

> How to install the WireMock Cloud MCP server and integrate it with your AI tool

This guide walks you through configuring the MCP (Model Context Protocol) server necessary to natively use WireMock Cloud from an MCP-compatible AI tool such as Cursor or Claude Desktop.

This enables automatic API discovery, mocking and test abstraction from any codebase as part of prompt-driven development with your chosen AI tool.

Additionally, it enables you to skip the complexity of building out new services early on - which can hamper the rapid development by introducing more failure points - and instead use simulated APIs on WireMock to prototype new capabilities with less system overhead.

**Note** that while this article documents use with Cursor, Claude Desktop and VSCode specifically, WireMock Cloud’s MCP server will work with any AI-powered tool that supports MCP.

## Prerequisites

* Node.js 18+ (to install the CLI)
* An existing WireMock Cloud account (if you don’t have one, you can sign up during the login step)

## Step 1: Install the WireMock CLI

Install the CLI globally using npm:

```bash  theme={null}
npm i -g @wiremock/cli
```

## Step 2: Log in to WireMock Cloud

If you already have a WireMock Cloud account, simply log in. Otherwise, the login process will guide you through creating an account:

```bash  theme={null}
wiremock login
```

## Step 3: Configure your AI tool

<Tabs>
  <Tab title="Cursor">
    Click this button to install with Cursor:

    <a href="cursor://anysphere.cursor-deeplink/mcp/install?name=WireMock&config=eyJjb21tYW5kIjoid2lyZW1vY2sgbWNwIn0=">
      <img src="https://cursor.com/deeplink/mcp-install-light.png" alt="Add WireMock MCP server to Cursor" />
    </a>

    Or, follow these instructions:

    * Open Settings->Cursor settings.
    * Navigate to MCP.
    * Click Add new MCP server.
    * In the dialog, configure your server to run this command:

    ```bash  theme={null}
    wiremock mcp
    ```

    <img src="https://mintcdn.com/wiremockinc/46NqgX7QaQdjW6uv/images/ai/server-config.png?fit=max&auto=format&n=46NqgX7QaQdjW6uv&q=85&s=df6d4771527a298267fc9413414cab13" width="360" alt="Configure MCP server" data-path="images/ai/server-config.png" />

    * Verify Installation by looking for the green status dot next to the MCP server and the list of tool names.

    <img src="https://mintcdn.com/wiremockinc/46NqgX7QaQdjW6uv/images/ai/enabled-server.png?fit=max&auto=format&n=46NqgX7QaQdjW6uv&q=85&s=e01a0c1bf07faca6c29affcb5b2827b0" alt="Verify the MCP server is active" width="1232" height="258" data-path="images/ai/enabled-server.png" />

    If you have an existing real API integration, you can replace it with a WireMock stub. Generate the mock from documentation, source code, or other external description formats. This enables you to test your app in isolation without depending on live services.

    ### Step 6: Confirm Your Setup

    To confirm everything is working correctly, check that you’re logged in to WireMock Cloud by running the following prompt:

    ```
    Am I logged into WireMock Cloud?
    ```

    If logged in, you’ll see your account details rather than being prompted to sign in.

    <img src="https://mintcdn.com/wiremockinc/46NqgX7QaQdjW6uv/images/ai/logged-in.png?fit=max&auto=format&n=46NqgX7QaQdjW6uv&q=85&s=ff1b697ef56c5ebd4bd829c14ad3c95e" width="550" alt="Confirm you are logged in via the CLI" data-path="images/ai/logged-in.png" />
  </Tab>

  <Tab title="VSCode + GitHub Copilot">
    * In VSCode, open the `settings.json` file via Settings...->Settings then clicking the Open Settings (JSON) link in the top right.
    * Add the `mcp` element to the settings JSON:
      ```json  theme={null}
      {
        "mcp": {
                "servers": {
                    "WireMock": {
                        "type": "stdio",
                        "command": "wiremock",
                        "args": [
                            "mcp"
                        ]
                    }
                }
            }
      }
      ```
    * Restart VSCode

    ### Step 6: Confirm Your Setup

    Open the Copilot chat window and confirm that the tools icon is present with a number above zero:

    <img src="https://mintcdn.com/wiremockinc/46NqgX7QaQdjW6uv/images/ai/enabled-tools-icon.png?fit=max&auto=format&n=46NqgX7QaQdjW6uv&q=85&s=6f0b8e00143a232a25a3b7b7651630a4" width="50" alt="Copilot tools icon" data-path="images/ai/enabled-tools-icon.png" />

    To confirm everything is working correctly, check that you’re logged in to WireMock Cloud by running the following prompt:

    ```
    Who am I logged into WireMock Cloud as?
    ```

    If logged in, you’ll see your account details rather than being prompted to sign in.

    <img src="https://mintcdn.com/wiremockinc/46NqgX7QaQdjW6uv/images/ai/vscode-whoami.png?fit=max&auto=format&n=46NqgX7QaQdjW6uv&q=85&s=fe98ecd08cfaefb62de44b1aa6cb6f04" width="550" alt="Confirm you are logged in via the CLI" data-path="images/ai/vscode-whoami.png" />
  </Tab>

  <Tab title="Claude Code">
    * Open your terminal or command prompt.
    * Add the WireMock MCP server using the Claude CLI:

    ```bash  theme={null}
    claude mcp add wiremock -- wiremock mcp
    ```

    * Verify the server was added successfully:

    ```bash  theme={null}
    claude mcp list
    ```

    <img src="https://mintcdn.com/wiremockinc/46NqgX7QaQdjW6uv/images/ai/claude-code-mcp-install.png?fit=max&auto=format&n=46NqgX7QaQdjW6uv&q=85&s=0fb766fc40bfa3d99176a98123b81fd2" width="500" alt="Claude Code MCP install" data-path="images/ai/claude-code-mcp-install.png" />

    * You should see "wiremock" in the list of configured MCP servers.

    ### Step 6: Confirm Your Setup

    To confirm everything is working correctly, check that you're logged in to WireMock Cloud by running the following prompt in Claude Code:

    ```
    Am I logged into WireMock Cloud?
    ```

    If logged in, you'll see your account details:

    <img src="https://mintcdn.com/wiremockinc/46NqgX7QaQdjW6uv/images/ai/claude-code-success.png?fit=max&auto=format&n=46NqgX7QaQdjW6uv&q=85&s=8d289f3d8441ae39fd94a8f19f8c7f28" alt="Claude Code MCP success" width="1562" height="904" data-path="images/ai/claude-code-success.png" />
  </Tab>

  <Tab title="Claude Desktop">
    * Open Settings->Developer.
    * Click Edit Config and open the config file in your preferred editor.
    * Add the WireMock MCP server to the file. The whole file will look like this if this is the first MCP server installed:

    ```json  theme={null}
    {
        "mcpServers": {
        "wiremock": {
        "command": "wiremock",
        "args": [
        "mcp"
        ]
    }
    }
    }
    ```

    * Restart Claude Desktop.

    ### Step 6: Confirm Your Setup

    To confirm everything is working correctly, check that you’re logged in to WireMock Cloud by running the following prompt:

    ```
    Am I logged into WireMock Cloud?
    ```

    After confirming it is OK for Claude to use the tool, if logged in, you’ll see your account details rather than being prompted to sign in.

    <img src="https://mintcdn.com/wiremockinc/46NqgX7QaQdjW6uv/images/ai/claude-whoami.png?fit=max&auto=format&n=46NqgX7QaQdjW6uv&q=85&s=3f560a3bbb9bc08e59f3bacde97a1edb" width="550" alt="Confirm you are logged in via the CLI" data-path="images/ai/claude-whoami.png" />
  </Tab>

  <Tab title="Windsurf">
    * Navigate to **Windsurf Settings** > **Cascade** > **Plugins**.
    * Click **Manage plugins** to access the raw configuration.
    * Click **View raw config** to edit the `mcp_config.json` file (located at `~/.codeium/windsurf/mcp_config.json`) and add:

      ```json  theme={null}
      {
        "mcpServers": {
          "wiremock": {
            "command": "wiremock",
            "args": ["mcp"]
          }
        }
      }
      ```

      * Save the configuration and press the refresh button in the Plugin Store.

      <img src="https://mintcdn.com/wiremockinc/46NqgX7QaQdjW6uv/images/ai/windsurf-manage-plugins.png?fit=max&auto=format&n=46NqgX7QaQdjW6uv&q=85&s=fd9589396496c688c448347826048af1" alt="Windsurf Manage Plugins" width="1590" height="650" data-path="images/ai/windsurf-manage-plugins.png" />

      ### Step 6: Confirm Your Setup

      To confirm everything is working correctly, check that you're logged in to WireMock Cloud by running the following prompt in Cascade:

      ```
      Am I logged into WireMock Cloud?
      ```

      If logged in, you'll see your account details rather than being prompted to sign in.
  </Tab>
</Tabs>

## Next Steps

With WireMock MCP successfully installed, you can begin creating and using mocks in your development workflow:

### Generate a new feature and mock a new API

Develop a new feature in your application that calls a fresh API. Quickly generate a WireMock stub for this API, and then wire it up to your app while in development mode.

### Swap an existing API connection for a mock

If you have an existing real API integration, you can replace it with a WireMock Cloud mock. Generate the mock from documentation, source code, or other external description formats. This enables you to test your app in isolation without depending on live services.

