---
name: validate-and-fix-stubs
user-invocable: false
description: Validate WireMock stubs against the OpenAPI schema and fix any errors. Use when the user wants to check that mock API responses conform to the API specification.
argument-hint: "<mock-api-name-or-id>"
allowed-tools:
  - Read(../references/*)
  - mcp__wiremock__who_am_i
  - mcp__wiremock__search_my_mock_apis
  - mcp__wiremock__search_stub_mappings
  - mcp__wiremock__update_stub_mapping
  - mcp__wiremock__search_request_journal
  - mcp__wiremock__reset_request_journal
  - mcp__wiremock__make_http_request
  - mcp__wiremock__look_up_documentation
---

## Prerequisites

This skill requires the **WireMock Cloud MCP** server to be configured and running. If it is unavailable, stop and inform the user before proceeding.

## Reference Documentation

Read this reference before validating:

- [Validating and Fixing Stubs](../references/validating-and-fixing.md) - process for validating stubs against the OpenAPI schema and fixing errors

## Instructions

The target mock API is: **$ARGUMENTS**

If `$ARGUMENTS` is empty, ask the user which mock API to validate.

1. Identify the target mock API using `search_my_mock_apis`.
2. Read the [Validating and Fixing Stubs](../references/validating-and-fixing.md) reference.
3. Fetch the stub mappings using `search_stub_mappings`.
4. For each stub:
   1. Reset the request journal using `reset_request_journal`.
   2. Make a test request for the stub using `make_http_request`.
   3. Check the request journal using `search_request_journal` for validation errors.
   4. If there are response validation errors, fix the stub using `update_stub_mapping` and repeat from step 4.1.
5. Repeat until all stubs have 0 validation errors.
6. Report the results to the user, including any fixes applied.
