> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Import & Recording Configuration Reference

> Reference for the config file used to customize imports and recordings using the WireMock CLI

The WireMock CLI accepts an import configuration file, which controls how stubs are created during a recording.

This file can be used to specify a duplicate policy, indicating what should be done when two recorded events are
recorded that would result in the same stub request being generated.

It can also be used to specify a set of stub transformation rules, allowing you to modify a number of aspects of the
generated stubs e.g. matching the body using a few `matchesJsonPath` expressions rather than a single `equalToJson`
matcher (which can be both brittle and slow for large/complex JSON documents).

## Usage

```shell  theme={null}
wiremock record http://private-endpoint --import-config-file=<path>
```

Or for multi-domain recording:

```shell  theme={null}
wiremock record-many --import-config-file=<path>
```

## Duplicate policy

The duplicate policy determines what happens if the stub generated from a recorded request has a request pattern identical
to that of an existing stub.

The available policies are:

1. `ignore` - the existing stub is left unchanged and the new request is discarded
2. `overwrite` - the existing stub is updated to the attributes of the new one
3. `create_new` - a new stub is created
4. `create_scenarios` - all stubs are created as part of a scenario

The default policy is `overwrite`.

When specifying `create_new` the new stub will be inserted above the existing one, so the new one will be matched first
unless further edits are applied.

The policy can be specified in the config file as follows:

```yaml  theme={null}
import:
  duplicatePolicy: ignore # overwrite|create_new|ignore|create_scenarios
```

### Scenarios

When using the `create_scenarios` duplicate policy, all stubs imported with the same request pattern will be added to the
same scenario (a scenario with the same name). You can read more about scenarios in the [Simple Scenarios](/dynamic-state/stateful-scenarios)
section.

All scenarios are created within a recording session.  Depending on your recording batching configuration, your recording
session may contain multiple imports into your mock API, and the scenarios are created and managed across all the imports
within the same recording session. The scenarios created during a recording session have the recording session id in
their name, so there are no scenario clashes across multiple recording sessions.  Scenarios are named in the following
format:

`scenario-<request-method>-<request-path>-<recording-session-id>-<request-pattern-hash>`

This means that if you record a set of stubs into a scenario in one recording session and then record the same set of
stubs into a scenario in a different recording session, the scenarios will be named differently to isolate them from
each other.  The stubs recorded second will be inserted above the previous import so will match first unless further
edits are applied.

Scenarios are created in the order the stubs are imported.  For example, importing 3 stubs with the same request pattern
will result in the following scenario being created:

* Third stub importd
  * Scenario name set to the same as the first stub
  * Required scenario state - `step-3-<scenario-name>`
  * New scenario state - empty as this is the terminal state
* Second stub importd
  * Scenario name set to the same as the first stub
  * Required scenario state - `step-2-<scenario-name>`
  * New scenario state - `step-3-<scenario-name>`
* First stub importd
  * Scenario name set using the format above
  * Required scenario state - `Started`
  * New scenario state - `step-2-<scenario-name>`

## Transformation rules

By default recording produces a stub that matches on the specific method and full path and query of each request.
The config file can specify any number of rules for generating more or less specific matching criteria:

```yaml  theme={null}
import:
  stubTemplateTransformationRules:
  - filter: {}
    template: {}
```

Each rule has two elements:

1. a `filter` which controls whether the rule is applied to the generated stub. This is optional - if omitted the
   template will *always* be applied.
2. a `template` which generates request matchers to apply to the stub

The rules are additive - all the rules which have a `filter` which matches the recorded request will be used to generate
matchers, which will be added in turn to the generated stub.

When more than one rule could both match and specify different matchers for the same element (for instance the first
specifies that the `Content-Type` header is `equalTo` `"application/json"`, and the second that the `Content-Type`
header `contains` `"json"`), the last defined rule will win.

Finally a check is made that the generated stub would still match the recorded request from which it was generated. If
it would not the entire stub is discarded and no stub is generated at all for that request.

### Templating

Where matchers have a right hand side the `{{ recordedValue }}` macro may be used to capture what that value had
on the recorded request. For instance, the following rule:

```yaml  theme={null}
import:
  stubTemplateTransformationRules:
  - filter:
      request:
        headers:
          Security-Context:
            matchesJsonPath: "$.userId"
    template:
      request:
        headers:
          Security-Context:
            matchesJsonPath:
              expression: "$.userId"
              equalTo: "{{ recordedValue }}"
```

when matched against this request:

```http request theme={null}
GET /
Security-Context: { "userId": "usr_123" }
```

would produce a stub mapping with the following request matcher:

```json  theme={null}
{
  "request": {
    "method": "GET",
    "url": "/",
    "headers": {
      "Security-Context": {
        "matchesJsonPath": {
          "expression": "$.userId",
          "equalTo": "usr_123"
        }
      }
    }
  }
}
```

This would allow recording different stubs for requests made by different users.

### Limitations

1. At present no logic other than replacement of the `{{ recordedValue }}` macro can be applied in the template, though
   request matchers can be hard coded.

2. The `{{ recordedValue }}` macro cannot currently be used in an `equalToJson`, `equalToXml` or `matching` request
   matcher.

3. The `filter` only contains a `request` matcher - it is not yet possible to apply rules conditionally based on the
   response.

4. The `template` only contains a `request` matcher - it is not yet possible to define changes to the response
   definition in these rules.

## Reference

The format of the import config file is defined by the [import-config-file-schema](https://static.wiremock.io/schemas/wiremock-import-config.yaml-schema.json)
JSON schema.

