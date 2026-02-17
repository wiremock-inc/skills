# Making stubs stateful

If asked to convert a collection of stubs to be stateful, follow these guidelines in order to generate
a set of stubs to be imported via import_stubs_to_mock_api:

* Avoid using generate_stateful_stub_set when converting existing stubs to be stateful. Use this tool when
starting from a prompt only.
* Do not call clear_mock_api unless explicitly asked.
* See stub_creation documentation for general guidelines on how to create stubs.
* If the mock API is of the rest/openapi type, update the OpenAPI description via the put_openapi tool
to include all new paths and operations created where WireMock Cloud has not done this automatically
(which can happen when response templating is enabled for a stub).
These should include schemas and examples for requests and responses.

## Stateful mocking overview
WireMock Cloud supports stateful mocking via a key-value store. Keys are stored in a "context",
which is a named bucket of key-value pairs.  Values are JSON documents.

## Setting state values
State values are set via a serve event listener assigned to a stub. This is configured with a set
of operations that each sets a state value for a specific key in a specific context.

Operation types are:
* SET - sets a value for a key in a context that is persisted between requests
* REQUEST_VAR - sets a value that only exists for the lifetime of the current HTTP request
* DELETE - deletes a state value
* DELETE_CONTEXT - deletes an entire context

Context, key and value can all be assigned via Handlebars expressions and have the same template
model and helper functions available as with WireMock's standard response templating.

Here is an example of a stub with the serve event listener added:

```json
{
    "name" : "Create charges",
    "request" : {
      "urlPathTemplate" : "/charges",
      "method" : "POST"
    },
    "response" : {
      "status" : 201,
      "body" : "{{#formatJson}}\n  {{state id context=collectionContext}}\n{{/formatJson}}",
      "headers" : {
        "Content-Type" : "application/json"
      },
      "transformers" : [ "response-template" ]
    },
    "serveEventListeners" : [ {
      "name" : "change-state",
      "parameters" : {
        "operations" : [ {
          "context" : "local",
          "key" : "id",
          "operation" : "REQUEST_VAR",
          "phase" : "AFTER_MATCH",
          "value" : "{{randomValue type='UUID'}}"
        }, {
          "context" : "local",
          "key" : "collectionContext",
          "operation" : "REQUEST_VAR",
          "phase" : "AFTER_MATCH",
          "value" : "charges"
        }, {
          "context" : "{{collectionContext}}",
          "key" : "{{id}}",
          "operation" : "SET",
          "phase" : "AFTER_MATCH",
          "value" : "{{#jsonMerge request.body removeNulls=true}}\n{\n  \"id\" : \"{{id}}\",\n  \"customer\" : \"/customers/5931ed73-dcd4-4e24-ad24-975ac288fa7f\",\n  \"created\" : \"2023-09-03T10:31:22Z\",\n  \"status\" : \"pending\",\n  \"customerId\" : null\n}\n{{/jsonMerge}}"
        } ]
      }
    } ]
  }
```

### Best practices
Create IDs via a REQUEST_VAR operation and then use that ID in subsequent operations.

Try to generate IDs that match the format used by the API. For instance, for an API with IDs like
`INV2-NS4E-L7P4-RZ6B-KNZY`, use
`INV2-{{randomValue type='ALPHANUMERIC' length=4 uppercase=true}}-{{randomValue type='ALPHANUMERIC' length=4 uppercase=true}}-{{randomValue type='ALPHANUMERIC' length=4 uppercase=true}}-{{randomValue type='ALPHANUMERIC' length=4 uppercase=true}}`

If IDs are numeric, use `{{randomValue type='NUMERIC' length=10}}`.

Otherwise, use UUIDs: `{{randomValue type='UUID'}}`.

Create context names via a REQUEST_VAR operation and then use that context name in subsequent operations.
Context names should reflect the collection path in the URL for REST APIs.

### jsonMerge semantics

`{{#jsonMerge <base>}}...<overlay>...{{/jsonMerge}}` deep-merges the overlay (block content) on top of the base (first argument). **On key conflicts, the overlay wins.**

This means:
- Fields in `request.body` that also appear in the overlay will be **overridden** by the overlay value.
- Only put fields in the overlay that are server-generated (`id`, `created`, `status`, etc.) or that you deliberately want to override.
- **Never** include request-body passthrough fields (e.g. `name`, `email`, `description`) in the overlay — they will be overridden even if the client sent them.

