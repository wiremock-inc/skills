# Stateful gRPC Stubs

This reference shows how to convert static gRPC stubs to stateful ones using WireMock Cloud's
key-value state store. It extends the general [Stateful Stubbing](stateful-stubbing.md)
reference with gRPC-specific patterns.

## Key Differences from REST Stateful Stubs

In REST stubs, resource IDs come from URL path variables (e.g. `/orders/{orderId}`).
In gRPC stubs, IDs come from the **request body**, accessed via `jsonPath request.body '$.fieldName'`.

This affects:
- How `require-state` matchers reference the ID
- How GET/DELETE stubs look up the resource
- Priority ordering (same rules, different reasons — body patterns need `priority: 1`)

---

## Pattern: Create (e.g. PlaceOrder)

```json
{
  "id": "<uuid>",
  "name": "PlaceOrder - create",
  "request": {
    "urlPath": "/orders.OrderService/PlaceOrder",
    "method": "POST"
  },
  "response": {
    "status": 200,
    "headers": {
      "Content-Type": "application/json",
      "grpc-status-name": "OK"
    },
    "body": "{{#formatJson}}\n  {{state id context=collectionContext}}\n{{/formatJson}}",
    "transformers": ["response-template"]
  },
  "persistent": true,
  "serveEventListeners": [{
    "name": "change-state",
    "parameters": {
      "operations": [
        {
          "context": "local",
          "key": "id",
          "operation": "REQUEST_VAR",
          "phase": "AFTER_MATCH",
          "value": "ord-{{randomValue type='NUMERIC' length=4}}"
        },
        {
          "context": "local",
          "key": "collectionContext",
          "operation": "REQUEST_VAR",
          "phase": "AFTER_MATCH",
          "value": "orders"
        },
        {
          "context": "{{collectionContext}}",
          "key": "{{id}}",
          "operation": "SET",
          "phase": "AFTER_MATCH",
          "value": "{{#jsonMerge request.body}}\n{\n  \"orderId\": \"{{id}}\",\n  \"status\": \"PENDING\",\n  \"createdAt\": \"{{now format='yyyy-MM-dd\\'T\\'HH:mm:ss\\'Z\\''}}\" \n}\n{{/jsonMerge}}"
        }
      ]
    }
  }]
}
```

Notes:
- Return the stored resource via `{{state id context=collectionContext}}` (same pattern as REST
  stateful creates) so Create and Get stay consistent.
- The overlay in `jsonMerge` must contain **only server-generated fields** — client-supplied
  fields (`customerId`, `items`) pass through from `request.body` automatically.
- Ensure the overlay (plus typical request fields) covers every field the proto response message
  requires — adjust field names to camelCase.
- The ID format (`ord-XXXX`) should match the real service's ID format.

---

## Pattern: Get Single Resource (e.g. GetOrder)

For the **success** case, set `id` and `collectionContext` via `REQUEST_VAR`, then look up the
resource (same pattern as REST stateful gets — ID comes from the request body instead of the path):

```json
{
  "id": "<uuid>",
  "name": "GetOrder - found",
  "request": {
    "urlPath": "/orders.OrderService/GetOrder",
    "method": "POST"
  },
  "response": {
    "status": 200,
    "headers": {
      "Content-Type": "application/json",
      "grpc-status-name": "OK"
    },
    "body": "{{#formatJson}}\n  {{state id context=collectionContext}}\n{{/formatJson}}",
    "transformers": ["response-template"]
  },
  "persistent": true,
  "serveEventListeners": [{
    "name": "change-state",
    "parameters": {
      "operations": [
        {
          "context": "local",
          "key": "id",
          "operation": "REQUEST_VAR",
          "phase": "AFTER_MATCH",
          "value": "{{jsonPath request.body '$.orderId'}}"
        },
        {
          "context": "local",
          "key": "collectionContext",
          "operation": "REQUEST_VAR",
          "phase": "AFTER_MATCH",
          "value": "orders"
        }
      ]
    }
  }]
}
```

For the **not found** case, use `require-state` with `absent: true` at `priority: 2`:

```json
{
  "id": "<uuid>",
  "name": "GetOrder - not found",
  "priority": 2,
  "request": {
    "urlPath": "/orders.OrderService/GetOrder",
    "method": "POST",
    "customMatcher": {
      "name": "custom-and-matcher",
      "parameters": {
        "matchers": [{
          "name": "require-state",
          "parameters": {
            "requirements": [{
              "key": "{{jsonPath request.body '$.orderId'}}",
              "absent": true,
              "context": "orders"
            }]
          }
        }]
      }
    }
  },
  "response": {
    "status": 200,
    "headers": {
      "grpc-status-name": "NOT_FOUND",
      "grpc-status-reason": "order not found"
    },
    "body": "null"
  },
  "persistent": true
}
```

