---
name: build-api-simulation
description: Generate a complete mock API in WireMock Cloud for any REST API. Creates an OpenAPI description and WireMock stubs - optionally recorded from a live sandbox. Use when the user wants to create, mock, or simulate a REST API in WireMock Cloud.
user-invocable: true
argument-hint: "<api-name>"
allowed-tools:
  - Read(references/*)
  - mcp__wiremock__who_am_i
  - mcp__wiremock__search_my_mock_apis
  - mcp__wiremock__search_stub_mappings
  - mcp__wiremock__search_request_journal
  - mcp__wiremock__get_mock_api_settings
  - mcp__wiremock__get_recording_status
  - mcp__wiremock__pull
  - mcp__wiremock__list_data_sources
  - mcp__wiremock__get_data_source
  - mcp__wiremock__get_data_source_data
  - mcp__wiremock__make_http_request
---

## Prerequisites

This skill requires the following MCP server to be configured and running:
- **WireMock Cloud MCP** - provides tools for managing mock APIs, stubs, recordings, and OpenAPI documents

If the MCP server is unavailable, stop and inform the user before proceeding.

## Reference Documentation

The following WireMock guidelines are bundled as reference files. Read the relevant files when performing those steps:

- [Stub Creation Guidelines](references/stub-creation.md) - rules for creating and importing stubs
- [Stateful Stubbing](references/stateful-stubbing.md) - full guide to stateful mocking with the key-value state store, including examples
- [Data-Driven Stubbing](references/data-driven-stubbing.md) - converting stubs to use data sources with pagination support
- [Validating and Fixing Stubs](references/validating-and-fixing.md) - process for validating stubs against the OpenAPI schema and fixing errors
- [Response Template Authoring](references/response-templating.md) - guidelines for Handlebars response templates, brace collision avoidance, and pagination metadata
- [Recording from a Sandbox](references/recording-from-sandbox.md) - recording stubs from a live sandbox environment

These references supersede the `lookup_documentation` MCP tool - do not call `lookup_documentation`.

## Step 1: Gather Inputs

The API name is: **$ARGUMENTS**

If `$ARGUMENTS` is empty, ask the user for the API name.

Use `AskUserQuestion` to collect the remaining configuration:

1. **Project folder**: Where should the project files be placed? Default: `./<api-name-in-lower-kebab-case>` (e.g. `./stripe-payments`).
2. **Sandbox**: Is a sandbox/test environment available for this API? If yes, what is its base URL?
3. **Authenticators**: Paths to any existing authenticator files enabling authentication against the sandbox from the previous step.
4. **Info locations**: URLs or file paths for any existing OpenAPI/Swagger specs, API documentation pages, or other reference material about the API.
5. **Stateful**: Should the mock API be stateful (maintaining state across requests so that e.g. a created resource can be subsequently retrieved)?
6. **Other directives**: Any other guidance e.g. only include specific endpoints within the API, create stubs for specific data scenarios.

## Project Folder Layout

All generated files must follow the WireMock Runner layout inside the chosen project folder:

```
<project-folder>/
└── .wiremock/
    ├── wiremock.yaml              # Runner config with cloud_id
    └── <service-name>/            # Lower-kebab-case, derived from the API name
        ├── mappings/
        │   └── stub-mappings.json # All stub mappings
        └── openapi.yaml           # OpenAPI description
```

Create the `.wiremock/wiremock.yaml` file early (in Step 3 after creating the mock API) with this structure:

```yaml
services:
  <service-name>:
    type: REST
    name: "<Human-readable API name>"
    port: 8080
    cloud_id: <mock-api-id>
```

Update `cloud_id` with the actual mock API ID once it has been created. All subsequent file paths in the skill (OpenAPI, stubs) refer to this layout.

## Step 2: Find or Generate the OpenAPI Description

Search for an official OpenAPI or Swagger description:

1. Check any info locations provided by the user for OpenAPI/Swagger files.
2. Use `WebSearch` and `WebFetch` to look for an official OpenAPI spec published by the API provider.
3. Download the spec if found.

**If an official OpenAPI spec is found or provided:**
- Do NOT modify it in any way except for its `servers` element. Never make any other changes to a downloaded OpenAPI spec without explicit user permission.
- Validate it for completeness and accuracy.
- If the OpenAPI appears to have genuine defects (missing schemas, incorrect types, invalid structure, etc.), **report them to the user** and do not attempt to fix them. These are upstream issues that should be raised with the API provider. Ask the user how to proceed — they may choose to accept the defects, provide a corrected spec, or grant permission to patch specific issues.

**If no official OpenAPI spec exists, generate one:**
- Use **OpenAPI 3.0.3** format (not 3.1). WireMock's response validator does not support OpenAPI 3.1's `type: ['string', 'null']` syntax for nullable fields. Use `nullable: true` instead (e.g. `type: string` with `nullable: true`).
- Completely cover ALL known API operations.
- Include complete request/response schemas for every operation.
- Include valid, realistic examples for all requests and responses.
- Use appropriate HTTP methods, status codes, and content types.
- Define error responses (400, 401, 403, 404, 409, 500 as applicable).

Save the OpenAPI description to `.wiremock/<service-name>/openapi.yaml` inside the project folder.

## Step 3: Create and Configure the Mock API

1. **Create the mock API** using `create_mock_api` with an appropriate name derived from the API being mocked.

2. **Create `.wiremock/wiremock.yaml`** inside the project folder with the mock API's ID as `cloud_id` (see Project Folder Layout above).

3. **Disable OpenAPI generation in both directions** via the WireMock Cloud admin API (use `make_http_request`). This must be done BEFORE uploading the OpenAPI spec or importing any stubs:
   - Disable automatic stub generation from the OpenAPI spec (enabled by default on new mock APIs).
   - Disable automatic OpenAPI generation from stubs.
   - Enable hard request validation against the OpenAPI schema.
   - Enable the API documentation portal.

4. **Update the OpenAPI `servers` element** to point to the mock API's base URL.

5. **Upload the OpenAPI description** to the mock API using `put_openapi`.

## Step 4: Populate and Verify the Mock API

Follow **Path A** if a sandbox is available, otherwise follow **Path B**.

---

### Path A: Sandbox Available

Read and follow [Recording from a Sandbox](references/recording-from-sandbox.md) to set up authentication, record stubs by exercising the sandbox, and verify them against the mock API.

---

### Path B: No Sandbox Available

#### 4B.1: Generate Stubs

Read the [Stub Creation Guidelines](references/stub-creation.md) before proceeding.

Generate stubs covering ALL operations in the OpenAPI spec and import them using `import_stubs_to_mock_api`.

Cross-reference every response body against its schema's `required` fields. Ensure ALL required fields are present in the response. Fields that aren't typically sent by the client but are required in the response (e.g. `currency` on a refund) must be included with sensible defaults.

#### 4B.2: Verify Against the Mock API

1. **Smoke test first.** Before running the full suite, manually test one create + retrieve cycle against the mock API to verify the basic flow works and passes OpenAPI validation. This gives fast feedback before the slower full suite.
2. Validate the stubs against the OpenAPI schema using the process in [Validating and Fixing Stubs](references/validating-and-fixing.md).
3. Send a test request for every operation in the OpenAPI spec against the mock API's base URL using `make_http_request`. Use realistic example data in request bodies that is consistent with the OpenAPI schemas. Where an operation depends on data created by a previous operation (e.g. a GET that retrieves a resource created by a POST), chain the requests and pass the identifier from the first response into the subsequent requests.
4. Check the request journal for any response validation errors using `search_request_journal`.
5. If any responses fail validation, fix **stubs only**. Do NOT change the OpenAPI description.
6. Repeat until all requests succeed and the request journal shows zero validation errors.

---

## Step 5: Stateful Conversion

**Only perform this step if the user requested stateful mode.**

Read the [Stateful Stubbing](references/stateful-stubbing.md) reference (including the "Converting stubs by HTTP method" section), then retrieve all stubs with `get_stub_mappings` and convert them following the patterns in the reference.

After converting:
1. **Smoke test first.** Manually test one create + retrieve cycle to verify the stateful flow works.
2. Validate the stubs using [Validating and Fixing Stubs](references/validating-and-fixing.md).
3. Send test requests covering every operation against the mock API's base URL (see Step 4B.2 step 3) and check the request journal for response validation errors. Fix **stubs only** if anything fails. Repeat until all requests succeed.

## Final Acceptance Check

Before finishing, verify **all three** of the following criteria are met:

### 1. Full endpoint coverage
Cross-reference every operation in the OpenAPI spec against the stubs:
- Every operation must have at least one corresponding stub.
- Every operation must be exercised by at least one test request during verification.
- If any gaps are found, create the missing stubs and/or test requests before proceeding.

### 2. Final regression run
Run a clean regression pass to confirm everything works end-to-end:
1. Reset the request journal.
2. Send a request for every operation in the OpenAPI spec against the mock API's base URL.
3. Check the request journal for any response validation errors.
4. If there are failures or validation errors, fix the stubs and repeat until the run is fully clean.

### 3. No unresolved validation errors
Confirm the request journal shows **zero** response validation errors across all requests made during the final regression run.

Do **not** proceed to Completion until all three criteria pass.

## Completion

When all steps and the acceptance check are complete, report to the user:
- The mock API name and its base URL
- A summary of what was created (number of endpoints, stubs)
- Whether stateful mode was enabled
- The project folder path and its `.wiremock/` layout
- A link to the mock API's documentation portal