**`removeNulls=true`** strips all null-valued keys from the merged result. This is useful when a request body field needs to be consumed but not included in the stored state (e.g. renaming `customerId` in the request to a `customer` link in the response — set `"customerId": null` in the overlay to remove it). However:
- Do **not** use `removeNulls=true` if the response schema has legitimately nullable fields (e.g. `"address": null`), as they will also be stripped.
- If you need to both rename/remove a field AND keep nullable fields, consider computing the value via a `REQUEST_VAR` first and referencing it in the overlay without `removeNulls`.

**Example — correct CREATE template:**
```
"value": "{{#jsonMerge request.body}}\n{\"id\":\"{{id}}\",\"object\":\"charge\",\"status\":\"pending\",\"created\":{{now format='epoch'}}}\n{{/jsonMerge}}"
```
The overlay contains only server-generated fields. Client-supplied fields (`amount`, `currency`, etc.) pass through from `request.body` unchanged.

**Example — removeNulls for field renaming:**
```
"value": "{{#jsonMerge request.body removeNulls=true}}\n{\"id\":\"{{id}}\",\"customer\":\"/customers/{{jsonPath request.body '$.customerId'}}\",\"customerId\":null}\n{{/jsonMerge}}"
```
`customerId` from the request is consumed to build the `customer` link, then nulled and stripped.

### Handlebars/JSON brace collisions in SET values

When a Handlebars expression appears at the end of a JSON object on a single line, the closing braces collide — e.g. `{{now format='epoch'}}}` — and Handlebars interprets `}}}` as a triple-stache (raw/unescaped output), corrupting the value and causing the SET to silently fail.

**Always pretty-print JSON in SET value templates** to keep Handlebars `}}` and JSON `}` on separate lines:

**Broken** (single line — `}}}` triggers triple-stache):
```
"value": "{\"id\":\"{{id}}\",\"created\":{{now format='epoch'}}}"
```

**Working** (pretty-printed — braces separated):
```
"value": "{\n  \"id\": \"{{id}}\",\n  \"created\": {{now format='epoch'}}\n}"
```

This applies to all Handlebars expressions at JSON object/array boundaries, not just `{{now}}`.

## Retrieving state values
State values can be retrieved in response header, bodies and webhook request bodies via Handlebars,
using two helpers:
* state - retrieves a state value by context and key
* listState - retrieves all values in a context

An example of retrieving a single state item (which might be used in a GET response body for a single item endpoint):

```handlebars
{{#formatJson}}
  {{state id context=collectionContext}}
{{/formatJson}}
```

An example of retrieving all state items (which might be used in a GET response body for a collection endpoint):

```handlebars
{{#formatJson}}
  [{{arrayJoin ',' (listState collectionContext)}}]
{{/formatJson}}
```

## Request matching based on state
Requests can be matched based on state values via the "require-state" custom request matcher.

This is configured as a customMatcher extension in the WireMock request JSON e.g. the following
only matches if the state value for the charge ID in the URL is absent:

```json
{
  "name" : "Not found - charges by chargeId",
  "request" : {
    "urlPathTemplate" : "/charges/{chargeId}",
    "method" : "ANY",
    "customMatcher" : {
      "name" : "custom-and-matcher",
      "parameters" : {
        "matchers" : [ {
          "name" : "require-state",
          "parameters" : {
            "requirements" : [ {
              "key" : "{{request.path.chargeId}}",
              "absent" : true,
              "context" : "charges"
            } ]
          }
        } ]
      }
    }
  },
  "response" : {
    "status" : 404,
    "body" : "Not found",
    "headers" : {
      "Content-Type" : "text/plain"
    }
  }
}
```

Note that the outer `custom-and-matcher` should ALWAYS be used, even if only one inner matcher is present
as this allows the WireMock Cloud UI to insert additional matchers if the user requires.

**Important:** Only use `require-state` for 404/not-found stubs with `"absent": true`. Do not use `require-state` for positive state matching (i.e. to check that a key exists) — this causes unrecoverable 500 errors. Non-404 stubs (GET, PUT, DELETE for existing resources) should have **no `customMatcher`** at all. The 404 stub at `priority: 2` with `"absent": true` acts as a guard — when the key doesn't exist, it matches first; otherwise it falls through to the default-priority success stub.

## Example

Below is a full example of a stateful stub set for a simple charges API, implementing the following operations:
* POST /charges - creates a new charge
* GET /charges/{chargeId} - retrieves a charge
* GET /charges - retrieves all charges
* PUT /charges/{chargeId} - updates a charge
* DELETE /charges/{chargeId} - deletes a charge
* DELETE /charges - deletes all charges

