> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# MCP Tools

> Tools implemented by WireMock's MCP server

This page lists all the tools implemented by WireMock Cloud's MCP server.

## Authentication

### `who_am_i`

Returns the username with which you are currently logged into WireMock Cloud

**Input**

None

**Output**

User ID and username information

## Mock API Management

### `list_my_mock_apis`

Lists all mock APIs in WireMock Cloud that you have access to

**Input**

None

**Output**

List of mock APIs with their IDs and names

### `search_my_mock_apis`

Searches for mock APIs by text query

**Input**

`query` (string): The search query

**Output**

List of matching mock APIs

### `create_mock_api`

Creates a new mock API in WireMock Cloud

**Input**

`name` (string, required): The name of the mock API
`hostname` (string, optional): Custom hostname for the mock API
`type` (string, optional): Type of the mock API (e.g., openapi, graphql). Defaults to openapi if not specified.

**Output**

Confirmation with mock API details

### `delete_mock_api`

Deletes a mock API by its ID

**Input**

`mockApiId` (string): The ID of the mock API to delete

**Output**

Confirmation message

### `clear_mock_api`

Deletes all stubs in a specified mock API

**Input**

`mockApiId` (string): The ID of the mock API to clear

**Output**

Confirmation message

## Stub Management

### `import_stubs_to_mock_api`

Imports a list of stubs to a specific mock API

**Input**

`mockApiId` (string): The ID of the mock API
`stubsJson` (string): WireMock stub mappings in JSON format

**Output**

Confirmation message

### `get_stub_mappings`

Fetches stub mappings for a given Mock API. Supports pagination to avoid token limits when dealing with large numbers of stubs.

**Input**

`mockApiId` (string): The ID of the mock API
`page` (integer, optional): Page number for pagination (1-based). If not specified, returns all stubs.
`limit` (integer, optional): Maximum number of stubs to return per page. If not specified, returns all stubs.

**Output**

JSON containing stub mappings

### `update_stub_mapping`

Updates a specific stub mapping

**Input**

`mockApiId` (string): The ID of the mock API
`stubId` (string): The ID of the stub mapping to update
`stubJson` (string): The new stub mapping definition in JSON format

**Output**

Confirmation message

### `delete_stub_mapping`

Deletes a specific stub mapping

**Input**

`mockApiId` (string): The ID of the mock API
`stubId` (string): The ID of the stub mapping to delete

**Output**

Confirmation message

## API Specifications

### `get_openapi`

Fetches the OpenAPI document for a mock API

**Input**

`mockApiId` (string): The ID of the mock API to fetch the OpenAPI document from

**Output**

OpenAPI document content

### `put_openapi`

Pushes an OpenAPI document to a mock API

**Input**

`mockApiId` (string): The ID of the mock API to push the OpenAPI document to
`openApiDocument` (string): The OpenAPI document content in YAML or JSON format

**Output**

Confirmation message

### `get_graphql`

Fetches the GraphQL schema document for a mock API

**Input**

`mockApiId` (string): The ID of the mock API to fetch the GraphQL schema from

**Output**

GraphQL schema document content

### `put_graphql`

Pushes a GraphQL schema document to a mock API

**Input**

`mockApiId` (string): The ID of the mock API to push the GraphQL schema to
`graphQLDocument` (string): The GraphQL schema document content

**Output**

Confirmation message

## Request Journal

### `get_request_journal`

Fetches the request journal for a mock API

**Input**

`mockApiId` (string): The ID of the mock API to fetch the request journal from

**Output**

Request journal data

### `reset_request_journal`

Resets the request journal for a mock API

**Input**

`mockApiId` (string): The ID of the mock API to reset the request journal for

**Output**

Confirmation message

## Recording

### `start_recording`

Starts recording HTTP traffic from a target service. The recording will proxy requests to the specified base URL and capture all traffic for later analysis. Only one recording session can be active at a time.

**Input**

`baseUrl` (string): The base URL of the target service to record traffic from
`destination` (string, optional): The destination to save recorded events to (format: cloud:mock\_api\_id). If omitted, events will not be persisted.

