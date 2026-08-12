> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# OpenAPI Validation

> Validating mock API requests and responses against OpenAPI

Validation settings can be used to ensure that requests made to your mock API and responses returned by your mock API
are compliant with your OpenAPI specification.
Settings for OpenAPI validation can be found in the Settings tab on the OpenAPI page.
There are four options for OpenAPI validation: no validation, soft validation (the default), hard validation, and hard
(spec-compliant) validation.

<img src="https://mintcdn.com/wiremockinc/g9sJeP1wcMQ9MxkP/images/openapi/validation-settings.png?fit=max&auto=format&n=g9sJeP1wcMQ9MxkP&q=85&s=db58e9504fc96a8441a0919d9614c616" width="50%" data-path="images/openapi/validation-settings.png" />

The "no validation" option will have no effect on your mock API.

Enabling soft validation will cause non-compliant requests to contain validation warnings in your mock API's request log.
Any request to the mock API and/or any response returned by the mock API containing data/attributes that do not conform
to the mock API's OpenAPI document will be highlighted on the request log page.
Details of how the request was invalid can also be viewed in the request log.

<img src="https://mintcdn.com/wiremockinc/9niDaTpLrBsVTNkq/images/openapi/validation-logs-soft.gif?s=1817df0cc72cc0b9fd04f35d24edcc2d" alt="OpenAPI validation logs" width="1262" height="960" data-path="images/openapi/validation-logs-soft.gif" />

Enabling hard validation will cause the same request log behavior as soft validation, with the added functionality of
returning error responses containing details of validation issues to invalid requests.

## Hard (spec-compliant) validation

Hard (spec-compliant) validation builds on hard validation by returning error responses whose body and `Content-Type`
are taken directly from your OpenAPI specification, rather than a fixed generic format.

When a request fails validation, WireMock Cloud looks up the error response declared in your spec for the relevant
status code (typically `400` or `422` for request failures, `500` for response failures).
[`4XX`, `5XX` and `default` response definitions](https://spec.openapis.org/oas/v3.2.0.html#fixed-fields-13) are
respected.

The response body example defined for that status code is rendered as a
[response template](/response-templating/basics), with the following variables available:

| Variable              | Description                                                                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `{{message}}`         | A human-readable summary of the validation failure, e.g. `Request failed OpenAPI validation`                                                           |
| `{{errors}}`          | A list of individual validation error message strings, e.g. `"required property 'field' not found"`. Iterate with `{{#each errors}}{{this}}{{/each}}`. |
| `{{response.status}}` | The HTTP status code of the error response                                                                                                             |

All standard WireMock response template helpers (e.g. `{{request.method}}`, `{{request.path}}`) are also available.

If the matched error response has a schema but no example, WireMock Cloud generates a body from the schema.
If no matching error response is defined at all, or the template fails to render, WireMock Cloud falls back to the
same [generic error body](#error-response-body) used by hard validation.

### Content negotiation

When the error response in your spec declares multiple media types, WireMock Cloud negotiates the response
`Content-Type` from the client's `Accept` header, serving the matching body. If no `Accept` header is present,
the first declared concrete media type is used.

## Error response body

In hard validation mode, an invalid request receives a JSON error response in WireMock Cloud's
standard error format. The same body is returned in hard (spec-compliant) mode whenever a
spec-compliant body cannot be produced — that is, when the specification declares no matching error
response, or its template fails to render.

The response body matches the following schema:

```yaml theme={null}
$schema: https://json-schema.org/draft/2020-12/schema
type: object
required: [errors]
properties:
  errors:
    type: array
    description: One entry per validation failure
    items:
      type: object
      required: [code, title, detail]
      properties:
        code:
          const: 103
          description: WireMock Cloud error code for OpenAPI validation errors
        title:
          const: OpenAPI schema validation error
          description: Error category
        detail:
          type: string
          description: The individual validation error message
examples:
  - errors:
      - code: 103
        title: OpenAPI schema validation error
        detail: "required property 'field' not found"
```

## Validation sub-events

Whenever validation is enabled — soft, hard, or hard (spec-compliant) — each request or response that
fails validation is recorded against the served request in the request log as an `OpenAPI` sub-event
carrying the structured failure details. In soft mode this is the only effect; the hard modes
additionally return an error response.

Each sub-event has the following form, where `timeOffsetNanos` is the time of the failure relative to
the start of request handling:

```json theme={null}
{
  "type": "OpenAPI",
  "timeOffsetNanos": 0,
  "data": { }
}
```

The `data` object matches the following schema:

```yaml theme={null}
$schema: https://json-schema.org/draft/2020-12/schema
$defs:
  BaseValidationError:
    type: object
    required: [message, schemaPaths]
    properties:
      message:
        type: string
        description: Human-readable error message
      schemaPaths:
        type: array
        description: Locations in the OpenAPI spec schema that triggered the error
        items:
          type: object
          required: [path]
          properties:
            path:
              type: string
              description: JSON pointer path in the OpenAPI spec schema
            start:
              type: object
              properties:
                lineNumber: { type: integer }
                columnNumber: { type: integer }
            end:
              type: object
              properties:
                lineNumber: { type: integer }
                columnNumber: { type: integer }
  # A simple validation error carries only the base fields; unevaluatedProperties
  # forbids the schema-error fields, so a partial schema error matches neither
  # branch of the oneOf below and is rejected.
  SimpleValidationError:
    allOf:
      - $ref: '#/$defs/BaseValidationError'
    unevaluatedProperties: false
  SchemaValidationError:
    allOf:
      - $ref: '#/$defs/BaseValidationError'
      - required: [type, within, path, arguments]
        properties:
          type:
            type: string
            description: Validation rule that failed, e.g. required, type, minimum
          within:
            type: string
            enum: [body, query, header, path, cookie]
            description: Part of the HTTP message that was invalid
          path:
            type: string
            description: JSON path to the invalid value within the payload
          arguments:
            type: array
            items:
              type: [string, number, boolean]
            description: Values relevant to the failing rule, e.g. expected type or missing property name
          details:
            type: object
            description: Additional rule-specific detail
type: object
required: [httpMessage, errors]
properties:
  httpMessage:
    type: string
    enum: [request, response]
    description: Whether the request or response failed validation
  errors:
    type: array
    items:
      oneOf:
        - $ref: '#/$defs/SchemaValidationError'
        - $ref: '#/$defs/SimpleValidationError'
examples:
  - httpMessage: request
    errors:
      - message: "required property 'field' not found"
        type: required
        within: body
        path: "$"
        arguments: [field]
        details:
          property: field
        schemaPaths:
          - path: "#/paths/~1posts~1{id}/put/requestBody/content/application~1json/schema/required"
            start: { lineNumber: 16, columnNumber: 14 }
            end: { lineNumber: 17, columnNumber: 14 }
```
