---
name: review-api-simulation
description: Review a mock API simulation built in WireMock Cloud against its source documentation, OpenAPI spec, and Arazzo workflows. Use when the user wants to verify completeness and correctness of an existing mock API.
user-invocable: true
argument-hint: "<mock-api-name-or-id>"
allowed-tools:
  - Read(../references/*)
  - mcp__wiremock__who_am_i
  - mcp__wiremock__search_my_mock_apis
  - mcp__wiremock__search_stub_mappings
  - mcp__wiremock__search_request_journal
  - mcp__wiremock__reset_request_journal
  - mcp__wiremock__get_mock_api_settings
  - mcp__wiremock__make_http_request
  - mcp__wiremock__get_openapi
  - mcp__wiremock__update_openapi_settings
  - mcp__wiremock__update_mock_api_auth_settings
  - mcp__arazzo-runner__run_workflow
---

## Prerequisites

This skill requires the following MCP servers to be configured and running:
- **WireMock Cloud MCP** - provides tools for managing mock APIs, stubs, recordings, and OpenAPI documents
- **Arazzo Runner MCP** (`@wiremock/arazzo-runner`) - provides the `run_workflow` tool for executing Arazzo workflow specifications

If the WireMock Cloud MCP server is unavailable, stop and inform the user before proceeding.

If the Arazzo Runner MCP server is unavailable, use `npx @wiremock/arazzo-runner` via the command line instead. Run `npx @wiremock/arazzo-runner -h` to see available options.

## Reference Documentation

The following WireMock guidelines are bundled as reference files. Read the relevant files when performing those steps:

- [Validating and Fixing Stubs](../references/validating-and-fixing.md) - process for validating stubs against the OpenAPI schema and fixing errors

## Step 1: Gather Inputs

The target mock API is: **$ARGUMENTS**

If `$ARGUMENTS` is empty, ask the user which mock API to review.

Use `AskUserQuestion` to collect the remaining configuration:

1. **Documentation sources**: Paths or URLs to any API documentation, OpenAPI/Swagger specs, Postman collections, or other reference material. If none are provided, search for them using `WebSearch` and `WebFetch`.
2. **Arazzo document location**: Path to the project folder containing all of the mock API files (under .wiremock) or the Arazzo workflow document for the mock API.

## Step 2: Find and Configure the Mock API

1. Locate the mock API using `search_my_mock_apis` with the name or ID provided.
2. **Enable hard request validation** against the OpenAPI schema using `update_openapi_settings`. This ensures all responses are validated against the spec during review.
3. **Disable authentication** on the mock API using `update_mock_api_auth_settings` so that the Arazzo workflows can run without auth credentials.

## Step 3: Retrieve Documentation and Specifications

Gather all available documentation for the API:

1. Fetch the OpenAPI spec from the mock API using `get_openapi`.
2. Read any documentation files, OpenAPI docs, or Postman collections provided by the user or found via search.
3. Read the Arazzo workflow document.

## Step 4: Verify Completeness and Correctness

Perform each of the following checks, tracking all issues found:

### 4.1: Documentation vs OpenAPI Coverage
Compare the API documentation against the OpenAPI spec:
- Verify that **all endpoints described in the documentation** have corresponding operations in the OpenAPI doc.
- Note any endpoints present in the documentation but missing from the OpenAPI spec.

### 4.2: OpenAPI vs Stub Coverage
Retrieve all stubs using `search_stub_mappings` and cross-reference against the OpenAPI spec:
- Verify that **every operation in the OpenAPI doc** has at least one stub associated with it.
- Note any operations that lack stub coverage.

### 4.3: Undocumented Fields in Stubs
Cross-reference every stub response body against the OpenAPI doc schemas:
- Verify that **no stubs contain fields that are not documented** in the OpenAPI spec schemas.
- Note any stubs returning undocumented fields.

### 4.4: OpenAPI vs Arazzo Coverage
Examine the Arazzo workflow document and cross-reference against the OpenAPI spec:
- Verify that **every endpoint in the OpenAPI doc** is executed in at least one Arazzo workflow step.
- Note any endpoints that are not exercised by the workflows.

### 4.5: Arazzo Workflow Execution
Run the Arazzo workflows against the mock API to verify they execute successfully:

1. Reset the request journal using `reset_request_journal`.
2. Run all Arazzo workflows against the mock API's base URL using `run_workflow`.
3. Check the request journal using `search_request_journal` for any response validation errors.
4. Note any workflow failures or validation errors.

## Step 5: Output Report

Produce a detailed report covering the results of all checks. The report should include:

### Summary
A brief overall assessment of the mock API's completeness and correctness.

### Documentation vs OpenAPI Coverage
- Endpoints found in documentation but missing from the OpenAPI spec
- Any discrepancies noted

### OpenAPI vs Stub Coverage
- Operations in the OpenAPI spec without corresponding stubs
- Any gaps identified

### Undocumented Fields
- Stubs containing fields not present in OpenAPI schemas
- Specific field names and the stubs they appear in

### OpenAPI vs Arazzo Coverage
- Endpoints in the OpenAPI spec not exercised by Arazzo workflows
- Any missing workflow steps

### Arazzo Workflow Execution Results
- Overall pass/fail status for each workflow
- Any validation errors returned during execution
- Details of any failing steps

### Recommendations
Actionable steps to address each issue found.

If all checks pass with no issues, confirm that the mock API simulation is complete and correct.
