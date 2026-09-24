<!-- AUTO-GENERATED from common/skills/... — do not edit directly; edit the source and run `npm run build`. -->

# gRPC Stub Creation Rules

Follow these rules whenever creating or modifying stubs for a WireMock Cloud **gRPC** mock API.
These rules override the general [Stub Creation Guidelines](stub-creation.md) for gRPC-specific
behaviour. Where they conflict (URL matching, body matchers, status encoding), follow this file.

---

## URL and Method Format

Every gRPC stub uses HTTP POST with a URL path derived from the proto service and method names:

```json
"urlPath": "/{service.FullName}/{MethodName}",
"method": "POST"
```

`service.FullName` is the package-qualified service name (e.g. `orders.OrderService`).
`MethodName` is the unqualified RPC method name (e.g. `GetOrder`).

Examples:
- `"urlPath": "/orders.OrderService/PlaceOrder"`
- `"urlPath": "/orders.OrderService/GetOrder"`

---

## Response Headers

Every gRPC stub **must** include a `grpc-status-name` response header. This tells WireMock Cloud
which gRPC status code to return to the caller.

**Successful response:**
```json
"headers": {
  "Content-Type": "application/json",
  "grpc-status-name": "OK"
}
```

**Error response (e.g. not found):**
```json
"headers": {
  "grpc-status-name": "NOT_FOUND",
  "grpc-status-reason": "order not found"
}
```

Error responses must NOT include a response body — the body is ignored by WireMock Cloud when
`grpc-status-name` is anything other than `OK`.

Valid `grpc-status-name` values (from the gRPC status code set): `OK`, `CANCELLED`, `UNKNOWN`,
`INVALID_ARGUMENT`, `NOT_FOUND`, `ALREADY_EXISTS`, `PERMISSION_DENIED`, `UNAUTHENTICATED`,
`RESOURCE_EXHAUSTED`, `FAILED_PRECONDITION`, `ABORTED`, `UNIMPLEMENTED`, `INTERNAL`,
`UNAVAILABLE`.

---

## Response Bodies

Response bodies must be valid **proto3 JSON**: the JSON representation of the proto response
message.

**Proto3 JSON uses camelCase field names**, not snake_case:
- `order_id` → `orderId`
- `customer_id` → `customerId`
- `created_at` → `createdAt`
- `product_id` → `productId`
- `page_size` → `pageSize`
- `next_page_token` → `nextPageToken`
- `total_count` → `totalCount`

Failing to use camelCase will cause a `GRPC_VALIDATION` error in WireMock Cloud.

Always use a string body (not `jsonBody`):
```json
"body": "{\"orderId\": \"ord-1001\", \"status\": \"DELIVERED\", \"total\": 209.98}"
```

---

## Stub Priority — Critical

WireMock Cloud gRPC stubs do **not** sort by specificity automatically. A fallback stub
(url + method only) will match before a more-specific stub (url + method + body patterns) unless
you set explicit priorities.

**Rule: every stub with body patterns must have `"priority": 1`.**
Leave fallback stubs (no body patterns) at the default priority (no `priority` field, which
defaults to 5 in WireMock).

```json
{
  "mappings": [
    {
      "priority": 1,
      "request": {
        "urlPath": "/orders.OrderService/GetOrder",
        "method": "POST",
        "bodyPatterns": [
          {
            "equalToJson": "{\"orderId\": \"ord-1001\"}",
            "ignoreExtraElements": true
          }
        ]
      },
      "response": { }
    },
    {
      "request": {
        "urlPath": "/orders.OrderService/GetOrder",
        "method": "POST"
      },
      "response": {
        "headers": {
          "grpc-status-name": "NOT_FOUND",
          "grpc-status-reason": "order not found"
        }
      }
    }
  ]
}
```

(Specific stub — `priority: 1` — is matched first; fallback has no priority and is matched last.)

---

## Body Matchers

WireMock Cloud validates that only JSON body matchers are used in gRPC stubs. Matchers such as
`contains`, `matches`, and `equalTo` are **rejected**.

Allowed body matchers:
- `equalToJson` (use `"ignoreExtraElements": true` to allow extra fields in the request)
- `matchesJsonPath` (use the `expression` + `equalTo` form to match a specific field value)

Example with `equalToJson`:
```json
"bodyPatterns": [
  {
    "equalToJson": "{\"orderId\": \"ord-1001\"}",
    "ignoreExtraElements": true
  }
]
```

Example with `matchesJsonPath`:
```json
"bodyPatterns": [
  {
    "matchesJsonPath": {
      "expression": "$.orderId",
      "equalTo": "ord-1001"
    }
  }
]
```

---

## Stub IDs

Every stub must have a valid UUID `id` field. Do not use slug-style IDs.

```json
"id": "481ea5d5-5c66-4bfe-aa50-b9903b4d3868"
```

---

## Fallback Stubs

Every service method must have a fallback stub with no body patterns. This stub handles requests
that don't match any specific stub.

For methods that return a single resource (e.g. `GetOrder`), the fallback returns `NOT_FOUND`:
```json
{
  "name": "GetOrder - not found",
  "request": {
    "urlPath": "/orders.OrderService/GetOrder",
    "method": "POST"
  },
  "response": {
    "status": 200,
    "headers": {
      "grpc-status-name": "NOT_FOUND",
      "grpc-status-reason": "order not found"
    }
  }
}
```

For methods that return a list (e.g. `ListOrders`), the fallback returns an empty list:
```json
{
  "name": "ListOrders - empty",
  "request": {
    "urlPath": "/orders.OrderService/ListOrders",
    "method": "POST"
  },
  "response": {
    "status": 200,
    "headers": {
      "Content-Type": "application/json",
      "grpc-status-name": "OK"
    },
    "body": "{\"orders\": [], \"totalCount\": 0}"
  }
}
```

For write methods (e.g. `PlaceOrder`), there is typically only one stub with no body matching,
so no fallback is needed.

---

## Descriptor Set

WireMock Cloud requires a gRPC descriptor set to validate request and response bodies against the
proto schema. Upload it using `push` (`type: "grpc_descriptor"`) as described in
[Transferring Files To and From a Mock API](file-transfer.md).

The local filename convention `grpc.dsc` exists for **WireMock CLI compatibility** only: the
`wiremock mock-apis push` command scans the service directory and looks for a file with exactly
that name. Store the descriptor set at `.wiremock/<service-name>/grpc.dsc` inside the project
folder. WireMock Cloud itself does not care what the file is named on disk.

Generating or copying the descriptor set into place is owned by the calling skill (e.g.
`build-grpc-simulation` Step 4) — do not invent an alternate layout here.

## wiremock.yaml

For a gRPC mock API, the service `type` in `wiremock.yaml` must be `gRPC` (not `REST`). See the
calling skill's Project Folder Layout for the full file structure.

## What to Avoid

- Do NOT use `grpc:` / `grpcStatus:` fields — these are rejected by the WireMock Cloud API.
- Do NOT use snake_case field names in response bodies — use camelCase per proto3 JSON spec.
- Do NOT omit `grpc-status-name` from response headers — WireMock Cloud will not know how to
  encode the gRPC response.
- Do NOT use body patterns without `"priority": 1` — they will silently lose to the fallback stub.
- Do NOT add a body to error responses (`grpc-status-name` ≠ `OK`) — the body is ignored and
  may trigger a `GRPC_VALIDATION` error.
