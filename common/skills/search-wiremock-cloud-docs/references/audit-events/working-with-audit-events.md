> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Working with Audit Event JSON

> Programmatically working with Audit Event JSON

Each file saved in your S3 bucket follows the [new line delimited JSON specification](https://github.com/ndjson/ndjson-spec).

Each line of json in the file conforms to the following json schema:

```json  theme={null}
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "timestamp": {
      "type": "string",
      "format": "date-time"
    },
    "eventId": {
      "type": "string",
      "format": "uuid"
    },
    "entity": { "$ref": "#/definitions/entity" },
    "parentEntity": { "$ref": "#/definitions/entity" },
    "organisation": { "$ref": "#/definitions/entity" },
    "principal": { "$ref": "#/definitions/entity" },
    "clientType": {
      "anyOf": [
        {
          "type": "string",
          "enum": [
            "UI",
            "API",
            "SYSTEM",
            "ADMIN",
            "CLI"
          ]
        },
        { "type": "string" }
      ]
    },
    "action": {
      "anyOf": [
        {
          "type": "string",
          "enum": [
            "CREATE",
            "UPDATE",
            "DELETE",
            "SIGNUP",
            "LOGIN",
            "ACL_GRANT",
            "ACL_REVOKE",
            "INVITE"
          ]
        },
        { "type": "string" }
      ]
    },
    "before": {
      "type": "object"
    },
    "after": {
      "type": "object"
    },
    "subject": { "$ref": "#/definitions/entity" },
    "permission": {
      "oneOf": [
        {
          "type": "string",
          "const": "ALL_PERMISSIONS"
        },
        {
          "type": "object",
          "properties": {
            "permissions": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "string"
                  },
                  "friendlyId": {
                    "type": "string"
                  }
                },
                "required": [
                  "id",
                  "friendlyId"
                ]
              }
            }
          },
          "required": ["permissions"]
        }
      ]
    }
  },
  "required": [
    "timestamp",
    "eventId",
    "entity",
    "organisation",
    "principal",
    "clientType",
    "action"
  ],
  "definitions": {
    "entity": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "entityType": {
          "anyOf": [
            {
              "type": "string",
              "enum": [
                "MOCK_API",
                "USER",
                "TEAM",
                "ORGANISATION",
                "API_TEMPLATE",
                "API_TEMPLATE_CATALOGUE",
                "DATA_SOURCE",
                "KEY",
                "DATABASE_CONNECTION",
                "STUB_MAPPING",
                "MOCK_API_SETTINGS",
                "SUBSCRIPTION",
                "OPENAPI_GIT_INTEGRATION",
                "API_KEY",
                "S3_AUDIT_SINK"
              ]
            },
            { "type": "string" }
          ]
        }
      },
      "required": ["id", "name", "entityType"]
    }
  }
}
```

