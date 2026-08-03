# Transferring Files To and From a Mock API

# @variant:remote
The WireMock Cloud MCP server is remote — it cannot read or write files on your machine directly.
Whenever a whole document (an OpenAPI description, a stub mappings JSON file, a GraphQL schema, or
a gRPC descriptor) needs to move between a local file and a mock API, it goes through a signed
upload/download URL instead of a file path. This requires running a `curl` command via `Bash` as
part of the flow.

## Pushing a local file to a mock API

1. Call `create_upload` with the `contentType` of the file (e.g. `application/json`, `text/plain`,
   `application/octet-stream`) and, if known, `totalSizeBytes`.
2. The tool returns an `uploadId` and one or more `curl` commands. Run the returned command(s)
   via `Bash` exactly as given to upload the local file's bytes.
3. Call `push` with `type` (one of `stub_mappings`, `openapi_description`, `graphql_schema`,
   `grpc_descriptor`), `mockApiId`, and the `uploadId` from step 1.

## Pulling a mock API's data to a local file

1. Call `pull` with `type` and `mockApiId`.
2. The tool stages the content server-side and returns a `curl -o <file> "<url>"` command. Run it
   via `Bash` to save the content to a local file.
3. Read the downloaded file as needed.

## Notes

- Never invent a `filePath` parameter on `push` or `pull` — neither tool accepts one.
- The same `create_upload` → `curl` → tool-call pattern is used by `update_data_source_data`
  (`dataSourceId`, `uploadId`) when replacing all of a CSV data source's rows from a file.
# @variant:local
The WireMock Cloud MCP server runs locally and can read and write files on your machine directly,
so there is no upload/download indirection.

- `push` takes `type` (one of `stub_mappings`, `openapi_description`, `graphql_schema`,
  `grpc_descriptor`), `mockApiId`, and `filePath` — the local path to read the document from.
- `pull` takes `type` and `mockApiId`, plus `filePath` — the local path to write the document to.
- `update_data_source_data` takes `dataSourceId` and `csvData` (the CSV content as a string), so
  read the local file's contents yourself before calling it — there is no `filePath` parameter on
  this one.
# @endvariant
