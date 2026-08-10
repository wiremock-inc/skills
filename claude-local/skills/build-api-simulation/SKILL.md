---
name: build-api-simulation
description: Generate a complete mock API in WireMock Cloud for any REST API. Creates an OpenAPI description, Arazzo test workflows, and WireMock stubs - optionally recorded from a live sandbox. Use when the user wants to create, mock, or simulate a REST API in WireMock Cloud.
user-invocable: true
argument-hint: "<api-name>"
allowed-tools:
  - Read(../references/*)
  - Bash(curl:*)
  - Bash(head:*)
  - Bash(npx swagger2openapi:*)
  - Bash(python3 ${CLAUDE_SKILL_DIR}/scripts/validate_openapi.py:*)
  - Bash(python3 ${CLAUDE_SKILL_DIR}/scripts/validate_arazzo.py:*)
  - Bash(python3 ${CLAUDE_SKILL_DIR}/scripts/validate_stub_mappings.py:*)
  - Bash(python3 ${CLAUDE_SKILL_DIR}/scripts/explore_openapi.py:*)
  - "mcp__plugin_wiremock-cloud-local_wiremock__who_am_i"
  - "mcp__plugin_wiremock-cloud-local_wiremock__search_my_mock_apis"
  - "mcp__plugin_wiremock-cloud-local_wiremock__create_mock_api"
  - "mcp__plugin_wiremock-cloud-local_wiremock__search_stub_mappings"
  - "mcp__plugin_wiremock-cloud-local_wiremock__delete_stub_mapping"
  - "mcp__plugin_wiremock-cloud-local_wiremock__search_request_journal"
  - "mcp__plugin_wiremock-cloud-local_wiremock__reset_request_journal"
  - "mcp__plugin_wiremock-cloud-local_wiremock__get_mock_api_settings"
  - "mcp__plugin_wiremock-cloud-local_wiremock__update_mock_api_settings"
  - "mcp__plugin_wiremock-cloud-local_wiremock__get_recording_status"

  - "mcp__plugin_wiremock-cloud-local_wiremock__push"
  - "mcp__plugin_wiremock-cloud-local_wiremock__pull"
  - "mcp__plugin_wiremock-cloud-local_wiremock__list_data_sources"
  - "mcp__plugin_wiremock-cloud-local_wiremock__get_data_source"
  - "mcp__plugin_wiremock-cloud-local_wiremock__get_data_source_data"
  - Bash(npx @wiremock/arazzo-runner:*)
---

<!-- AUTO-GENERATED from common/skills/... — do not edit directly; edit the source and run `npm run build`. -->

## Prerequisites

This skill requires the following MCP server to be configured and running:
- **WireMock Cloud MCP** - provides tools for managing mock APIs, stubs, recordings, and OpenAPI documents

If the WireMock Cloud MCP server is unavailable, stop and inform the user before proceeding.

Arazzo workflows are executed via the `@wiremock/arazzo-runner` CLI (invoked with `npx`), not an MCP tool. Node.js v18+ must be installed. See [Running Arazzo Workflows](#running-arazzo-workflows) below.

## Reference Documentation

The following WireMock guidelines are bundled as reference files. Read the relevant files when performing those steps:

- [Stub Creation Guidelines](../references/stub-creation.md) - rules for creating and importing stubs
- [Stateful Stubbing](../references/stateful-stubbing.md) - full guide to stateful mocking with the key-value state store, including examples
- [Data-Driven Stubbing](../references/data-driven-stubbing.md) - converting stubs to use data sources with pagination support
- [Validating and Fixing Stubs](../references/validating-and-fixing.md) - process for validating stubs against the OpenAPI schema and fixing errors
- [Response Template Authoring](../references/response-templating.md) - guidelines for Handlebars response templates, brace collision avoidance, and pagination metadata
- [Recording from a Sandbox](../references/recording-from-sandbox.md) - recording stubs from a live sandbox environment
- [Transferring Files To and From a Mock API](../references/file-transfer.md) - the upload/download flow used by `push` and `pull`

These references supersede the `look_up_documentation` MCP tool - do not call `look_up_documentation`.

## Running Arazzo Workflows

Whenever this skill says to "run the Arazzo workflows", invoke the CLI directly:

```
npx @wiremock/arazzo-runner run <arazzo-path> -b <source-name>=<base-url> [-a <auth-config-file>]... -r <report-path> --no-interactive
```

- `<source-name>` must match a name in the Arazzo document's `sourceDescriptions`. Pass `-b` once per source if there are multiple.
- Pass `-a` once per authenticator config file needed (omit if the API is unauthenticated).
- Always pass `--no-interactive` so the run never blocks waiting for input.
- Always pass `-r <report-path>` (e.g. `.wiremock/<service-name>/arazzo-report.yaml`) and read that report afterwards to check for step failures or response validation errors.

## Exploring the OpenAPI Document

Whenever you need to understand the API's shape — its title/version/servers, overall size, which tags exist, or which endpoints belong to a tag — use the bundled script instead of writing ad-hoc analysis code:

```
python3 ${CLAUDE_SKILL_DIR}/scripts/explore_openapi.py <openapi-path> info
python3 ${CLAUDE_SKILL_DIR}/scripts/explore_openapi.py <openapi-path> stats
python3 ${CLAUDE_SKILL_DIR}/scripts/explore_openapi.py <openapi-path> tags
python3 ${CLAUDE_SKILL_DIR}/scripts/explore_openapi.py <openapi-path> endpoints [tag]
```

- `info` — title, version, spec version, description, servers.
- `stats` — counts of paths, operations, responses, distinct status codes, tags, and schemas.
- `tags` — every tag with its operation count.
- `endpoints [tag]` — method, path, operationId, and summary for every operation, optionally filtered to one tag.

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
        ├── stub-mappings.yaml     # All stub mappings (can be JSON format)
        ├── openapi.yaml           # OpenAPI description
        └── arazzo.yaml            # Arazzo test workflows (when generated)
```

Create the `.wiremock/wiremock.yaml` file early (in Step 4 after creating the mock API) with this structure:

```yaml
services:
  <service-name>:
    type: REST
    name: "<Human-readable API name>"
    port: 8080
    cloud_id: <mock-api-id>
```

Update `cloud_id` with the actual mock API ID once it has been created. All subsequent file paths in the skill (OpenAPI, Arazzo, stubs) refer to this layout.

## Step 2: Find or Generate the OpenAPI Description

Search for an official OpenAPI or Swagger description:

1. Check any info locations provided by the user for OpenAPI/Swagger files.
2. Use `WebSearch` to look for an official OpenAPI or Swagger spec published by the API provider. Do NOT use `WebFetch` to retrieve it — `WebFetch` summarizes and truncates page content, which leaves no complete document to work from and leads to trying to reconstruct or analyze the spec piecemeal.
3. If a URL to a spec is found, download the **entire** document with `curl` instead, and save it as-is to `.wiremock/<service-name>/openapi.yaml` or `.wiremock/<service-name>/openapi.json` (matching the source format).

**If an official OpenAPI or Swagger spec is found or provided:**
- Do NOT modify its contents by hand. Never make any changes to a downloaded spec without explicit user permission (the `servers` update in Step 5 is the one standard exception).
- Do NOT analyze it directly if it's a Swagger 2.0 document — proceed to Step 3 first to convert it, then perform analysis in Step 5 on the converted result. An OpenAPI 3.x document can be analyzed as-is once Step 3 confirms its format.

**If no official OpenAPI spec exists, generate one:**
- Use **OpenAPI 3.0.3** format (not 3.1). WireMock's response validator does not support OpenAPI 3.1's `type: ['string', 'null']` syntax for nullable fields. Use `nullable: true` instead (e.g. `type: string` with `nullable: true`).
- Completely cover ALL known API operations.
- Include complete request/response schemas for every operation.
- Include valid, realistic examples for all requests and responses.
- Use appropriate HTTP methods, status codes, and content types.
- Define error responses (400, 401, 403, 404, 409, 500 as applicable).
- Save it to `.wiremock/<service-name>/openapi.yaml` inside the project folder.
- A freshly generated spec is already OpenAPI 3.0.3, so Step 3 will detect this and skip conversion.

## Step 3: Normalize a Swagger Document Locally

Pushing an OpenAPI/Swagger document to a mock API does **not** normalize it, so this must happen locally, before anything is uploaded or analyzed.

1. Detect the document's format by checking its top-level key:
   ```
   head -n 5 <openapi-path>
   ```
   If it has a top-level `swagger:` key (Swagger 2.0), continue to step 2. If it has a top-level `openapi:` key (already OpenAPI 3.x), skip straight to Step 4 — do not run `swagger2openapi` on a document that's already OpenAPI.
2. Convert the Swagger 2.0 document to OpenAPI 3.0.3 with `swagger2openapi`, patching minor errors, writing the result back over the same file:
   ```
   npx swagger2openapi <openapi-path> --patch --targetVersion 3.0.3 --outfile <openapi-path>
   ```
3. If the command reports fatal/non-patchable errors, treat them as genuine defects in the source spec — report them to the user rather than hand-editing the file.
4. From this point on, treat the resulting file as authoritative. All subsequent analysis (see [Exploring the OpenAPI Document](#exploring-the-openapi-document)), validation, and Arazzo generation must be based on this converted version, not the original Swagger document.

## Step 4: Create and Configure the Mock API

1. **Create the mock API** using `create_mock_api` with an appropriate name derived from the API being mocked.

2. **Create `.wiremock/wiremock.yaml`** inside the project folder with the mock API's ID as `cloud_id` (see Project Folder Layout above).

3. **Disable OpenAPI generation in both directions** using `update_mock_api_settings` with `settingsType: "openapi"`. This must be done BEFORE uploading the OpenAPI spec or importing any stubs:
   - Set `generateStubsFromOpenApi: false` (automatic stub generation from the OpenAPI spec is enabled by default on new mock APIs).
   - Set `generateOpenApiFromStubs: false` (automatic OpenAPI generation from stubs).
   - Set `validationMode: "hard"` to enable hard request validation against the OpenAPI schema.
   - Set `portalEnabled: true` to enable the API documentation portal.

## Step 5: Validate and Finalize the OpenAPI Description

1. Inspect the normalized OpenAPI description from Step 3 for completeness and accuracy — use [Exploring the OpenAPI Document](#exploring-the-openapi-document) to check coverage instead of writing ad-hoc analysis code.
2. If it appears to have genuine defects (missing schemas, incorrect types, invalid structure, etc.), **report them to the user** and do not attempt to fix them. These are upstream issues that should be raised with the API provider. Ask the user how to proceed — they may choose to accept the defects, provide a corrected spec, or grant permission to patch specific issues.
3. Upload this final version to the mock API using `push` (`type: "openapi_description"`) as described in [Transferring Files To and From a Mock API](../references/file-transfer.md).
4. Sanity-check the saved local file by running `python3 ${CLAUDE_SKILL_DIR}/scripts/validate_openapi.py <path>` and reviewing the printed path count and operationIds.

## Step 6: Generate Arazzo Test Workflows

Generate an Arazzo 1.0.1+ document covering the API's functionality. Use [Exploring the OpenAPI Document](#exploring-the-openapi-document) (`tags` and `endpoints [tag]`) to identify functional groupings and their operations instead of reading the whole spec by hand.

- Create one workflow per functional grouping (e.g., user management, billing, orders).
- Each workflow should chain related operations in a realistic sequence (e.g., create -> get -> update -> list -> delete).
- Reference the final OpenAPI document (from Step 5) via `sourceDescriptions`, with the workflow base URL targeting the mock API.
- Extract outputs from responses and pass them as inputs to subsequent steps (e.g., capture an ID from a create response and use it in subsequent get/update/delete steps).
- Include `successCriteria` on every step to validate status codes and key response fields.
- Where a step involves fetching data that was created in a previous step, the `successCriteria` should include checks that
specific items of data created were returned.
- Use realistic example data in request bodies that is consistent with the OpenAPI schemas.

Save the Arazzo document to `.wiremock/<service-name>/arazzo.yaml` inside the project folder.

Sanity-check the saved file by running `python3 ${CLAUDE_SKILL_DIR}/scripts/validate_arazzo.py <path>` and reviewing the printed workflowIds and step IDs.

## Step 7: Populate and Verify the Mock API

Follow **Path A** if a sandbox is available, otherwise follow **Path B**.

---

### Path A: Sandbox Available

Read and follow [Recording from a Sandbox](../references/recording-from-sandbox.md) to set up authentication, record stubs via the Arazzo workflows, and verify them against the mock API.

---

### Path B: No Sandbox Available

#### 7B.1: Generate Stubs

Read the [Stub Creation Guidelines](../references/stub-creation.md) before proceeding.

Generate stubs covering ALL operations in the OpenAPI spec and save them to `.wiremock/<service-name>/stub-mappings.yaml` (root key `mappings`).

Cross-reference every response body against its schema's `required` fields. Ensure ALL required fields are present in the response. Fields that aren't typically sent by the client but are required in the response (e.g. `currency` on a refund) must be included with sensible defaults.

Sanity-check the saved file by running `python3 ${CLAUDE_SKILL_DIR}/scripts/validate_stub_mappings.py <path>` and reviewing the printed mapping count and method/path/status summary.

Import the stubs using `push` (`type: "stub_mappings"`) as described in [Transferring Files To and From a Mock API](../references/file-transfer.md), not `import_stubs_to_mock_api` — this is a rare case where `push`'s replace-all behavior is fine, since this is the initial stub set for a newly built mock API, and `push` takes a real file, avoiding hand-escaping a large stub set into a JSON string parameter.

#### 7B.2: Verify Against the Mock API

1. Validate the stubs against the OpenAPI schema using the process in [Validating and Fixing Stubs](../references/validating-and-fixing.md).
2. Run the Arazzo workflows (see [Running Arazzo Workflows](#running-arazzo-workflows)) against the mock API's base URL.
3. If any steps fail, fix **stubs only**. Do NOT change the Arazzo workflows or OpenAPI description.
4. Repeat until all workflows pass.

---

## Step 8: Stateful Conversion

**Only perform this step if the user requested stateful mode.**

Read the [Stateful Stubbing](../references/stateful-stubbing.md) reference (including the "Converting stubs by HTTP method" section), then retrieve all stubs with `search_stub_mappings` and convert them following the patterns in the reference.

After converting:
1. Validate the stubs using [Validating and Fixing Stubs](../references/validating-and-fixing.md).
2. Run the Arazzo workflows (see [Running Arazzo Workflows](#running-arazzo-workflows)) against the mock API's base URL. Fix **stubs only** if any steps fail. Repeat until all pass.

## Final Acceptance Check

Before finishing, verify **all three** of the following criteria are met:

### 1. Full endpoint coverage
Cross-reference every operation in the OpenAPI spec against the stubs and Arazzo workflows:
- Every operation must have at least one corresponding stub.
- Every operation must be exercised by at least one Arazzo workflow step.
- If any gaps are found, create the missing stubs and/or Arazzo steps before proceeding.

### 2. Final regression run
Run a clean regression pass to confirm everything works end-to-end:
1. Reset the request journal.
2. Run all Arazzo workflows (see [Running Arazzo Workflows](#running-arazzo-workflows)) against the mock API's base URL.
3. Check the request journal for any response validation errors.
4. If there are failures or validation errors, fix the stubs and repeat until the run is fully clean.

### 3. No unresolved validation errors
Confirm the request journal shows **zero** response validation errors across all requests made during the final regression run.

Do **not** proceed to Completion until all three criteria pass.

## Completion

When all steps and the acceptance check are complete, report to the user:
- The mock API name and its base URL
- A summary of what was created (number of endpoints, workflows, stubs)
- Whether stateful mode was enabled
- The project folder path and its `.wiremock/` layout
- A link to the mock API's documentation portal
