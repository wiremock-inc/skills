---
name: validate-and-fix-stubs
description: Validate WireMock stubs against the OpenAPI schema and fix any errors. Use when the user wants to check that mock API responses conform to the API specification.
---

## Prerequisites

This skill requires the **WireMock Cloud MCP** server to be configured and running. If it is unavailable, stop and inform the user before proceeding.

## Reference Documentation

Read this reference before validating:

- [Validating and Fixing Stubs](references/validating-and-fixing.md) - process for validating stubs against the OpenAPI schema and fixing errors

## Instructions

The target mock API is: **$ARGUMENTS**

If `$ARGUMENTS` is empty, ask the user which mock API to validate.

1. Identify the target mock API using `search_my_mock_apis`.
2. Read the [Validating and Fixing Stubs](references/validating-and-fixing.md) reference.
3. Fetch the stub mappings using `search_stub_mappings`.
4. For each stub:
   1. Reset the request journal using `reset_request_journal`.
   2. Make a test request for the stub using `make_http_request`.
   3. Check the request journal using `search_request_journal` for validation errors.
   4. If there are response validation errors, fix the stub using `update_stub_mapping` and repeat from step 4.1.
5. Repeat until all stubs have 0 validation errors.
6. Report the results to the user, including any fixes applied.
