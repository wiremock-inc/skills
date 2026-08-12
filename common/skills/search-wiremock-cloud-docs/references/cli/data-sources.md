> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Managing Data Sources with the CLI

> How to list, push, and pull data source content using the WireMock CLI

The CLI provides commands for interacting with your [data sources](/data-sources/overview) in WireMock Cloud.

## Listing Data Sources

You can list your data sources using:

```shell theme={null}
wiremock data-sources list
```

This displays your data sources in a human-readable text format, showing up to 20 results on the first page.

### Options

* `--limit=<int>` - Set the maximum number of data sources to return (default: 20)
* `--page=<int>` - Select which page of results to show (default: 1)
* `--query=<text>` - Filter data sources using a search query
* `-o, --output=(text|json)` - Choose between text or JSON output format (default: text)

### Examples

List your data sources:

```shell theme={null}
wiremock data-sources list
```

```text theme={null}
╭─────┬───────────────┬──────────╮
│ ID  │ NAME          │ TYPE     │
├─────┼───────────────┼──────────┤
│ id1 │ Data Source 1 │ CSV      │
├─────┼───────────────┼──────────┤
│ id2 │ Data Source 2 │ DATABASE │
╰─────┴───────────────┴──────────╯
Showing 1-2 of 2 (page 1 of 1)
```

Search for data sources containing "customer":

```shell theme={null}
wiremock data-sources list --query customer
```

Get results in JSON format:

```shell theme={null}
wiremock data-sources list --output json
```

## Pushing data to a data source

You can upload CSV data to an existing CSV data source using:

```shell theme={null}
wiremock data-sources push [<options>] <data_source_id>
```

This replaces the contents of the data source with the CSV data provided. Only [CSV data sources](/data-sources/managing-csv-data-sources) are supported.

### Options

* `-f, --file=<path>` - The filename to read the CSV data from. If omitted, the CLI reads from stdin (interactively, it will prompt you to enter CSV data and finish with Ctrl+D)

### Examples

Push CSV data from a file:

```shell theme={null}
wiremock data-sources push abc123xyz --file=./data.csv
```

Pipe CSV data from another command:

```shell theme={null}
cat data.csv | wiremock data-sources push abc123xyz
```

## Pulling data from a data source

You can download the CSV data from an existing CSV data source using:

```shell theme={null}
wiremock data-sources pull [<options>] <data_source_id>
```

If no file is specified, the CSV data is printed to stdout. Only CSV data sources are supported.

### Options

* `-f, --file=<path>` - The filename to save the CSV data to. If omitted, the CSV data is printed to stdout

### Examples

Pull data to a local file:

```shell theme={null}
wiremock data-sources pull abc123xyz --file=./data.csv
```

Pull data and print it to the console:

```shell theme={null}
wiremock data-sources pull abc123xyz
```

## See also

* [Data sources overview](/data-sources/overview)
* [Managing CSV data sources](/data-sources/managing-csv-data-sources)
* [CLI command reference](/cli/command-reference)
