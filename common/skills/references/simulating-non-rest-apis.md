# Simulating SOAP, GraphQL, gRPC and Other HTTP APIs

Follow this process instead of the REST steps when the API is not a REST API. OpenAPI, Arazzo and
OpenAPI request validation only describe REST APIs, so none of them is used here. The API is
described by its own kind of document instead, and a test script takes the place of the Arazzo
workflows.

| Kind | Mock API `type` | Describing document | Saved as | Test client |
|------|-----------------|---------------------|----------|-------------|
| SOAP | `unstructured` | WSDL (and any XSDs it imports) | `service.wsdl` | `curl` |
| GraphQL | `graphql` | GraphQL schema (SDL) | `schema.graphql` | `curl` |
| gRPC | `grpc` | `.proto` files, compiled to a descriptor set | `*.proto` and `grpc.dsc` | `grpcurl` |
| Other HTTP | `unstructured` | Whatever documentation exists | — | `curl` |

There is no SOAP mock API type. A SOAP API is simulated as an unstructured mock API whose stubs
match the SOAP action and the XML request body.

## Project folder layout

```
<project-folder>/
└── .wiremock/
    └── <service-name>/            # Lower-kebab-case, derived from the API name
        ├── stub-mappings.yaml     # All stub mappings (can be JSON format)
        ├── <describing document>  # service.wsdl, schema.graphql, or *.proto and grpc.dsc
        └── test-requests.sh       # Test script, in place of Arazzo workflows
```

Do not create a `.wiremock/wiremock.yaml` file.

## 1. Find or generate the describing document

Use the same rules as Step 3 of the skill, with the document for this kind of API in place of the
OpenAPI description:

- **If the API does not exist**, generate the document from the user's description, covering every
  operation it implies.
- **If the API exists**, check the info locations the user gave, then use `WebSearch` to look for an
  official WSDL, GraphQL schema or `.proto` files. Download the **entire** document with `curl`,
  together with any files it imports, and save it as-is. A GraphQL sandbox can also be introspected
  for its schema. Never change a downloaded document without the user's permission.
- **If nothing official exists**, generate the document from the API's documentation, covering every
  known operation with complete message types.

For gRPC, compile the `.proto` files into a descriptor set:

```
protoc --include_imports --descriptor_set_out=.wiremock/<service-name>/grpc.dsc <proto-files>
```

For another kind of HTTP API there may be no describing document at all. Work from its documentation.

## 2. Create and configure the mock API

1. Unless you were given the ID of an existing blank mock API to build into, call `create_mock_api`
   with `type` set from the table above and a name derived from the API.
2. Upload the describing document:
   - **GraphQL**: `push` the schema with `type: "graphql_schema"`, as described in
     [Transferring Files To and From a Mock API](file-transfer.md).
   - **gRPC**:
# @variant:remote
     the remote MCP server cannot upload a descriptor set. Ask the user to upload `grpc.dsc` on the
     mock API's gRPC page in the WireMock Cloud app, and wait until they confirm it is done.
# @variant:local
     `push` the descriptor set with `type: "grpc_descriptor"`, as described in
     [Transferring Files To and From a Mock API](file-transfer.md).
# @endvariant
   - **SOAP and other HTTP**: there is nothing to upload. Keep the WSDL in the project folder as the
     reference for the stubs.

Do not change the `openapi` settings: they apply only to REST mock APIs.

## 3. Write the test script

Write `.wiremock/<service-name>/test-requests.sh`, a `bash` script that takes the base URL as its
first argument and exercises the API as the Arazzo workflows would for a REST API:

- one function per functional grouping, each chaining related operations in a realistic sequence
  (e.g. create, then get, then update, then delete);
- values captured from one response and passed to the next request, such as the ID of a created
  resource;
- after every request, a check of the status and of key response values, including that data
  created by an earlier step is returned. Use `xmllint --xpath` for XML and `jq` for JSON;
- a summary of the checks that failed, and a non-zero exit status if any did.

Make requests with:

- **SOAP**: `curl -X POST` to the service's endpoint path with the full envelope as the body, the
  `SOAPAction` header for SOAP 1.1 and `Content-Type: text/xml; charset=utf-8`, or
  `Content-Type: application/soap+xml; charset=utf-8; action="<action>"` for SOAP 1.2;
- **GraphQL**: `curl -X POST` with a JSON body of `query`, `variables` and, where needed,
  `operationName`;
- **gRPC**: `grpcurl` with `-protoset .wiremock/<service-name>/grpc.dsc`, and `-plaintext` only for
  a mock API running locally without TLS.

Run the script with `bash .wiremock/<service-name>/test-requests.sh <base-url>`.

