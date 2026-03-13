> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# CLI Command Reference

> Complete reference documentation for all WireMock CLI commands

This reference documents all available commands, subcommands, and options in the WireMock CLI. For general usage and installation instructions, see [Installation and basic usage](/cli/overview).

## Global options

These options are available for all commands:

### -V, --version

Show the version and exit.

```shell  theme={null}
wiremock --version
```

### -h, --help

Show help message and exit. Can be used with any command or subcommand.

```shell  theme={null}
wiremock --help
wiremock record --help
```

## Authentication commands

### login

Login to WireMock Cloud. This command must have been executed at least once before executing most other commands.

```shell  theme={null}
wiremock login
```

Opens a browser window for authentication. Once complete, your credentials are stored locally.

<Info>
  If you have [set your API endpoint](/cli/config#configuring-your-api-endpoint) to a custom endpoint, `wiremock login` will no longer work. Use [config set](/cli/config#configuring-your-api-token) to set your API token directly.
</Info>

### logout

Remove all WireMock Cloud user information from the CLI configuration.

```shell  theme={null}
wiremock logout
```

### whoami

View information on the currently logged in user.

```shell  theme={null}
wiremock whoami
```

Displays the username and email of the authenticated user. Exits with an error if not logged in.

## config

Commands to manage your local WireMock CLI configuration.

See [Configuring the CLI](/cli/config) for detailed documentation.

### config get

View a config value.

```shell  theme={null}
wiremock config get <key>
```

**Arguments:**

* `<key>` - Configuration key to retrieve. Valid options:
  * `api_token` - The API token to use when calling the WireMock Cloud API
  * `api_endpoint` - The API endpoint to the WireMock Cloud API

**Example:**

```shell  theme={null}
wiremock config get api_endpoint
```

### config set

Set a config value.

```shell  theme={null}
wiremock config set <key> [<value>]
```

**Arguments:**

* `<key>` - Configuration key to set. Valid options:
  * `api_token` - The API token to use when calling the WireMock Cloud API
  * `api_endpoint` - The API endpoint to the WireMock Cloud API
* `<value>` - The value to set (optional). Omit this argument to enter the value interactively (recommended for confidential config values)

**Example:**

```shell  theme={null}
wiremock config set api_token
wiremock config set api_endpoint https://api.wiremock.cloud
```

### config unset

Clear a single config value.

```shell  theme={null}
wiremock config unset <key>
```

**Arguments:**

* `<key>` - Configuration key to clear. Valid options:
  * `api_token` - The API token to use when calling the WireMock Cloud API
  * `api_endpoint` - The API endpoint to the WireMock Cloud API

**Example:**

```shell  theme={null}
wiremock config unset api_token
```

### config clear

Clear all config values.

```shell  theme={null}
wiremock config clear
```

Removes all stored configuration including authentication credentials.

## mock-apis

Commands to interact with your mock APIs.

See [Managing Mock APIs with the CLI](/cli/mock-apis) for detailed documentation.

### mock-apis list

List your mock APIs.

```shell  theme={null}
wiremock mock-apis list [<options>]
```

**Options:**

* `--limit=<int>` - The maximum number of mock APIs to return (default: 20)
* `--page=<int>` - The page of mock APIs to return (default: 1)
* `--query=<text>` - The query with which to filter mock APIs
* `-o, --output=(text|json)` - The output format to use (default: text)

**Examples:**

```shell  theme={null}
wiremock mock-apis list
wiremock mock-apis list --limit=50 --page=2
wiremock mock-apis list --query="payment" --output=json
```

### mock-apis create

Create a new mock API.

```shell  theme={null}
wiremock mock-apis create [<options>] <name>
```

**Arguments:**

* `<name>` - The name of the mock API to create (required)

**Options:**

* `-o, --hostname=<text>` - Optional hostname for the mock API
* `-t, --type=(REST|Unstructured|gRPC|GraphQL)` - Type of the mock API (default: REST)

**Examples:**

```shell  theme={null}
wiremock mock-apis create "My API"
wiremock mock-apis create "GraphQL Service" --type=GraphQL
wiremock mock-apis create "Payment API" --hostname=payment-api
```

### mock-apis delete

Delete a mock API by ID.

```shell  theme={null}
wiremock mock-apis delete [<options>] <mock_api_id>
```

**Arguments:**

* `<mock_api_id>` - The ID of the mock API to delete (required)

**Options:**

* `-f, --force` - Force delete the mock API without confirmation

**Examples:**

```shell  theme={null}
wiremock mock-apis delete abc123xyz
wiremock mock-apis delete abc123xyz --force
```

## record

Record requests to a proxied API and import the converted stubs into a mock API.

See [Recording using the WireMock CLI](/cli/recording) for detailed documentation.

```shell  theme={null}
wiremock record [<options>] <from>
```

**Arguments:**

* `<from>` - The URL of the target API to record from (required)

**Options:**

#### Recording behavior

* `--to=<cloud:mock_api_id>` - The ID of the mock API to import recorded stubs into. You will be prompted to choose a mock API if omitted.
* `-p, --reverse-proxy-port=<int>` - The local port to proxy requests through. Set to '0', '-1', or 'random' to assign a random port (default: 8000)

#### Logging

* `--request-log-level=(off|summary|full)` - How recorded requests are displayed in the console during recording (default: summary for interactive sessions, off for non-interactive sessions)
* `-q` - Equivalent of `--request-log-level=off`
* `-v` - Equivalent of `--request-log-level=full`

#### Import configuration

* `--import-config-file=<path>` - Path to a file containing custom configuration for handling how recorded requests are converted into stubs
* `--max-batch-requests, --batch-size=<int>` - The maximum amount of requests to import to the mock API in a single batch while recording. Given a max batch of N requests, an import to the mock API will occur for every N requests recorded. If omitted, all requests will be imported at the end of the session in a single batch.
* `--max-batch-bytes=<binary_size>` - The maximum amount of bytes to import to the mock API in a single batch while recording. Given a max batch of N bytes, an import to the mock API will occur for every N bytes recorded. Note, if a single recorded request exceeds the maximum number of bytes, this request will still be sent (in a batch of one). If omitted, all requests will be imported at the end of the session in a single batch. (examples: 5120, 5kB, 5kiB, 10 MB)

#### TLS/Client certificates

* `-c, --client-certificate=<path>` - Path to a PEM-encoded RSA private key and X509 certificate needed to authenticate against the target API using mutual TLS. Alternative to `--client-certificate-store`.
* `--client-certificate-store=<path>` - Path to a keystore (pkcs12, jks etc.) containing the private key and certificate needed to authenticate against the target API using mutual TLS. Alternative to `--client-certificate`.
* `--client-certificate-store-password=<value>` - Password to unlock the client certificate store if provided.

**Examples:**

```shell  theme={null}
wiremock record https://api.example.com
wiremock record https://api.example.com --to=cloud:abc123xyz
wiremock record https://api.example.com -p 9000 -v
wiremock record https://api.example.com --import-config-file=./config.yaml
wiremock record https://api.example.com --max-batch-requests=100
wiremock record https://secure-api.example.com --client-certificate=./cert.pem
```

## record-many

Record requests to multiple proxied APIs and import the converted stubs into a mock API for each target API.

See [Multi-domain recording using the WireMock CLI](/cli/multi-domain-recording) for detailed documentation.

```shell  theme={null}
wiremock record-many [<options>]
```

**Options:**

#### Recording configuration

* `--wiremock-dir=<path>` - The path to the wiremock directory, containing services to record (default: .wiremock)
* `-p, --profile=<text>` - Profile name to use for this environment eg dev or staging
* `--include-services=<text>` - Comma separated list of service keys from the recording configuration file which should be recorded. All services will still proxy. If omitted, all services will be recorded.

#### Logging

* `--request-log-level=(off|summary|full)` - How recorded requests are displayed in the console during recording (default: summary for interactive sessions, off for non-interactive sessions)
* `-q` - Equivalent of `--request-log-level=off`
* `-v` - Equivalent of `--request-log-level=full`

#### Import configuration

* `--import-config-file=<path>` - Path to a file containing custom configuration for handling how recorded requests are converted into stubs
* `--max-batch-requests, --batch-size=<int>` - The maximum amount of requests to import to the mock API in a single batch while recording. Given a max batch of N requests, an import to the mock API will occur for every N requests recorded. If omitted, all requests will be imported at the end of the session in a single batch.
* `--max-batch-bytes=<binary_size>` - The maximum amount of bytes to import to the mock API in a single batch while recording. Given a max batch of N bytes, an import to the mock API will occur for every N bytes recorded. Note, if a single recorded request exceeds the maximum number of bytes, this request will still be sent (in a batch of one). If omitted, all requests will be imported at the end of the session in a single batch. (examples: 5120, 5kB, 5kiB, 10 MB)

#### TLS/Client certificates

* `-c, --client-certificate=<path>` - Path to a PEM-encoded RSA private key and X509 certificate needed to authenticate against the target API using mutual TLS. Alternative to `--client-certificate-store`.
* `--client-certificate-store=<path>` - Path to a keystore (pkcs12, jks etc.) containing the private key and certificate needed to authenticate against the target API using mutual TLS. Alternative to `--client-certificate`.
* `--client-certificate-store-password=<value>` - Password to unlock the client certificate store if provided.

**Examples:**

```shell  theme={null}
wiremock record-many
wiremock record-many --wiremock-dir=./my-wiremock
wiremock record-many --profile=staging -v
wiremock record-many --include-services=api1,api2
```

## import

Import files or directories into WireMock Cloud.

See [Importing using the CLI](/cli/import) for detailed documentation.

```shell  theme={null}
wiremock import [<options>] <file_or_directory>
```

**Arguments:**

* `<file_or_directory>` - The file or directory to import (required)

**Options:**

* `--to=<value>` - The ID of the mock API to import into (required)
* `--import-config-file=<path>` - YAML file containing import configuration

**Examples:**

```shell  theme={null}
wiremock import ./stubs --to=cloud:abc123xyz
wiremock import ./api.har --to=cloud:abc123xyz --import-config-file=./config.yaml
```

## push

Commands to push resources to WireMock Cloud.

See [Push and Pull](/cli/push-pull) for detailed documentation.

### push open-api

Push an OpenAPI document to a mock API.

```shell  theme={null}
wiremock push open-api [<options>] <mock_api_id>
```

**Arguments:**

* `<mock_api_id>` - The ID of the mock API to push the OpenAPI document to (required)

**Options:**

* `-f, --file=<path>` - The filename to read the OpenAPI document from (if not specified, reads from stdin)
* `-w, --watch` - Watch the file for changes and push on each change

**Examples:**

```shell  theme={null}
wiremock push open-api abc123xyz --file=./openapi.yaml
wiremock push open-api abc123xyz --file=./openapi.yaml --watch
cat openapi.yaml | wiremock push open-api abc123xyz
```

### push graphql

Push a GraphQL schema to a mock API.

```shell  theme={null}
wiremock push graphql [<options>] <mock_api_id>
```

**Arguments:**

* `<mock_api_id>` - The ID of the mock API to push the GraphQL schema to (required)

**Options:**

* `-f, --file=<path>` - The filename to read the GraphQL schema from (if not specified, reads from stdin)
* `-w, --watch` - Watch the file for changes and push on each change

**Examples:**

```shell  theme={null}
wiremock push graphql abc123xyz --file=./schema.graphql
wiremock push graphql abc123xyz --file=./schema.graphql --watch
```

### push mock-api

Push a local mock API configuration to WireMock Cloud.

See [Push and Pull Mock APIs](/cli/push-pull-mock-api) for detailed documentation.

```shell  theme={null}
wiremock push mock-api [<options>] [<local_service_ids>]...
```

**Arguments:**

* `<local_service_ids>` - The service IDs defined in your WireMock environment file to push (optional)

**Options:**

* `--all` - Push all mock APIs in your local WireMock environment file. To be used instead of specifying a mock API service ID
* `--wiremock-dir=<path>` - The path to the wiremock directory, containing mock APIs to push (default: .wiremock)
* `-p, --profile=<text>` - Profile name to use for this environment eg dev or staging
* `--to=<value>` - The ID of the destination mock API in the cloud. Use 'cloud:new' to force creation of a new mock API even if cloud\_id is present. If not specified, uses the cloud\_id from wiremock.yaml or creates a new mock API

**Examples:**

```shell  theme={null}
wiremock push mock-api my-service
wiremock push mock-api my-service --to=cloud:abc123xyz
wiremock push mock-api --all
wiremock push mock-api --wiremock-dir=./my-wiremock --profile=staging
```

## pull

Commands to pull resources from WireMock Cloud.

See [Push and Pull](/cli/push-pull) for detailed documentation.

### pull open-api

Pull the OpenAPI document from a mock API and save it locally.

```shell  theme={null}
wiremock pull open-api [<options>] <mock_api_id>
```

**Arguments:**

* `<mock_api_id>` - The ID of the mock API to pull the OpenAPI document from (required)

**Options:**

* `-f, --file=<path>` - The filename to save the OpenAPI document to

**Examples:**

```shell  theme={null}
wiremock pull open-api abc123xyz --file=./openapi.yaml
wiremock pull open-api abc123xyz
```

### pull graphql

Pull the GraphQL schema document from a mock API and save it locally.

```shell  theme={null}
wiremock pull graphql [<options>] <mock_api_id>
```

**Arguments:**

* `<mock_api_id>` - The ID of the mock API to pull the GraphQL schema document from (required)

**Options:**

* `-f, --file=<path>` - The filename to save the GraphQL schema document to

**Examples:**

```shell  theme={null}
wiremock pull graphql abc123xyz --file=./schema.graphql
```

### pull mock-api

Pull a mock API's stub mappings and create a local configuration.

See [Push and Pull Mock APIs](/cli/push-pull-mock-api) for detailed documentation.

```shell  theme={null}
wiremock pull mock-api [<options>] [<mock_api_ids or local service_names>]...
```

**Arguments:**

* `<mock_api_ids or local service_names>` - The IDs of the mock APIs to pull or the names of the services defined in your WireMock environment file to pull (optional)

**Options:**

* `--wiremock-dir=<path>` - The path to the wiremock directory, to which all pulled mock APIs will be written (default: .wiremock)
* `-p, --profile=<text>` - Profile name to use for this environment eg dev or staging
* `--all` - Pull all mock APIs in your local WireMock environment file. To be used instead of specifying a mock API ID or service name
* `--into=<text>` - The name of an existing service in wiremock.yaml to pull data into. Only stub mappings and API documents will be updated; service settings in wiremock.yaml will remain unchanged.

**Examples:**

```shell  theme={null}
wiremock pull mock-api abc123xyz
wiremock pull mock-api my-service
wiremock pull mock-api --all
wiremock pull mock-api abc123xyz --into=existing-service
wiremock pull mock-api --wiremock-dir=./my-wiremock --profile=staging
```

## run

Start the local host runner.

See [Running Mock APIs Locally](/cli/local-playback) for detailed documentation.

```shell  theme={null}
wiremock run [<options>]
```

**Options:**

* `--wiremock-dir=<path>` - The path to the wiremock directory, containing mock APIs to run (default: .wiremock)
* `-p, --profile=<text>` - Profile name to use for this environment eg dev or staging

**Examples:**

```shell  theme={null}
wiremock run
wiremock run --wiremock-dir=./my-wiremock
wiremock run --profile=staging
```

## environments

Commands to manage WireMock Cloud environments.

See [Managing Environments](/cli/environments) for detailed documentation.

### environments create

Create a new WireMock Cloud environment.

```shell  theme={null}
wiremock environments create [<options>]
```

**Options:**

* `-p, --profile=<text>` - Profile name to use for this environment eg dev or staging (required)
* `--wiremock-dir=<path>` - The path to the wiremock directory, this is where your environment file will be created (default: .wiremock)

**Examples:**

```shell  theme={null}
wiremock environments create --profile=staging
wiremock environments create --profile=dev --wiremock-dir=./my-wiremock
```

## mcp

Start an MCP server for use with AI tools. Intended to be called from the AI tool's MCP configuration rather than directly in the terminal.

See [WireMock Cloud AI](/ai-mcp/installation) for detailed documentation.

```shell  theme={null}
wiremock mcp
```

This command starts the Model Context Protocol (MCP) server which provides WireMock functionality to AI assistants and tools.

## See also

* [Installation and basic usage](/cli/overview)
* [Configuring the CLI](/cli/config)
* [Managing Mock APIs with the CLI](/cli/mock-apis)
* [Recording using the WireMock CLI](/cli/recording)
* [Multi-domain recording](/cli/multi-domain-recording)
* [Push and Pull](/cli/push-pull)
* [Running Mock APIs Locally](/cli/local-playback)
* [Managing Environments](/cli/environments)

