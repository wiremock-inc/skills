---
name: build-api-simulation
description: Generate a complete mock API in WireMock Cloud for any REST API. Creates an OpenAPI description, Arazzo test workflows, and WireMock stubs - optionally recorded from a live sandbox. Use when the user wants to create, mock, or simulate a REST API in WireMock Cloud.
argument-hint: "<api-name>"
allowed-tools:
  - Read(../references/*)
  - mcp__wiremock__who_am_i
  - mcp__wiremock__search_my_mock_apis
  - mcp__wiremock__search_stub_mappings
  - mcp__wiremock__search_request_journal
  - mcp__wiremock__get_mock_api_settings
  - mcp__wiremock__get_recording_status
  - mcp__wiremock__look_up_documentation
  - mcp__wiremock__pull
  - mcp__wiremock__list_data_sources
  - mcp__wiremock__get_data_source
  - mcp__wiremock__get_data_source_data
  - mcp__arazzo-runner__run_workflow
---

## Prerequisites

This skill requires the following MCP servers to be configured and running:
- **WireMock Cloud MCP** - provides tools for managing mock APIs, stubs, recordings, and OpenAPI documents
- **Arazzo Runner MCP** (`@wiremock/arazzo-runner`) - provides the `run_workflow` tool for executing Arazzo workflow specifications

If either MCP server is unavailable, stop and inform the user before proceeding.

## Reference Documentation

The following WireMock guidelines are bundled as reference files. Read the relevant files when performing those steps:

- [Stub Creation Guidelines](../references/stub-creation.md) - rules for creating and importing stubs
- [Stateful Stubbing](../references/stateful-stubbing.md) - full guide to stateful mocking with the key-value state store, including examples
- [Data-Driven Stubbing](../references/data-driven-stubbing.md) - converting stubs to use data sources with pagination support
- [Validating and Fixing Stubs](../references/validating-and-fixing.md) - process for validating stubs against the OpenAPI schema and fixing errors
- [Response Template Authoring](../references/response-templating.md) - guidelines for Handlebars response templates, brace collision avoidance, and pagination metadata

These references supersede the `lookup_documentation` MCP tool, so there is no need to call `lookup_documentation`.

All files collected or created should be placed in a suitably named child of the current working directory, with the directory name in lower kebab case.

## Step 1: Gather Inputs

The API name is: **$ARGUMENTS**

If `$ARGUMENTS` is empty, ask the user for the API name.

Use `AskUserQuestion` to collect the remaining configuration:

1. **Sandbox**: Is a sandbox/test environment available for this API? If yes, what is its base URL?
2. **Authenticators**: Paths to any existing authenticator files enabling authentication against the sandbox from the previous step.
3. **Info locations**: URLs or file paths for any existing OpenAPI/Swagger specs, API documentation pages, or other reference material about the API.
4. **Stateful**: Should the mock API be stateful (maintaining state across requests so that e.g. a created resource can be subsequently retrieved)?
5. **Other directives**: Any other guidance e.g. only include specific endpoints within the API, create stubs for specific data scenarios.

## Step 2: Find or Generate the OpenAPI Description

Search for an official OpenAPI or Swagger description:

1. Check any info locations provided by the user for OpenAPI/Swagger files.
2. Use `WebSearch` and `WebFetch` to look for an official OpenAPI spec published by the API provider.
3. Download the spec if found.

**If an official OpenAPI spec is found or provided:**
- Do NOT modify it in any way except for its `servers` element.
- Validate it for completeness and accuracy.
- If the OpenAPI is defective or inaccurate, **stop immediately**, explain the issues to the user, and request guidance before continuing.

**If no official OpenAPI spec exists, generate one:**
- Use **OpenAPI 3.0.3** format (not 3.1). WireMock's response validator does not support OpenAPI 3.1's `type: ['string', 'null']` syntax for nullable fields. Use `nullable: true` instead (e.g. `type: string` with `nullable: true`).
- Completely cover ALL known API operations.
- Include complete request/response schemas for every operation.
- Include valid, realistic examples for all requests and responses.
- Use appropriate HTTP methods, status codes, and content types.
- Define error responses (400, 401, 403, 404, 409, 500 as applicable).

Save the OpenAPI description to `openapi.yaml` in the current working directory.

## Step 3: Generate Arazzo Test Workflows

Generate an Arazzo 1.0.1+ document covering the API's functionality:

- Create one workflow per functional grouping (e.g., user management, billing, orders).
- Each workflow should chain related operations in a realistic sequence (e.g., create -> get -> update -> list -> delete).
- Reference the OpenAPI document via `sourceDescriptions`.
- Extract outputs from responses and pass them as inputs to subsequent steps (e.g., capture an ID from a create response and use it in subsequent get/update/delete steps).
- Include `successCriteria` on every step to validate status codes and key response fields.
- Where a step involves fetching data that was created in a previous step, the `successCriteria` should include checks that
specific items of data created were returned.
- Use realistic example data in request bodies that is consistent with the OpenAPI schemas.

Save the Arazzo document to `arazzo.yaml` in the current working directory.

## Step 4: Create and Configure the Mock API

1. **Create the mock API** using `create_mock_api` with an appropriate name derived from the API being mocked.

2. **Configure mock API settings** via the WireMock Cloud admin API (use `make_http_request`):
   - Disable automatic stub generation from the OpenAPI spec (enabled by default on new mock APIs).
   - Disable automatic OpenAPI generation from stubs.
   - Enable hard request validation against the OpenAPI schema.
   - Enable the API documentation portal.
   **Important:** This must be done BEFORE uploading the OpenAPI spec, since auto-generation is enabled by default and will create unwanted stubs on upload.

3. **Update the OpenAPI `servers` element** to point to the mock API's base URL.

4. **Upload the OpenAPI description** to the mock API using `put_openapi`.

5. **Update the Arazzo document** so that its `sourceDescriptions` URL points to the uploaded OpenAPI and the workflow base URL targets the mock API.

## Step 5: Populate and Verify the Mock API

Follow **Path A** if a sandbox is available, otherwise follow **Path B**.

---

### Path A: Sandbox Available

#### 5A.1: Set Up Authentication

1. Determine the authentication scheme from the API docs and OpenAPI spec.
2. If the user didn't supply an authenticator file, create one (e.g. `auth-config.yaml`) in an `authenticators` sub-directory of the working directory with the correct structure but placeholder values. `authenticators` should be excluded from git.
3. **Stop and ask the user** to fill in the real credentials. Do not proceed until the user confirms the authenticator file is complete.

#### 5A.2: Record Against the Sandbox

1. Start recording using `start_recording` with:
   - `baseUrl` set to the sandbox URL
   - `destination` set to `cloud:<mock_api_id>`
2. Use `get_recording_status` to find out the proxy port assigned to the recording session.

#### 5A.3: Run Arazzo Workflows Through the Recorder

1. Run the Arazzo workflows using `run_workflow` with:
   - `arazzoPath`: path to the local Arazzo document
   - `baseUrls`: override the source's base URL to `http://localhost:<recorder-port>`
   - `authConfigFiles`: include the path to `auth-config.yaml`

2. **If the run fails:**
   - Stop the recording (cancel it, do not persist the captured stubs).
   - Examine the run report to identify failures.
   - Fix the Arazzo workflows and/or request data.
   - Start a new recording session and retry.
   - Repeat until the entire run succeeds.

3. **When the run succeeds:**
   - Stop the recording normally so the captured stubs are saved.

#### 5A.4: Verify Against the Mock API

1. **Smoke test first.** Before running the full suite, manually test one create + retrieve cycle against the mock API to verify the basic flow works and passes OpenAPI validation. This gives fast feedback before the slower full suite.
2. Validate the stubs against the OpenAPI schema using the process in [Validating and Fixing Stubs](../references/validating-and-fixing.md).
3. Run the Arazzo workflows against the **mock API's base URL** (not the recorder).
4. If any steps fail, fix **stubs only**. Do NOT change the Arazzo workflows or OpenAPI description.
5. Repeat until all workflows pass.

---

### Path B: No Sandbox Available

#### 5B.1: Generate Stubs

Read the [Stub Creation Guidelines](../references/stub-creation.md) before proceeding.

Generate stubs covering ALL operations in the OpenAPI spec and import them using `import_stubs_to_mock_api`.

Cross-reference every response body against its schema's `required` fields. Ensure ALL required fields are present in the response. Fields that aren't typically sent by the client but are required in the response (e.g. `currency` on a refund) must be included with sensible defaults.

#### 5B.2: Verify Against the Mock API

1. **Smoke test first.** Before running the full suite, manually test one create + retrieve cycle against the mock API to verify the basic flow works and passes OpenAPI validation. This gives fast feedback before the slower full suite.
2. Validate the stubs against the OpenAPI schema using the process in [Validating and Fixing Stubs](../references/validating-and-fixing.md).
3. Run the Arazzo workflows against the mock API's base URL.
4. If any steps fail, fix **stubs only**. Do NOT change the Arazzo workflows or OpenAPI description.
5. Repeat until all workflows pass.

---

## Step 6: Stateful Conversion

**Only perform this step if the user requested stateful mode.**

Read the [Stateful Stubbing](../references/stateful-stubbing.md) reference, then retrieve all stubs with `get_stub_mappings`.

Convert the stubs to be stateful following these rules:

### Context and ID Management
- Use named contexts that reflect the collection path (e.g., `users`, `orders`, `invoices`).
- Always create IDs and context names via `REQUEST_VAR` operations first, then reference them in subsequent operations.
- Match the ID format used by the real API. Use `{{randomValue type='UUID'}}` for UUIDs, `{{randomValue type='NUMERIC' length=10}}` for numeric IDs, or custom patterns for other formats.

### POST (Create) Stubs
- Generate an ID with `REQUEST_VAR`.
- Set a `collectionContext` with `REQUEST_VAR`.
- Store the resource with `SET`, using `{{#jsonMerge request.body}}` (block form) to merge the request body with server-generated fields. The block content (overlay) must contain **only server-generated fields** (`id`, `created`, `status`, `object`, etc.) and fields that need default values not provided by the client. Do NOT include fields that the client sends in the request body — they pass through from `request.body` automatically.
- Cross-reference the overlay fields against the response schema's `required` list. Ensure every required field is present either in the typical request body or in the overlay. Fields that are required in the response but not typically sent by clients (e.g. `currency` on a refund) must be added to the overlay with a sensible default.
- Only use `removeNulls=true` if you need to strip a request body field that is being renamed/transformed (see stateful-stubbing.md for details). Do not use it if the response has legitimately nullable fields.
- Return the resource from state: `{{state id context=collectionContext}}`.
- Enable response templating: `"transformers": ["response-template"]`.

### GET (Single Item) Stubs
- Do NOT add a `customMatcher` or `require-state` — the 404 stub (see below) handles missing resources via priority.
- Return the item from state.

### GET (List/Collection) Stubs
- Return all items using `[{{arrayJoin ',' (listState collectionContext)}}]`.

### PUT/PATCH (Update) Stubs
- Merge updates into existing state with `{{jsonMerge previousValue request.body}}`.
- Only add `removeNulls=true` if you need to strip renamed/transformed fields.

### DELETE (Single Item) Stubs
- Use the `DELETE` operation to remove the item from its context.

### DELETE (Collection) Stubs
- Use `DELETE_CONTEXT` to remove all items.

### 404 Not Found Stubs
- For **every** endpoint that retrieves or operates on a single resource by ID, create a corresponding 404 stub.
- Use `require-state` with `"absent": true` to match when the item does NOT exist.
- Set the 404 stub to lower priority than the success stub (e.g., `"priority": 2`).
- Base the 404 response body on the 404 schema from the OpenAPI description if one exists. If no schema is defined, use a simple JSON error body consistent with the API's error format.
- **Important:** Only use `require-state` on 404 stubs with `"absent": true`. Do NOT use `require-state` for positive state matching (checking a key exists) — this causes unrecoverable 500 errors. Non-404 stubs should have no `customMatcher` at all.

### Dates and Timestamps
- For dates that should appear to be in the future or near past, use the `now` Handlebars helper with an appropriate offset instead of static values.
- Example: `{{now offset='1 day' format='yyyy-MM-dd\'T\'HH:mm:ss\'Z\''}}`.

### Import and Update
1. Import the new stateful stubs using `import_stubs_to_mock_api`.
2. Delete the old non-stateful stubs that have been replaced.
3. Update the OpenAPI via `put_openapi` to include any new paths or operations added during conversion (e.g., delete endpoints, 404 responses) where WireMock Cloud hasn't done this automatically.

### Verify
1. **Smoke test first.** Before running the full suite, manually test one create + retrieve cycle against the mock API to verify the basic stateful flow works and passes OpenAPI validation. This gives fast feedback before the slower full suite.
2. Validate the stubs against the OpenAPI schema using the process in [Validating and Fixing Stubs](../references/validating-and-fixing.md).
3. Run the Arazzo workflows against the mock API's base URL.
4. If any steps fail, fix **stubs only**. Do NOT change the Arazzo workflows or OpenAPI description.
5. Repeat until all workflows pass.

## Completion

When all steps are complete, report to the user:
- The mock API name and its base URL
- A summary of what was created (number of endpoints, workflows, stubs)
- Whether stateful mode was enabled
- The file paths of all generated artifacts (OpenAPI spec, Arazzo document, auth config if applicable)
- A link to the mock API's documentation portal