```json
{
  "mappings" : [ {
    "name" : "Not found - charges by chargeId",
    "request" : {
      "urlPathTemplate" : "/charges/{chargeId}",
      "method" : "ANY",
      "customMatcher" : {
        "name" : "custom-and-matcher",
        "parameters" : {
          "matchers" : [ {
            "name" : "require-state",
            "parameters" : {
              "requirements" : [ {
                "key" : "{{request.path.chargeId}}",
                "absent" : true,
                "context" : "charges"
              } ]
            }
          } ]
        }
      }
    },
    "response" : {
      "status" : 404,
      "body" : "Not found",
      "headers" : {
        "Content-Type" : "text/plain"
      }
    },
    "persistent" : true,
    "priority" : 2
  }, {
    "name" : "List charges",
    "request" : {
      "urlPathTemplate" : "/charges",
      "method" : "GET"
    },
    "response" : {
      "status" : 200,
      "body" : "{{#formatJson}}\n  [{{arrayJoin ',' (listState collectionContext)}}]\n{{/formatJson}}",
      "headers" : {
        "Content-Type" : "application/json"
      },
      "transformers" : [ "response-template" ]
    },
    "persistent" : true,
    "serveEventListeners" : [ {
      "name" : "change-state",
      "parameters" : {
        "operations" : [ {
          "context" : "local",
          "key" : "collectionContext",
          "operation" : "REQUEST_VAR",
          "phase" : "AFTER_MATCH",
          "value" : "charges"
        } ]
      }
    } ]
  }, {
    "name" : "Get charges by chargeId",
    "request" : {
      "urlPathTemplate" : "/charges/{chargeId}",
      "method" : "GET"
    },
    "response" : {
      "status" : 200,
      "body" : "{{#formatJson}}\n  {{state id context=collectionContext}}\n{{/formatJson}}",
      "headers" : {
        "Content-Type" : "application/json"
      },
      "transformers" : [ "response-template" ]
    },
    "persistent" : true,
    "serveEventListeners" : [ {
      "name" : "change-state",
      "parameters" : {
        "operations" : [ {
          "context" : "local",
          "key" : "id",
          "operation" : "REQUEST_VAR",
          "phase" : "AFTER_MATCH",
          "value" : "{{request.path.chargeId}}"
        }, {
          "context" : "local",
          "key" : "collectionContext",
          "operation" : "REQUEST_VAR",
          "phase" : "AFTER_MATCH",
          "value" : "charges"
        } ]
      }
    } ]
  }, {
    "name" : "Create charges",
    "request" : {
      "urlPathTemplate" : "/charges",
      "method" : "POST"
    },
    "response" : {
      "status" : 201,
      "body" : "{{#formatJson}}\n  {{state id context=collectionContext}}\n{{/formatJson}}",
      "headers" : {
        "Content-Type" : "application/json"
      },
      "transformers" : [ "response-template" ]
    },
    "persistent" : true,
    "serveEventListeners" : [ {
      "name" : "change-state",
      "parameters" : {
        "operations" : [ {
          "context" : "local",
          "key" : "id",
          "operation" : "REQUEST_VAR",
          "phase" : "AFTER_MATCH",
          "value" : "{{randomValue type='UUID'}}"
        }, {
          "context" : "local",
          "key" : "collectionContext",
          "operation" : "REQUEST_VAR",
          "phase" : "AFTER_MATCH",
          "value" : "charges"
        }, {
          "context" : "{{collectionContext}}",
          "key" : "{{id}}",
          "operation" : "SET",
          "phase" : "AFTER_MATCH",
          "value" : "{{#jsonMerge request.body removeNulls=true}}\n{\n  \"id\" : \"{{id}}\",\n  \"customer\" : \"/customers/5931ed73-dcd4-4e24-ad24-975ac288fa7f\",\n  \"created\" : \"2023-09-03T10:31:22Z\",\n  \"status\" : \"pending\",\n  \"customerId\" : null\n}\n{{/jsonMerge}}"
        } ]
      }
    } ]
  }, {
    "name" : "Update charges by chargeId",
    "request" : {
      "urlPathTemplate" : "/charges/{chargeId}",
      "method" : "PUT"
    },
    "response" : {
      "status" : 200,
      "body" : "{{#formatJson}}\n  {{state id context=collectionContext}}\n{{/formatJson}}",
      "headers" : {
        "Content-Type" : "application/json"
      },
      "transformers" : [ "response-template" ]
    },
    "persistent" : true,
    "serveEventListeners" : [ {
      "name" : "change-state",
      "parameters" : {
        "operations" : [ {
          "context" : "local",
          "key" : "id",
          "operation" : "REQUEST_VAR",
          "phase" : "AFTER_MATCH",
          "value" : "{{request.path.chargeId}}"
        }, {
          "context" : "local",
          "key" : "collectionContext",
          "operation" : "REQUEST_VAR",
          "phase" : "AFTER_MATCH",
          "value" : "charges"
        }, {
          "context" : "{{collectionContext}}",
          "key" : "{{id}}",
          "operation" : "SET",
          "phase" : "AFTER_MATCH",
          "value" : "{{jsonMerge previousValue request.body removeNulls=true}}"
        } ]
      }
    } ]
  }, {
    "name" : "Delete charges by chargeId",
    "request" : {
      "urlPathTemplate" : "/charges/{chargeId}",
      "method" : "DELETE"
    },
    "response" : {
      "status" : 204
    },
    "persistent" : true,
    "serveEventListeners" : [ {
      "name" : "change-state",
      "parameters" : {
        "operations" : [ {
          "context" : "local",
          "key" : "id",
          "operation" : "REQUEST_VAR",
          "phase" : "AFTER_MATCH",
          "value" : "{{request.path.chargeId}}"
        }, {
          "context" : "local",
          "key" : "collectionContext",
          "operation" : "REQUEST_VAR",
          "phase" : "AFTER_MATCH",
          "value" : "charges"
        }, {
          "context" : "{{collectionContext}}",
          "key" : "{{id}}",
          "operation" : "DELETE",
          "phase" : "AFTER_MATCH"
        } ]
      }
    } ]
  }, {
    "name" : "Delete all charges",
    "request" : {
      "urlPathTemplate" : "/charges",
      "method" : "DELETE"
    },
    "response" : {
      "status" : 204
    },
    "persistent" : true,
    "serveEventListeners" : [ {
      "name" : "change-state",
      "parameters" : {
        "operations" : [ {
          "context" : "local",
          "key" : "collectionContext",
          "operation" : "REQUEST_VAR",
          "phase" : "AFTER_MATCH",
          "value" : "charges"
        }, {
          "context" : "{{collectionContext}}",
          "operation" : "DELETE_CONTEXT",
          "phase" : "AFTER_MATCH"
        } ]
      }
    } ]
  } ]
}
```

