---
name: convert-to-data-driven
user-invocable: false
description: Convert existing WireMock stubs to use CSV or database data sources. Use when the user wants mock API responses driven by external data with optional pagination support.
argument-hint: "<mock-api-name-or-id>"
allowed-tools:
  - Read(../references/*)
  - mcp__wiremock__who_am_i
  - mcp__wiremock__search_my_mock_apis
  - mcp__wiremock__search_stub_mappings
  - mcp__wiremock__update_stub_mapping
  - mcp__wiremock__import_stubs_to_mock_api
  - mcp__wiremock__search_request_journal
  - mcp__wiremock__reset_request_journal
  - mcp__wiremock__make_http_request
  - mcp__wiremock__list_data_sources
  - mcp__wiremock__get_data_source
  - mcp__wiremock__get_data_source_data
  - mcp__wiremock__create_data_source
  - mcp__wiremock__update_data_source
  - mcp__wiremock__update_data_source_data
  - mcp__wiremock__delete_data_source
  - mcp__wiremock__pull
  - mcp__wiremock__look_up_documentation
---

## Prerequisites

This skill requires the **WireMock Cloud MCP** server to be configured and running. If it is unavailable, stop and inform the user before proceeding.

## Reference Documentation

Read these references before converting stubs:

- [Data-Driven Stubbing](../references/data-driven-stubbing.md) - converting stubs to use data sources with pagination support
- [Stub Creation Guidelines](../references/stub-creation.md) - rules for creating and importing stubs
- [Response Template Authoring](../references/response-templating.md) - guidelines for Handlebars response templates, formatting, and pagination metadata
- [Validating and Fixing Stubs](../references/validating-and-fixing.md) - process for validating stubs and fixing errors

## Instructions

The target mock API is: **$ARGUMENTS**

If `$ARGUMENTS` is empty, ask the user which mock API to convert.

1. Identify the target mock API using `search_my_mock_apis`.
2. Read the [Data-Driven Stubbing](../references/data-driven-stubbing.md) and [Response Template Authoring](../references/response-templating.md) references.
3. Fetch the existing stubs using `search_stub_mappings` and review their response data.
4. Ask the user which stubs to convert to data-driven (or all of them).
5. Define and create a data source using `create_data_source`, deriving columns and rows from the existing stub response data.
6. Update each stub using `update_stub_mapping`:
   - Add a `data-exists` custom matcher referencing the data source ID
   - Enable response templating
   - Update response bodies with Handlebars expressions to iterate over `data.items`
7. If pagination is evident, implement it using LIMIT/OFFSET in the data query and add pagination metadata to the response.
8. Validate using the process in [Validating and Fixing Stubs](../references/validating-and-fixing.md).
9. Report the converted stubs and created data sources to the user.