**Output**

Recording session details including proxy port

### `get_recording_status`

Checks the status of the current recording session. Returns information about whether a recording is active and, if so, the target URL and proxy port being used.

**Input**

None

**Output**

Recording status information

### `stop_recording`

Stops the currently active recording session and returns the number of requests that were recorded. If no recording is active, returns an error.

**Input**

None

**Output**

Number of recorded requests

### `capture_record_event`

Captures a request/response event in the currently active recording session. This allows you to manually add HTTP interactions to the recording that weren't captured through the proxy. The recording session must be active (started with start\_recording) before using this tool.

**Input**

`request` (object): The HTTP request object to capture
`response` (object): The HTTP response object to capture

**Output**

Confirmation message

## Data Sources

### `list_data_sources`

Lists all data sources accessible by the user. This includes both CSV and database data sources that the user has permission to access.

**Input**

`q` (string, optional): A filter for the retrieved items. Only items whose name contains the filter value will be retrieved. The filter is case insensitive.
`page` (integer, optional): The index of the page to retrieve.
`limit` (integer, optional): The amount of page items to retrieve.

**Output**

List of data sources with metadata

### `get_data_source`

Fetches the metadata for a single data source by its ID. This includes information about the data source such as its name, type (CSV or DATABASE), column metadata, state, and other properties.

**Input**

`dataSourceId` (string): The ID of the data source to fetch metadata for

**Output**

Data source metadata

### `get_data_source_data`

Fetches the actual data from a data source as CSV format. This returns the raw CSV data that can be used for analysis, processing, or display purposes.

**Input**

`dataSourceId` (string): The ID of the data source to fetch data from

**Output**

CSV data content

### `create_data_source`

Creates a new data source in WireMock Cloud. Supports both CSV and DATABASE data source types.

For CSV data sources, you must provide:

* name: Display name for the data source
* type: "CSV"
* columnsMetadata: Array of column definitions with name and type information
* rows: Array of data rows, where each row is an array of string values

For DATABASE data sources, you must provide:

* name: Display name for the data source
* type: "DATABASE"
* databaseConnection: ID of the database connection to use
* tableName: Name of the table or view to retrieve data from

**Input**

`dataSource` (object): The data source configuration object

**Output**

Created data source details

### `update_data_source`

Updates an existing data source in WireMock Cloud. Supports both CSV and DATABASE data source types.

**Input**

`dataSourceId` (string): The ID of the data source to update
`dataSource` (object): The updated data source configuration object

**Output**

Confirmation message

### `update_data_source_data`

Updates the data for a data source from CSV content. This replaces all existing data in the data source with the provided CSV data.

**Input**

`dataSourceId` (string): The ID of the data source to update data for
`csvData` (string): The CSV data to upload. Should be properly formatted CSV with headers in the first row and data rows following.

**Output**

Confirmation message

### `delete_data_source`

Deletes a data source by its ID from WireMock Cloud. This operation permanently removes the data source and cannot be undone.

**Input**

`dataSourceId` (string): The ID of the data source to delete

**Output**

Confirmation message

## HTTP Client

### `make_http_request`

Makes an HTTP request to any endpoint and returns the response. Supports all HTTP methods, custom headers, and request bodies.

HTTP requests can optionally be authenticated using configured authenticators. See [HTTP Request Authentication](/ai-mcp/http-request-authentication/) for more details.

**Input**

`method` (string): The HTTP request method (e.g., GET, POST, PUT, DELETE)
`absoluteUrl` (string): The full URL to make the request to
`headers` (object, optional): HTTP headers as key-value pairs
`body` (string, optional): Request body content
`bodyAsBase64` (string, optional): Base64 encoded body content

**Output**

HTTP response including status, headers, and body

## Documentation

### `look_up_documentation`

Look up documentation articles to help with WireMock usage and best practices. Returns the content of the specified documentation article.

**Input**

`document` (string): The documentation article to retrieve (enum values: stub\_creation, stateful\_stubbing, api\_crawling, data\_driven\_stubbing, validating\_and\_fixing)

**Output**

Documentation article content