## JSON Schema for State Change Operations

The following YAML schema defines the structure for state change operations in WireMock serve event listeners:

```yaml
$schema: "http://json-schema.org/draft-07/schema#"
title: "WireMock State Change Serve Event Listener"
description: "Schema for WireMock serve event listeners that perform state operations"
type: object
properties:
  name:
    type: string
    const: "change-state"
    description: "The name of the serve event listener"
  parameters:
    type: object
    properties:
      operations:
        type: array
        description: "Array of state operations to perform"
        items:
          type: object
          properties:
            context:
              type: string
              description: "The context (bucket) where the state value is stored. Can use Handlebars expressions."
            key:
              type: string
              description: "The key for the state value. Can use Handlebars expressions."
            operation:
              type: string
              enum: ["SET", "REQUEST_VAR", "DELETE", "DELETE_CONTEXT"]
              description: |
                The type of operation to perform:
                - SET: Sets a value that persists between requests
                - REQUEST_VAR: Sets a value that only exists for the current request
                - DELETE: Deletes a specific state value
                - DELETE_CONTEXT: Deletes an entire context
            phase:
              type: string
              enum: ["BEFORE_MATCH", "AFTER_MATCH"]
              description: "When to execute the operation relative to request matching"
            value:
              type: string
              description: "The value to set. Can use Handlebars expressions. Not required for DELETE and DELETE_CONTEXT operations."
          required: ["context", "operation", "phase"]
          allOf:
            - if:
                properties:
                  operation:
                    enum: ["SET", "REQUEST_VAR"]
              then:
                required: ["key", "value"]
            - if:
                properties:
                  operation:
                    const: "DELETE"
              then:
                required: ["key"]
            - if:
                properties:
                  operation:
                    const: "DELETE_CONTEXT"
              then:
                not:
                  required: ["key", "value"]
    required: ["operations"]
required: ["name", "parameters"]
```