## 4. Populate the mock API

**If a sandbox is available** (SOAP, GraphQL and other HTTP), follow
[Recording from a Sandbox](recording-from-sandbox.md), running the test script against the recorder
(`http://localhost:<recorder-port>`) wherever it says to run the Arazzo workflows. Recording gRPC APIs
is not covered here: generate their stubs instead.

**Otherwise**, generate stubs covering every operation, following the
[Stub Creation Guidelines](stub-creation.md) except where this section says otherwise, and save them to
`.wiremock/<service-name>/stub-mappings.yaml` (root key `mappings`). Import them with `push`
(`type: "stub_mappings"`), as the REST flow does.

### SOAP stubs

- Match `POST` on the endpoint path with `urlPath`.
- Match the operation with the `SOAPAction` header (SOAP 1.1), or with the `action` parameter of the
  `Content-Type` header (SOAP 1.2), and with a `matchesXPath` body pattern on the operation's
  element. Use `local-name()` in XPath expressions, e.g.
  `//*[local-name()='GetBooking']/*[local-name()='BookingId'][text()='B-1001']`, so that namespace
  prefixes in the request do not matter.
- Return the full SOAP envelope with `Content-Type: text/xml; charset=utf-8` (SOAP 1.1) or
  `application/soap+xml; charset=utf-8` (SOAP 1.2).
- Return SOAP faults with status `500` and a `soap:Fault` body.
- If clients load the WSDL from the service at runtime (typically `GET <endpoint path>?wsdl`), add a
  stub that serves it, with the service's address pointing at the mock API's base URL.

See [Simulating SOAP services](../search-wiremock-cloud-docs/references/soap-stubbing.md) for more.

### GraphQL stubs

- A new GraphQL mock API has a default stub that answers any valid query with generated data. Leave
  it in place, so that queries with no specific stub still get an answer.
- Match a specific query with the `equal-to-graphql-query` custom matcher. It compares queries
  semantically, so field order and formatting do not matter, and values passed as variables match
  the same values written inline:

  ```json
  {
    "name": "Get booking B-1001",
    "request": {
      "method": "POST",
      "customMatcher": {
        "name": "equal-to-graphql-query",
        "parameters": {
          "query": "query { booking(id: \"B-1001\") { id status } }"
        }
      }
    },
    "response": {
      "status": 200,
      "headers": { "Content-Type": "application/json" },
      "body": "{\n  \"data\": {\n    \"booking\": { \"id\": \"B-1001\", \"status\": \"CONFIRMED\" }\n  }\n}"
    }
  }
  ```

- Return the full GraphQL response, with `data` and, for errors, `errors` at the root. GraphQL errors
  are returned with status `200`.

See [Simulating GraphQL APIs](../search-wiremock-cloud-docs/references/graphql/overview.md) for more.

### gRPC stubs

- Match `POST` on `/<fully qualified service name>/<method name>` with `urlPath`, e.g.
  `/com.example.booking.BookingService/GetBooking`.
- Match the request message, which is converted to JSON, with `equalToJson` or `matchesJsonPath`
  body patterns. No other kind of request matching applies.
- Return the response message as JSON, with status `200` and the header `grpc-status-name: OK`.
- Return an error with a header `grpc-status-name` set to its status (e.g. `NOT_FOUND`) and a
  `grpc-status-reason` header giving the message.

See [Simulating gRPC services](../search-wiremock-cloud-docs/references/grpc/overview.md) for more.

### Other HTTP stubs

Follow the [Stub Creation Guidelines](stub-creation.md), matching on whatever distinguishes one
operation from another (method, path, query, headers, body), and return the content types the API
documents.

## 5. Verify against the mock API

1. Reset the request journal with `reset_request_journal`.
2. Run the test script against the mock API's base URL.
3. Call `search_request_journal` and check for requests that matched no stub and for validation
   errors.
4. If anything fails, fix **stubs only**. Do not change the test script or the describing document.
5. Repeat until the script passes and the journal is clean.

If the user asked for a stateful mock API, follow [Stateful Stubbing](stateful-stubbing.md) as for
REST. Read values from XML request bodies with the `xPath` helper and from JSON ones with
`jsonPath`.

## 6. Final acceptance check

Before reporting, confirm that:

1. every operation — each WSDL operation, each query and mutation field in the GraphQL
   schema, each RPC method, or each documented endpoint — has at least one stub and is exercised by
   the test script;
2. a final run against the mock API, after resetting the request journal, passes in full;
3. the request journal shows no unmatched requests and no validation errors from that run.

Then report as the skill's Completion section says, naming the describing document and the test
script instead of the OpenAPI description and Arazzo workflows.
