> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# WireMock CLI

> How to use the WireMock CLI

## Overview

The WireMock CLI offers ways to get benefits of WireMock Cloud that are hard or impossible to achieve using the web
interface.

## Installation

You can install the WireMock CLI using npm:

```shell  theme={null}
npm install --global @wiremock/cli
```

## Usage

A list of available commands can be found as follows:

```shell  theme={null}
wiremock -h
```

For any given command, additional help can be found as follows:

```shell  theme={null}
wiremock <command> -h
```

e.g.

```shell  theme={null}
wiremock record -h
```

### Setting command options

Most commands provided by the WireMock CLI take options that control how the command is executed.
For example, the `record-many` command can take a `--request-log-level` option like so:

```shell  theme={null}
wiremock record-many --request-log-level=full
```

In some cases, specifying these options directly on the command line is undesirable.
For instance, if you wanted to always execute the `record-many` command with a default set of option values, it would
be simpler to persist these values somewhere that the CLI could read without having to type them into the terminal
every time.

Another use case where writing values on the command line is problematic is when sensitive data is contained within
option values.
For options that commonly take sensitive data, the WireMock CLI will revert to prompting you for the option value via
stdin (if it's not provided directly on the command line), but interactive prompting is not possible on non-interactive
terminals.

For the cases where providing option values via the command line is not desirable, it is possible to set command
options via environment variables and/or in a values file:

#### Environment variables

All CLI options (except for helper options like `--help`) can be specified via environment variables.
The name of the environment variable always follows the pattern `WMC_<SUBCOMMAND_NAME>_<OPTION_NAME>` where
`<SUBCOMMAND_NAME>` is the name of the subcommand, that the option is relevant to, and `<OPTION_NAME>` is the name of
the option itself.
Note that all dashes (`-`) are replaced by underscores (`_`).
For example,

```shell  theme={null}
WMC_RECORD_MANY_REQUEST_LOG_LEVEL=full wiremock record-many
```

is equivalent to

```shell  theme={null}
wiremock record-many --request-log-level=full
```

Options for nested subcommands, such as `wiremock mock-apis list`, delimit their subcommand names with underscores
(`_`), like so:

```shell  theme={null}
WMC_MOCK_APIS_LIST_OUTPUT=json wiremock mock-apis list
```

Flag options, such as the `--watch` option of `wiremock push open-api`, can be specified via a boolean value.
For example,

```shell  theme={null}
WMC_PUSH_OPEN_API_WATCH=true wiremock push open-api
```

#### Values file

All CLI options (except for helper options like `--help`) can be specified within a YAML values file.
Option values must be provided as nested fields within their respective subcommand objects.
Note that all dashes (`-`) are replaced by underscores (`_`).
For example, consider the following values file:

```yaml  theme={null}
record_many:
  request_log_level: full
```

Running `wiremock record-many` with this values file is equivalent to

```shell  theme={null}
wiremock record-many --request-log-level=full
```

The default path that the CLI will use to look for a values file is `.wiremock/config.yaml` within the working
directory that the command was executed in.
This path can be overridden by setting the environment variable `WMC_VALUES_CONFIG_FILE` to a custom file path.

<Note>
  Note that setting the `--wiremock-dir` option on commands such as `record-many` will not affect where the CLI will
  search for the default values file.
</Note>

Options for nested subcommands, such as `wiremock mock-apis list`, are nested like so:

```yaml  theme={null}
mock_apis:
  list:
    output: json
```

Flag options, such as the `--watch` option of `wiremock push open-api`, can be specified via a boolean value.
For example,

```yaml  theme={null}
push:
  open_api:
    watch: true
```

#### Precedence

Providing options via the command line, environment variables and a values files can be used interchangeably and mixed.
Option values provided via the command line take precedence over those provided via environment variables, which in
turn take precedence over those specified in the values file.

### Installing command completion

The WireMock CLI includes a command completion feature that enables you to use the `Tab` key to complete a partially entered command, argument or option.
To set up this feature for your shell, run the following command

```shell  theme={null}
wiremock completion init
```

This will take you through the steps required to install the completion script and configure your shell to use this script.

Currently supported shells are [bash](https://www.gnu.org/software/bash/), [zsh](https://www.zsh.org/), and [fish](https://fishshell.com/).

## Current Commands

### Login

Most commands require you to have authenticated with WireMock Cloud. You can achieve this by running:

```shell  theme={null}
wiremock login
```

and following the instructions.

<Info>
  If you have [set your API endpoint](/cli/config#configuring-your-api-endpoint) to a custom endpoint,
  `wiremock login` will no longer work, so [setting your API token using the config
  subcommand](/cli/config#configuring-your-api-token) is the only available method for authenticating.
</Info>

### Checking if logged in

Running

```shell  theme={null}
wiremock whoami
```

will either report the currently logged in user and exit successfully, or fail reporting that no-one is logged in.

### Logout

Running

```shell  theme={null}
wiremock logout
```

will log the current user out.

### Config

Command for configuring your WireMock CLI installation. See [Configuring the CLI](/cli/config) for details.

### Mock APIs

Commands for managing your mock APIs. See [Managing Mock APIs with the CLI](/cli/mock-apis) for details.

### Local Run

Command for running your mock APIs locally. See [Running Mock APIs Locally](/cli/local-playback) for details.

### Record

See detailed documentation at [Recording using the WireMock CLI](/cli/recording/)

### Record Many

See detailed documentation at [Multi-domain recording using the WireMock CLI](/cli/multi-domain-recording/)

### MCP

Runs an MCP server for use with AI tools. Intended to be called from the AI tool's MCP configuration rather than directly in the terminal.

See detailed documentation at [WireMock Cloud AI](/ai-mcp/installation/)