Notes:
- Error responses must use `"body": "null"` — see [gRPC Stub Rules](grpc-stub-rules.md).
- The `require-state` stub uses `priority: 2` so it matches before the no-priority success stub
  (which defaults to priority 5) when the key is absent.
- The success stub has **no `customMatcher`** — let the not-found stub act as the guard.
- `require-state` runs at match time, before `AFTER_MATCH` listeners, so its `key` and `context`
  must stay inline (`jsonPath` / `"orders"`) — they cannot use `{{id}}` / `{{collectionContext}}`.
- The success stub's `REQUEST_VAR` for `id` mirrors the state store key used in the CREATE step.

---

## Pattern: List All Resources (e.g. ListOrders)

Return all items from the state context as a proto3 JSON array:

```json
{
  "id": "<uuid>",
  "name": "ListOrders - all",
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
    "body": "{{#formatJson}}\n{\n  \"orders\": [{{arrayJoin ',' (listState collectionContext)}}],\n  \"totalCount\": {{size (listState collectionContext)}}\n}\n{{/formatJson}}",
    "transformers": ["response-template"]
  },
  "persistent": true,
  "serveEventListeners": [{
    "name": "change-state",
    "parameters": {
      "operations": [
        {
          "context": "local",
          "key": "collectionContext",
          "operation": "REQUEST_VAR",
          "phase": "AFTER_MATCH",
          "value": "orders"
        }
      ]
    }
  }]
}
```

Notes:
- The `{{size ...}}` helper returns the number of items.
- `listState` returns raw JSON objects (the values stored in the state context), which are
  joined with commas and wrapped in the proto3 JSON array field.
- The outer field name (`orders`) must match the proto `repeated` field name in camelCase.
- Set `collectionContext` via `REQUEST_VAR` so the same stub pattern ports to other resources.

If `ListOrders` supports a request field that filters results (e.g. `customerId`), be aware of a
storage model trade-off:

**The pattern above** (each resource stored as an individual key in a context) enables the
`require-state` not-found guard but does **not** support field-based filtering — `listState`
returns individual values, not a JSON array you can run a JSONPath filter expression against.

**An alternative storage model** stores the whole collection as a single JSON array under one
key. This enables JSONPath filtering using the technique from the
[WireMock Cloud basket example](https://docs.wiremock.io/dynamic-state/basket-example):

```handlebars
{{#assign 'expr'}}$.[?(@.customerId == '{{jsonPath request.body '$.customerId'}}')]{{/assign}}
{{jsonPath (state 'allOrders' context='orders') expr}}
```

However, this model **cannot** use `require-state` for not-found detection (there is no
per-ID key to check absent), so the two approaches are incompatible.

For most gRPC simulation purposes, returning the full unfiltered list is the simplest and most
robust choice. Only switch to the array storage model if filtering is a hard requirement and
not-found detection can be handled another way (e.g. a separate fallback stub).

---

## Priority Summary for Stateful gRPC Stubs

| Stub Type                        | Priority | Body Patterns | customMatcher |
|----------------------------------|----------|---------------|---------------|
| Create (POST-like)               | default  | none          | none          |
| Get/Delete success               | default  | none          | none          |
| Get/Delete not-found (absent)    | 2        | none          | require-state |
| ListOrders (all)                 | default  | none          | none          |

Stateful gRPC stubs typically do NOT need `equalToJson` body patterns (and thus don't need
`priority: 1`) because the state store handles routing — the `require-state` guard at
`priority: 2` intercepts not-found cases before the success stub (default priority) matches.

---

## Import

1. Save the new stateful stub mappings to a local file (root key `mappings`) and import them
   using the `push` flow (`type: "stub_mappings"`, see
   [Transferring Files To and From a Mock API](file-transfer.md)) rather than
   `import_stubs_to_mock_api` — `push` takes a real file, which avoids hand-escaping the
   Handlebars templates in state-change stubs into a JSON string parameter.
2. Delete the old non-stateful stubs that have been replaced (e.g. specific `equalToJson`
   stubs). See [Stub Creation Guidelines](stub-creation.md) for the general `push` vs import
   preference.

---

## Testing Stateful Stubs

After pushing stateful stubs, verify the full lifecycle with grpcurl:

```bash
# 1. Create an order
grpcurl -d '{"customerId":"cust-123","items":[{"productId":"p1","name":"Widget","quantity":1,"price":9.99}]}' \
  <host>:443 <pkg>.OrderService/PlaceOrder

# 2. Retrieve the created order (use the orderId from step 1)
grpcurl -d '{"orderId":"<id-from-step-1>"}' <host>:443 <pkg>.OrderService/GetOrder

# 3. Verify not-found for an unknown ID
grpcurl -d '{"orderId":"ord-0000"}' <host>:443 <pkg>.OrderService/GetOrder
# Expect: Code: NotFound

# 4. List all orders
grpcurl <host>:443 <pkg>.OrderService/ListOrders
```

Reset state between test runs using `reset_state` if the mock API accumulates unwanted data.
