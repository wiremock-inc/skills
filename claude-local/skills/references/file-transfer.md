<!-- AUTO-GENERATED from common/skills/... — do not edit directly; edit the source and run `npm run build`. -->

# Transferring Files To and From a Mock API

The WireMock Cloud MCP server runs locally and can read and write files on your machine directly,
so there is no upload/download indirection.

- `push` takes `type` (one of `stub_mappings`, `openapi_description`, `graphql_schema`,
  `grpc_descriptor`), `mockApiId`, and `filePath` — the local path to read the document from.
- `pull` takes `type` and `mockApiId`, plus `filePath` — the local path to write the document to.
- `update_data_source_data` takes `dataSourceId` and `csvData` (the CSV content as a string), so
  read the local file's contents yourself before calling it — there is no `filePath` parameter on
  this one.
