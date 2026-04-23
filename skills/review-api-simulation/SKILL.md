---
name: review-api-simulation
description: Review a mock API simulation built in WireMock Cloud against its source documentation and OpenAPI spec. Use when the user wants to verify completeness and correctness of an existing mock API.
user-invocable: true
argument-hint: "<path-to-project-folder>"
allowed-tools:
  - Read(references/*)
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
---

## Prerequisites

This skill requires the WireMock Cloud MCP server to be configured and running. It provides tools for managing mock APIs, stubs, recordings, and OpenAPI documents.

If the WireMock Cloud MCP server is unavailable, stop and inform the user before proceeding.

## Reference Documentation

The following WireMock guidelines are bundled as reference files. Read the relevant files when performing those steps:

- [Validating and Fixing Stubs](references/validating-and-fixing.md) - process for validating stubs against the OpenAPI schema and fixing errors

## Step 1: Validate Project Folder

The project folder path is: **$ARGUMENTS**

If `$ARGUMENTS` is empty, ask the user for the path to the project folder.

1. Verify the project folder exists and contains a `.wiremock/` directory. If it does not, stop and inform the user.
2. Read `.wiremock/wiremock.yaml` to identify the service name and `cloud_id`.
3. Locate the OpenAPI file at `.wiremock/<service-name>/openapi.yaml`. If it does not exist, stop and inform the user.

## Step 2: Gather Additional Inputs

Use `AskUserQuestion` to collect any additional configuration:

1. **Documentation sources**: Paths or URLs to any API documentation, OpenAPI/Swagger specs, Postman collections, or other reference material. If none are provided, search for them using `WebSearch` and `WebFetch`.

## Step 3: Access the Cloud Mock API

1. Attempt to access the mock API in WireMock Cloud using the `cloud_id` from `wiremock.yaml` via `search_my_mock_apis`.
2. **If the mock API is accessible**, use it for the remainder of the review.
3. **If the mock API cannot be accessed** (e.g. it belongs to another user or has been deleted), create a temporary copy using the WireMock CLI's profiles feature:
   ```
   wiremock environments create -p verify
   ```
   This will create a new instance of the API in Cloud and a profile YAML file containing the new `cloud_id`. Use this new instance for the remainder of the verification process.
4. **Enable hard request validation** against the OpenAPI schema using `update_openapi_settings`. This ensures all responses are validated against the spec during review.
5. **Disable authentication** on the mock API using `update_mock_api_auth_settings` so that verification requests can be sent without auth credentials.

## Step 4: Retrieve Documentation and Specifications

Gather all available documentation for the API:

1. Read the OpenAPI spec from `.wiremock/<service-name>/openapi.yaml` and also fetch it from the mock API using `get_openapi`.
2. Read any documentation files, OpenAPI docs, or Postman collections provided by the user or found via search.

## Step 5: Verify Completeness and Correctness

Perform each of the following checks, tracking all issues found:

### 5.1: Documentation vs OpenAPI Coverage
Compare the API documentation against the OpenAPI spec:
- Verify that **all endpoints described in the documentation** have corresponding operations in the OpenAPI doc.
- Note any endpoints present in the documentation but missing from the OpenAPI spec.

### 5.2: OpenAPI vs Stub Coverage
Retrieve all stubs using `search_stub_mappings` and cross-reference against the OpenAPI spec:
- Verify that **every operation in the OpenAPI doc** has at least one stub associated with it.
- Note any operations that lack stub coverage.

### 5.3: Undocumented Fields in Stubs
Cross-reference every stub response body against the OpenAPI doc schemas:
- Verify that **no stubs contain fields that are not documented** in the OpenAPI spec schemas.
- Note any stubs returning undocumented fields.

### 5.4: Mock API Request Validation
Exercise every operation in the OpenAPI spec against the mock API and validate the responses:

1. Reset the request journal using `reset_request_journal`.
2. Send a request for every operation in the OpenAPI spec against the mock API's base URL using `make_http_request`. Use realistic example data in request bodies that is consistent with the OpenAPI schemas. Where an operation depends on data created by a previous operation (e.g. a GET that retrieves a resource created by a POST), chain the requests and pass the identifier from the first response into the subsequent requests.
3. Check the request journal using `search_request_journal` for any response validation errors.
4. Note any request failures or validation errors.

## Step 6: Output Report

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

### Mock API Request Validation Results
- Overall pass/fail status for the request sweep
- Any response validation errors reported in the request journal
- Details of any failing requests

### Recommendations
Actionable steps to address each issue found.

If all checks pass with no issues, confirm that the mock API simulation is complete and correct.
