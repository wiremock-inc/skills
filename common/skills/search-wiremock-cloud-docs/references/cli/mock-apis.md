> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Managing Mock APIs with the CLI

> How to list and manage your mock APIs using the WireMock CLI

The CLI provides commands for interacting with your mock APIs in WireMock Cloud.

## Listing Mock APIs

You can list your mock APIs using:

```shell  theme={null}
wiremock mock-apis list
```

This will display your mock APIs in a human-readable text format. By default, it shows up to 20 results on the first page.

### Options

The list command supports several options to customize the output:

* `--limit=<int>` - Set the maximum number of mock APIs to return (default: 20)
* `--page=<int>` - Select which page of results to show (default: 1)
* `--query=<text>` - Filter mock APIs using a search query
* `-o, --output=(text|json)` - Choose between text or JSON output format (default: text)

### Examples

List first 5 mock APIs:

```shell  theme={null}
wiremock mock-apis list --limit 5
```

Search for mock APIs containing "test":

```shell  theme={null}
wiremock mock-apis list --query test
```

Get results in JSON format:

```shell  theme={null}
wiremock mock-apis list --output json
```

## Creating Mock APIs

You can create a new mock API using:

```shell  theme={null}
wiremock mock-apis create <name>
```

This will create a new mock API with the given name.

### Options

The create command supports the following options:

* `-o, --hostname=<text>` - Optional custom hostname for the mock API
* `-t, --type=(REST|Unstructured|gRPC|GraphQL)` - Type of the mock API (default: REST)

### Examples

Create a new mock API called `NewName`

```shell  theme={null}
wiremock mock-apis create NewName
```

Create a new mock API of type `GraphQL`

```shell  theme={null}
wiremock mock-apis create --type GraphQL NewName
```

Create a new mock API of type `Unstructured` with a custom hostname

```shell  theme={null}
wiremock mock-apis create --type Unstructured -o newname NewName
```

## Delete a mock API

You can delete a new mock API using:

```shell  theme={null}
wiremock wiremock mock-apis delete <mock_api_id>
```

This will delete the mock API with the given ID.  By default, it will prompt you for confirmation before deleting the
mock API.

### Options

The delete command supports the following options:

* `-f, --force` - Force delete the mock API without confirmation

### Examples

Delete a mock API with ID `v16kg`

```shell  theme={null}
wiremock mock-apis delete v16kg
```

Force delete a mock API with ID `v16kg`

```shell  theme={null}
wiremock mock-apis delete -f v16kg
```

