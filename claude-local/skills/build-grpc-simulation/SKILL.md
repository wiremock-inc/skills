---
name: build-grpc-simulation
description: Build a complete gRPC mock API in WireMock Cloud from a proto file or a pre-built descriptor set (.dsc). Probes a live gRPC endpoint first if available, otherwise generates stubs from the proto definition. Optionally makes the mock stateful. Use when the user wants to create, mock, or simulate a gRPC service in WireMock Cloud.
user-invocable: true
argument-hint: "<path-to-proto-or-dsc-file>"
allowed-tools:
  - Read
  - Read(../references/*)
  - Bash(protoc:*)
  - Bash(grpcurl:*)
  - Bash(uuidgen:*)
  - Bash(cp:*)
  - "mcp__plugin_wiremock-cloud-local_wiremock__who_am_i"
  - "mcp__plugin_wiremock-cloud-local_wiremock__search_my_mock_apis"
  - "mcp__plugin_wiremock-cloud-local_wiremock__create_mock_api"
  - "mcp__plugin_wiremock-cloud-local_wiremock__search_stub_mappings"
  - "mcp__plugin_wiremock-cloud-local_wiremock__update_stub_mapping"
  - "mcp__plugin_wiremock-cloud-local_wiremock__delete_stub_mapping"
  - "mcp__plugin_wiremock-cloud-local_wiremock__import_stubs_to_mock_api"
  - "mcp__plugin_wiremock-cloud-local_wiremock__search_request_journal"
  - "mcp__plugin_wiremock-cloud-local_wiremock__reset_request_journal"
  - "mcp__plugin_wiremock-cloud-local_wiremock__reset_state"

  - "mcp__plugin_wiremock-cloud-local_wiremock__push"
---

<!-- AUTO-GENERATED from common/skills/... — do not edit directly; edit the source and run `npm run build`. -->

## Prerequisites

This skill requires:
- **WireMock Cloud MCP** server configured and running. If unavailable, stop and inform the user.
- **grpcurl** installed and on PATH (needed for inspecting descriptor sets, probing live endpoints, and testing stubs).
- **protoc** (Protocol Buffers compiler) — required only when the input is a `.proto` file.
  Not needed when the user supplies a pre-built descriptor set (`.dsc`).

Check grpcurl before starting:
```bash
grpcurl --version
```

If a `.proto` file is provided, also check protoc:
```bash
protoc --version
```

If a required tool is missing, tell the user which to install and stop. Include install guidance:
- grpcurl: `brew install grpcurl` (macOS) or https://github.com/fullstorydev/grpcurl/releases
- protoc: `brew install protobuf` (macOS) or https://grpc.io/docs/protoc-installation/

## Reference Documentation

Read these before proceeding:
- [gRPC Stub Rules](../references/grpc-stub-rules.md) — gRPC-specific stub format, required headers, priority rules, camelCase encoding
- [gRPC Stateful Stubs](../references/grpc-stateful-stubbing.md) — patterns for stateful Create/Get/List mocking using the WireMock Cloud state store
- [Stub Creation Guidelines](../references/stub-creation.md) — general rules for creating and importing stubs (`push` vs `import_stubs_to_mock_api`)
- [Transferring Files To and From a Mock API](../references/file-transfer.md) — the upload flow used by `push`

These references supersede the `look_up_documentation` MCP tool — do not call `look_up_documentation`.
The gRPC-specific references are the sole authoritative source for gRPC stub format. Do not rely on
general WireMock stub creation guidelines for gRPC-specific decisions — they diverge in important ways.

## Step 1: Identify the Input File

The input file path is: **$ARGUMENTS**

If `$ARGUMENTS` is empty, ask the user for a path to either:
- A `.proto` source file, **or**
- A pre-built descriptor set file (`.dsc` or `.pb`)

WireMock Cloud requires a descriptor set to validate gRPC responses. A `.proto` file is the most
common starting point; the descriptor set is generated automatically in Step 4. If the user
already has a descriptor set, skip generation entirely.

### Detecting the input type

Check the file extension:
- `.proto` → **proto input**. Read the file as text to understand the service.
- `.dsc`, `.pb`, or any binary file → **descriptor set input**. Use grpcurl to inspect it.

If the extension is ambiguous, check whether the file starts with a printable `{` or `syntax`
keyword (proto) vs. binary bytes (descriptor set).

### If input is a `.proto` file

Read the file and extract:
- The package name
- Every service name and its full qualified name (package + service, e.g. `orders.OrderService`)
- Every RPC method with its request and response message types
- All message field names — note that proto uses snake_case, which becomes camelCase in JSON

If the proto imports other files, note their locations — they are needed for `protoc` in Step 4.

### If input is a descriptor set file

The file is binary and not human-readable directly. Use grpcurl to discover its contents:

```bash
# List all services in the descriptor set
grpcurl -protoset <dsc-file> list

# List all methods for a specific service
grpcurl -protoset <dsc-file> list <service.FullName>

# Describe a service (shows all RPC signatures)
grpcurl -protoset <dsc-file> describe <service.FullName>

# Describe a specific message type (shows field names and types)
grpcurl -protoset <dsc-file> describe <service.FullName>.<MessageName>
```

Run these commands to extract the same information you would get from reading a proto file:
service full names, method names, request/response message types, and field names.
Note that field names in the descriptor are in snake_case — convert them to camelCase for JSON.

## Step 2: Gather Configuration

Use `AskUserQuestion` to collect the remaining inputs in a single question block:

1. **Mock API name**: What name should the WireMock Cloud mock API have?
   Default: derive from the proto service name (e.g. `Order Service gRPC Mock`).

2. **Project folder**: Where should the project files be placed?
   Default: `./<service-name-in-lower-kebab-case>` (e.g. `./order-service`), derived from the
   proto service name discovered in Step 1.

3. **Live endpoint**: Is there a live gRPC server available to probe for real responses?
   If yes, what is its `host:port`? Does it require TLS? Does it support gRPC reflection?

4. **Stateful**: Should the mock maintain state across requests (e.g. so a created order can be
   retrieved by ID in a later call)?

5. **Other directives**: Any additional guidance — specific methods to cover, data scenarios to
   include, methods to skip, etc.

## Project Folder Layout

All generated files must follow the WireMock Runner layout inside the chosen project folder:

```
<project-folder>/
└── .wiremock/
    ├── wiremock.yaml              # Runner config with cloud_id
    └── <service-name>/            # Lower-kebab-case, derived from the service
        ├── grpc.dsc               # Descriptor set (CLI-compatible name)
        └── stub-mappings.json     # All stub mappings (JSON — required by push)
```

Create the `.wiremock/wiremock.yaml` file early (in Step 5 after creating the mock API). All
subsequent file paths in this skill refer to this layout.

## Step 3: Derive Names and Paths

From the service information discovered in Step 1 and the user inputs, establish:

- `service-name`: lower-kebab-case derived from the service (e.g. `order-service`)
- `service-full-name`: package + service (e.g. `orders.OrderService`)
- `project-folder`: the chosen project folder (e.g. `./order-service`)
- `service-dir`: `<project-folder>/.wiremock/<service-name>` (e.g. `./order-service/.wiremock/order-service`)
- `dsc-path`: `<service-dir>/grpc.dsc` — named `grpc.dsc` for WireMock CLI compatibility; WireMock Cloud itself does not require this name
- `stubs-path`: `<service-dir>/stub-mappings.json`
- `wiremock-yaml`: `<project-folder>/.wiremock/wiremock.yaml`

Create `<service-dir>` (and its `.wiremock` parent) if it does not already exist.

## Step 4: Prepare the Descriptor Set

WireMock Cloud requires a descriptor set file to validate gRPC request and response bodies
against the proto schema. The descriptor set must land at `<dsc-path>` (`grpc.dsc`).

### If input was a `.proto` file — generate automatically

Run `protoc` to compile the proto into a descriptor set:

```bash
protoc \
  --proto_path=<proto-dir> \
  --descriptor_set_out=<dsc-path> \
  --include_imports \
  <proto-file>
```

- `<proto-dir>` is the directory containing the `.proto` file.
- `--include_imports` bundles all imported proto files into the single output file — required
  for WireMock Cloud to resolve all referenced message types.
- If the proto imports files from other directories, add additional `--proto_path=<dir>` flags.

Verify `<dsc-path>` exists after the command. If `protoc` reports errors, surface them to the
user verbatim and stop — do not attempt to fix proto source errors automatically.

### If input was a descriptor set file — copy into place

Copy the supplied file to the canonical location:

```bash
cp <supplied-dsc-file> <dsc-path>
```

Then confirm the file is a valid descriptor set by listing its services with grpcurl:

```bash
grpcurl -protoset <dsc-path> list
```

If grpcurl reports an error (corrupt or unrecognised file), tell the user and stop.

## Step 5: Create the WireMock Cloud Mock API

1. Create the mock API using `create_mock_api` with type `grpc` and the chosen name.
   Capture the returned `cloud_id`.

2. Create `<wiremock-yaml>` with this structure:
   ```yaml
   services:
     <service-name>:
       type: 'gRPC'
       name: '<Human-readable API name>'
       cloud_id: '<cloud-id>'
       path: './<service-name>'
       port: 8080
   ```

   Note: `create_mock_api` uses lowercase `grpc`; `wiremock.yaml` uses `gRPC`.
3. Upload the descriptor set to the mock API using `push` (`type: "grpc_descriptor"`) as
   described in [Transferring Files To and From a Mock API](../references/file-transfer.md).
   The descriptor set must be uploaded before any stubs can be validated against the proto schema.

## Step 6: Generate Stubs

Choose the path based on whether a live endpoint is available.

---

### Path A — Live Endpoint Available (Probe First)

#### A.1 Discover Methods

Confirm the available methods using grpcurl with the descriptor set (no reflection needed):

```bash
grpcurl -protoset <dsc-path> [-plaintext] <host:port> list <service.FullName>
```

Use `-plaintext` for non-TLS endpoints. This confirms the live server exposes the expected
methods. If the server also supports reflection, the `-protoset` flag can be omitted.

#### A.2 Probe Each Method

For each RPC method, send a representative request using grpcurl and capture the JSON response.
Always pass `-protoset <dsc-path>` so grpcurl can encode the request and decode the response
without needing server-side reflection:

```bash
grpcurl -protoset <dsc-path> [-plaintext] \
  -d '<json-request-body>' \
  <host:port> \
  <service.FullName>/<MethodName>
```

- Construct request bodies that exercise the method meaningfully (use seeded data from the
  proto's field names and types, converting to camelCase JSON).
- For methods that take an ID (e.g. `GetOrder`), first probe the Create method to get a real ID,
  then use that ID for the Get probe.
- For List methods, probe after creating at least one resource.
- Capture the JSON responses verbatim — these become the stub response bodies.

If a method returns an error (e.g. NOT_FOUND for a missing ID), note the gRPC status code
returned — this informs fallback stub configuration.

#### A.3 Build Stubs from Captured Responses

Read [gRPC Stub Rules](../references/grpc-stub-rules.md), then create stubs based on the captured
responses. Follow Path B below (§B.2) for the stub structure, substituting the real captured
response bodies for the generated examples.

---

### Path B — No Live Endpoint (Generate from Proto)

#### B.1 Analyze the Proto

For each service method, note:
- Method name, request message, response message
- Whether the method is a "create" (takes data, returns a new resource), "read" (takes an ID,
  returns a resource), "list" (takes optional filters, returns a collection), or "mutate/delete"
- Required fields in each message
- Field names (snake_case in proto → camelCase in JSON response bodies)

#### B.2 Generate Stubs

Read [gRPC Stub Rules](../references/grpc-stub-rules.md) now. Apply every rule in that reference
without exception.

Generate realistic, internally consistent example data:
- Use plausible IDs (e.g. `ord-1001`, `cust-abc`)
- Status values should use the enum names from the proto (e.g. `PENDING`, `SHIPPED`)
- Timestamps in RFC3339 format (e.g. `2024-01-15T09:00:00Z`)
- All monetary amounts as numbers (not strings)

For each service method, create:

**Write methods (PlaceOrder / Create-style):**
One stub with no body patterns, `grpc-status-name: OK`, and a representative response.

**Read methods (GetOrder / Get-style):**
- One specific stub per seeded resource, with `priority: 1` and an `equalToJson` body pattern
  matching the resource's ID.
- One fallback stub with no body patterns and `grpc-status-name: NOT_FOUND`.
  Include at least 2–3 seeded resources.

**List methods (ListOrders / List-style):**
One stub with no body patterns returning all seeded resources.
Use camelCase for the repeated field wrapper (e.g. `orders`, `nextPageToken`, `totalCount`).

**All stubs** must have:
- A valid UUID `id`
- A meaningful `name`
- `grpc-status-name` in the response headers
- camelCase field names in the response body

Save all stubs to `<stubs-path>` under a root `mappings:` key.

---

## Step 7: Import Stubs

Import the stubs using `push` (`type: "stub_mappings"`) as described in
[Transferring Files To and From a Mock API](../references/file-transfer.md), not
`import_stubs_to_mock_api` — this is a rare case where `push`'s replace-all behavior is fine,
since this is the initial stub set for a newly built mock API, and `push` takes a real file,
avoiding hand-escaping a large stub set into a JSON string parameter.

See [Stub Creation Guidelines](../references/stub-creation.md) for the general `push` vs import
preference; gRPC request/response shape still comes from [gRPC Stub Rules](../references/grpc-stub-rules.md).

## Step 8: Test Every Stub with grpcurl

Test each stub end-to-end using grpcurl against the WireMock Cloud mock API host
(`<cloud-id>.wiremockapi.cloud:443`).

For each service method:
```bash
grpcurl -d '<json-request>' <cloud-id>.wiremockapi.cloud:443 <service.FullName>/<MethodName>
```

For Get-style methods, test:
1. A known ID → expect the specific order/resource data
2. An unknown ID → expect `Code: NotFound`

For List methods, test with no filter and (if applicable) with a filter value.

For Write methods, test with a valid request body → expect the stub response.

Check the request journal for any `GRPC_VALIDATION` sub-events:
- Validation errors mean the response body has incorrect field names (usually snake_case instead
  of camelCase) or missing required fields. Fix the stub body and re-push with `push`
  (`type: "stub_mappings"`).

Fix any failing stubs and re-push. Repeat until all stubs return the correct responses.

## Step 9: Stateful Conversion (Conditional)

**Only perform this step if the user requested stateful mode.**

Read [gRPC Stateful Stubs](../references/grpc-stateful-stubbing.md) fully before starting.

Replace the static stubs with stateful versions:

1. **Write methods** (PlaceOrder / Create): Add `serveEventListeners` to store the created
   resource in the state context. Use `{{randomValue}}` to generate a realistic ID. Return the
   stored resource from the response body template.

2. **Read methods** (GetOrder / Get): Replace the static specific stubs with a single
   state-lookup stub. Add a `require-state` guard stub at `priority: 2` for the not-found case.

3. **List methods** (ListOrders): Replace the static list with `{{listState '<context>'}}`.

4. Delete the old specific `equalToJson` stubs — they are no longer needed in stateful mode.
   Use `delete_stub_mapping` for each one. Prefer uploading the new stateful set with `push`
   (`type: "stub_mappings"`) via [Transferring Files To and From a Mock API](../references/file-transfer.md)
   so Handlebars templates are not hand-escaped into a JSON string parameter.

After replacing stubs, test the full lifecycle:
```bash
# 1. Create a resource
grpcurl -d '<create-request>' <host>:443 <svc>/PlaceOrder   # Captures returned ID

# 2. Retrieve it by ID
grpcurl -d '{"orderId": "<id>"}' <host>:443 <svc>/GetOrder

# 3. Verify not-found for a fake ID
grpcurl -d '{"orderId": "ord-0000"}' <host>:443 <svc>/GetOrder
# Expect: Code: NotFound

# 4. List all resources
grpcurl <host>:443 <svc>/ListOrders
```

Fix stubs until all lifecycle steps pass. Use `reset_state` to clear state between test runs.

## Final Acceptance Check

Before finishing, verify **all three** of the following criteria are met:

### 1. Full method coverage
Cross-reference every RPC method discovered in Step 1 against the stubs:
- Every method must have at least one corresponding stub (including fallbacks where required by
  [gRPC Stub Rules](../references/grpc-stub-rules.md)).
- If any gaps are found, create the missing stubs and re-push before proceeding.

### 2. Final regression run
Run a clean regression pass end-to-end:
1. Reset the request journal with `reset_request_journal`.
2. If stateful mode is enabled, reset state with `reset_state`.
3. Re-run the grpcurl checks from Step 8 (and Step 9's lifecycle if stateful).
4. Check the request journal for any `GRPC_VALIDATION` sub-events.
5. If there are failures or validation errors, fix the stubs, re-push, and repeat until clean.

### 3. No unresolved validation errors
Confirm the request journal shows **zero** `GRPC_VALIDATION` sub-events across all requests made
during the final regression run.

Do **not** proceed to Completion until all three criteria pass.

## Completion

Report to the user:
- The WireMock Cloud mock API name and its gRPC host (`<cloud-id>.wiremockapi.cloud:443`)
- How many stubs were created and which methods they cover
- Whether stateful mode is enabled
- The local project layout (`<project-folder>/.wiremock/`)
- Example grpcurl commands for each method, ready to copy-paste

Example output format:
```
Mock API: Order Service gRPC Mock
Host:     order-service-grpc-mock.wiremockapi.cloud:443
Stubs:    6 stubs covering PlaceOrder, GetOrder (3 specific + fallback), ListOrders
Stateful: no

grpcurl commands:
  grpcurl -d '{"customerId":"cust-abc","items":[{"productId":"p1","name":"Widget","quantity":1,"price":9.99}]}' \
    order-service-grpc-mock.wiremockapi.cloud:443 orders.OrderService/PlaceOrder

  grpcurl -d '{"orderId":"ord-1001"}' \
    order-service-grpc-mock.wiremockapi.cloud:443 orders.OrderService/GetOrder

  grpcurl order-service-grpc-mock.wiremockapi.cloud:443 orders.OrderService/ListOrders
```
